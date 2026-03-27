import fs from "fs";
import path from "path";

// --- Types ---

export type ActivityType =
  | "breast_both"
  | "breast_left"
  | "breast_right"
  | "breast_unknown"
  | "formula"
  | "pumped"
  | "diaper"
  | "night_sleep"
  | "nap";

export interface BaseActivity {
  type: ActivityType;
  startTime: string; // ISO string
  endTime?: string;
  durationMinutes?: number;
  memo?: string;
}

export interface BreastFeedingActivity extends BaseActivity {
  type: "breast_both" | "breast_left" | "breast_right" | "breast_unknown";
  leftMinutes?: number;
  rightMinutes?: number;
}

export interface FormulaActivity extends BaseActivity {
  type: "formula";
  amountMl: number;
}

export interface PumpedActivity extends BaseActivity {
  type: "pumped";
  amountMl: number;
}

export interface DiaperActivity extends BaseActivity {
  type: "diaper";
  stoolType: string;
}

export interface SleepActivity extends BaseActivity {
  type: "night_sleep" | "nap";
}

export type Activity =
  | BreastFeedingActivity
  | FormulaActivity
  | PumpedActivity
  | DiaperActivity
  | SleepActivity;

export interface DailySummary {
  date: string; // YYYY-MM-DD
  feedingCount: number;
  feedingTotalMinutes: number;
  leftMinutes: number;
  rightMinutes: number;
  formulaCount: number;
  formulaMl: number;
  pumpedCount: number;
  pumpedMl: number;
  diaperCount: number;
  napMinutes: number;
  nightSleepMinutes: number;
}

export interface MonthlyData {
  month: string; // YYYYMM
  label: string; // e.g. "2026년 2월"
  activities: Activity[];
  dailySummaries: DailySummary[];
}

// --- Parsing ---

function parseDateTime(str: string): string {
  // "2026-02-27 04:06 PM" -> ISO string
  const match = str.trim().match(
    /(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2}):(\d{2})\s+(AM|PM)/
  );
  if (!match) return str.trim();
  const [, year, month, day, hourStr, minute, ampm] = match;
  let hour = parseInt(hourStr);
  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;
  return `${year}-${month}-${day}T${hour.toString().padStart(2, "0")}:${minute}:00`;
}

function parseActivityType(typeStr: string): ActivityType {
  const t = typeStr.trim();
  if (t.startsWith("모유")) {
    if (t.includes("양쪽")) return "breast_both";
    if (t.includes("왼쪽")) return "breast_left";
    if (t.includes("오른쪽")) return "breast_right";
    return "breast_unknown";
  }
  if (t === "분유") return "formula";
  if (t === "유축수유") return "pumped";
  if (t === "기저귀") return "diaper";
  if (t === "밤잠") return "night_sleep";
  if (t === "낮잠") return "nap";
  return "breast_unknown";
}

function parseRecord(block: string): Activity | null {
  const lines = block
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  if (lines.length === 0) return null;

  // First line: time range or single time
  const timeLine = lines[0];
  let startTime: string;
  let endTime: string | undefined;

  if (timeLine.includes("~")) {
    const [s, e] = timeLine.split("~");
    startTime = parseDateTime(s);
    endTime = parseDateTime(e);
  } else {
    startTime = parseDateTime(timeLine);
  }

  // Parse key-value pairs
  const props: Record<string, string> = {};
  for (let i = 1; i < lines.length; i++) {
    const colonIdx = lines[i].indexOf(":");
    if (colonIdx > 0) {
      const key = lines[i].substring(0, colonIdx).trim();
      const value = lines[i].substring(colonIdx + 1).trim();
      props[key] = value;
    }
  }

  const typeStr = props["기록 종류"] || "";
  const activityType = parseActivityType(typeStr);
  const durationMatch = props["소요시간"]?.match(/(\d+)/);
  const durationMinutes = durationMatch ? parseInt(durationMatch[1]) : undefined;
  const memo = props["메모"];

  const base = { startTime, endTime, durationMinutes, memo };

  if (
    activityType === "breast_both" ||
    activityType === "breast_left" ||
    activityType === "breast_right" ||
    activityType === "breast_unknown"
  ) {
    const leftMatch = props["모유 왼쪽 시간"]?.match(/(\d+)/);
    const rightMatch = props["모유 오른쪽 시간"]?.match(/(\d+)/);
    return {
      ...base,
      type: activityType,
      leftMinutes: leftMatch ? parseInt(leftMatch[1]) : undefined,
      rightMinutes: rightMatch ? parseInt(rightMatch[1]) : undefined,
    };
  }

  if (activityType === "formula") {
    const mlMatch = props["분유 총 양(ml)"]?.match(/(\d+)/);
    return {
      ...base,
      type: "formula",
      amountMl: mlMatch ? parseInt(mlMatch[1]) : 0,
    };
  }

  if (activityType === "pumped") {
    const mlMatch = props["유축수유 총 양(ml)"]?.match(/(\d+)/);
    return {
      ...base,
      type: "pumped",
      amountMl: mlMatch ? parseInt(mlMatch[1]) : 0,
    };
  }

  if (activityType === "diaper") {
    return {
      ...base,
      type: "diaper",
      stoolType: props["배변 형태"] || "unknown",
    };
  }

  if (activityType === "night_sleep" || activityType === "nap") {
    return { ...base, type: activityType };
  }

  return null;
}

function getDateFromISO(iso: string): string {
  return iso.substring(0, 10);
}

function buildDailySummaries(activities: Activity[]): DailySummary[] {
  const byDate = new Map<string, Activity[]>();

  for (const a of activities) {
    const date = getDateFromISO(a.startTime);
    if (!byDate.has(date)) byDate.set(date, []);
    byDate.get(date)!.push(a);
  }

  const summaries: DailySummary[] = [];
  for (const [date, acts] of byDate) {
    const summary: DailySummary = {
      date,
      feedingCount: 0,
      feedingTotalMinutes: 0,
      leftMinutes: 0,
      rightMinutes: 0,
      formulaCount: 0,
      formulaMl: 0,
      pumpedCount: 0,
      pumpedMl: 0,
      diaperCount: 0,
      napMinutes: 0,
      nightSleepMinutes: 0,
    };

    for (const a of acts) {
      if (
        a.type === "breast_both" ||
        a.type === "breast_left" ||
        a.type === "breast_right" ||
        a.type === "breast_unknown"
      ) {
        summary.feedingCount++;
        summary.feedingTotalMinutes += a.durationMinutes || 0;
        summary.leftMinutes += a.leftMinutes || 0;
        summary.rightMinutes += a.rightMinutes || 0;
      } else if (a.type === "formula") {
        summary.formulaCount++;
        summary.formulaMl += a.amountMl;
      } else if (a.type === "pumped") {
        summary.pumpedCount++;
        summary.pumpedMl += a.amountMl;
      } else if (a.type === "diaper") {
        summary.diaperCount++;
      } else if (a.type === "nap") {
        summary.napMinutes += a.durationMinutes || 0;
      } else if (a.type === "night_sleep") {
        summary.nightSleepMinutes += a.durationMinutes || 0;
      }
    }

    summaries.push(summary);
  }

  summaries.sort((a, b) => a.date.localeCompare(b.date));
  return summaries;
}

function parseFile(filePath: string): Activity[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const blocks = content.split("====================");
  const activities: Activity[] = [];

  for (const block of blocks) {
    const activity = parseRecord(block);
    if (activity) activities.push(activity);
  }

  return activities;
}

export function loadAllData(): MonthlyData[] {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) return [];

  const months = fs
    .readdirSync(dataDir)
    .filter((d) => /^\d{6}$/.test(d))
    .sort();

  const result: MonthlyData[] = [];

  for (const month of months) {
    const monthDir = path.join(dataDir, month);
    const files = fs
      .readdirSync(monthDir)
      .filter((f) => f.endsWith(".txt"))
      .sort();

    // Prefer ascending file, fallback to any txt
    const ascFile = files.find((f) => f.includes("asc"));
    const targetFile = ascFile || files[0];
    if (!targetFile) continue;

    const activities = parseFile(path.join(monthDir, targetFile));
    activities.sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    const year = parseInt(month.substring(0, 4));
    const mon = parseInt(month.substring(4, 6));
    const label = `${year}년 ${mon}월`;

    result.push({
      month,
      label,
      activities,
      dailySummaries: buildDailySummaries(activities),
    });
  }

  return result;
}
