import type { DailySummary } from "./parser";

export interface Insight {
  type: "positive" | "neutral" | "watch";
  text: string;
}

const BIRTH_DATE = new Date("2026-01-27");

function getDaysOld(dateStr: string): number {
  const date = new Date(dateStr);
  return Math.floor((date.getTime() - BIRTH_DATE.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

export function analyzeFeedingCount(data: DailySummary[]): Insight[] {
  if (data.length === 0) return [];
  const insights: Insight[] = [];
  const counts = data.map((d) => d.feedingCount + d.formulaCount + d.pumpedCount);
  const avg = counts.reduce((s, c) => s + c, 0) / counts.length;
  const lastDaysOld = getDaysOld(data[data.length - 1].date);

  // 신생아 기준 수유 횟수 평가
  if (lastDaysOld <= 28) {
    if (avg >= 8) {
      insights.push({ type: "positive", text: `일평균 ${avg.toFixed(1)}회로 신생아 권장 횟수(8~12회)에 부합합니다.` });
    } else {
      insights.push({ type: "watch", text: `일평균 ${avg.toFixed(1)}회입니다. 신생아는 하루 8~12회 수유가 권장됩니다.` });
    }
  } else if (lastDaysOld <= 90) {
    if (avg >= 6) {
      insights.push({ type: "positive", text: `일평균 ${avg.toFixed(1)}회로 생후 1~3개월 권장 횟수(6~10회)에 부합합니다.` });
    } else {
      insights.push({ type: "watch", text: `일평균 ${avg.toFixed(1)}회입니다. 생후 1~3개월은 하루 6~10회 수유가 권장됩니다.` });
    }
  }

  // 추이 분석
  if (data.length >= 7) {
    const firstWeek = counts.slice(0, 7);
    const lastWeek = counts.slice(-7);
    const firstAvg = firstWeek.reduce((s, c) => s + c, 0) / 7;
    const lastAvg = lastWeek.reduce((s, c) => s + c, 0) / 7;
    const diff = lastAvg - firstAvg;
    if (Math.abs(diff) >= 2) {
      if (diff < 0) {
        insights.push({ type: "neutral", text: `월초 대비 수유 횟수가 줄어드는 추세입니다. 아기가 한 번에 더 많이 먹고 있을 수 있습니다.` });
      } else {
        insights.push({ type: "neutral", text: `월초 대비 수유 횟수가 늘어나는 추세입니다. 성장 급등기(growth spurt)일 수 있습니다.` });
      }
    }
  }

  return insights;
}

export function analyzeFeedingInterval(data: DailySummary[]): Insight[] {
  if (data.length === 0) return [];
  const insights: Insight[] = [];
  const intervals = data.filter((d) => d.avgFeedingInterval > 0).map((d) => d.avgFeedingInterval);
  if (intervals.length === 0) return [];

  const avg = intervals.reduce((s, v) => s + v, 0) / intervals.length;
  const lastDaysOld = getDaysOld(data[data.length - 1].date);

  if (lastDaysOld <= 28) {
    if (avg <= 180) {
      insights.push({ type: "positive", text: `평균 간격 ${Math.floor(avg / 60)}시간 ${Math.round(avg % 60)}분으로, 신생아 권장 간격(2~3시간)에 적합합니다.` });
    } else {
      insights.push({ type: "watch", text: `평균 간격이 3시간을 넘습니다. 신생아는 2~3시간 간격 수유가 권장됩니다.` });
    }
  } else if (lastDaysOld <= 90) {
    if (avg >= 120 && avg <= 240) {
      insights.push({ type: "positive", text: `평균 간격 ${Math.floor(avg / 60)}시간 ${Math.round(avg % 60)}분으로, 점차 안정적인 수유 리듬이 형성되고 있습니다.` });
    }
  }

  // 간격 안정성
  if (intervals.length >= 5) {
    const stdDev = Math.sqrt(intervals.reduce((s, v) => s + (v - avg) ** 2, 0) / intervals.length);
    if (stdDev < avg * 0.2) {
      insights.push({ type: "positive", text: "수유 간격이 일정하게 유지되고 있어 안정적인 패턴입니다." });
    } else if (stdDev > avg * 0.4) {
      insights.push({ type: "neutral", text: "수유 간격의 변동이 큰 편입니다. 클러스터 피딩이나 성장기 영향일 수 있습니다." });
    }
  }

  return insights;
}

export function analyzeFeedingDuration(data: DailySummary[]): Insight[] {
  if (data.length === 0) return [];
  const insights: Insight[] = [];
  const durations = data.filter((d) => d.avgFeedingDuration > 0).map((d) => d.avgFeedingDuration);
  if (durations.length === 0) return [];

  const avg = durations.reduce((s, v) => s + v, 0) / durations.length;

  if (avg >= 10 && avg <= 30) {
    insights.push({ type: "positive", text: `1회 평균 ${Math.round(avg)}분으로 적정 범위(10~30분)입니다.` });
  } else if (avg < 10) {
    insights.push({ type: "watch", text: `1회 평균 ${Math.round(avg)}분으로 짧은 편입니다. 충분히 먹고 있는지 체중 변화를 확인해보세요.` });
  } else {
    insights.push({ type: "neutral", text: `1회 평균 ${Math.round(avg)}분으로 긴 편입니다. 아기가 젖에서 편안함을 느끼고 있을 수 있습니다.` });
  }

  // 추이
  if (durations.length >= 7) {
    const firstAvg = durations.slice(0, 7).reduce((s, v) => s + v, 0) / 7;
    const lastAvg = durations.slice(-7).reduce((s, v) => s + v, 0) / 7;
    if (lastAvg < firstAvg * 0.8) {
      insights.push({ type: "positive", text: "수유 시간이 점차 짧아지고 있습니다. 아기의 흡유력이 좋아지고 있는 신호입니다." });
    }
  }

  return insights;
}

export function analyzeTimeDistribution(data: DailySummary[]): Insight[] {
  if (data.length === 0) return [];
  const insights: Insight[] = [];

  const totalDay = data.reduce((s, d) => s + d.dayFeedingCount, 0);
  const totalNight = data.reduce((s, d) => s + d.nightFeedingCount, 0);
  const total = totalDay + totalNight;
  if (total === 0) return [];

  const nightPct = Math.round((totalNight / total) * 100);

  if (nightPct <= 25) {
    insights.push({ type: "positive", text: `야간 수유 비율이 ${nightPct}%로 낮은 편입니다. 밤잠 패턴이 잡혀가고 있습니다.` });
  } else if (nightPct >= 40) {
    insights.push({ type: "neutral", text: `야간 수유 비율이 ${nightPct}%입니다. 생후 초기에는 정상이며, 점차 줄어들 것입니다.` });
  }

  // 시간대 피크 분석
  const hourCounts = new Array(24).fill(0);
  for (const d of data) {
    for (const h of d.feedingHours) hourCounts[h]++;
  }
  const peakHour = hourCounts.indexOf(Math.max(...hourCounts));
  insights.push({ type: "neutral", text: `가장 수유가 잦은 시간은 ${peakHour}시입니다.` });

  return insights;
}

export function analyzeLeftRight(data: DailySummary[]): Insight[] {
  if (data.length === 0) return [];
  const insights: Insight[] = [];

  const totalLeft = data.reduce((s, d) => s + d.leftMinutes, 0);
  const totalRight = data.reduce((s, d) => s + d.rightMinutes, 0);
  const total = totalLeft + totalRight;
  if (total === 0) return [];

  const leftPct = Math.round((totalLeft / total) * 100);
  const diff = Math.abs(leftPct - 50);

  if (diff <= 10) {
    insights.push({ type: "positive", text: `좌/우 비율이 ${leftPct}:${100 - leftPct}로 균형이 잘 잡혀있습니다. 양쪽 모유량 유지에 좋습니다.` });
  } else if (diff <= 20) {
    insights.push({ type: "neutral", text: `좌/우 비율이 ${leftPct}:${100 - leftPct}입니다. 약간의 차이는 정상이지만, 적은 쪽을 먼저 물리면 균형에 도움됩니다.` });
  } else {
    const dominant = leftPct > 50 ? "왼쪽" : "오른쪽";
    insights.push({ type: "watch", text: `${dominant} 편중(${leftPct}:${100 - leftPct})이 있습니다. 적은 쪽을 먼저 물려 균형을 맞춰보세요.` });
  }

  return insights;
}

export function analyzeSleep(data: DailySummary[]): Insight[] {
  if (data.length === 0) return [];
  const insights: Insight[] = [];

  const sleepDays = data.filter((d) => d.nightSleepMinutes > 0 || d.napMinutes > 0);
  if (sleepDays.length === 0) return [];

  const avgNight = sleepDays.reduce((s, d) => s + d.nightSleepMinutes, 0) / sleepDays.length;
  const avgNap = sleepDays.reduce((s, d) => s + d.napMinutes, 0) / sleepDays.length;
  const totalAvg = (avgNight + avgNap) / 60;
  const lastDaysOld = getDaysOld(data[data.length - 1].date);

  if (lastDaysOld <= 90) {
    if (totalAvg >= 14) {
      insights.push({ type: "positive", text: `하루 평균 수면 ${totalAvg.toFixed(1)}시간으로 생후 1~3개월 권장 수면(14~17시간)에 부합합니다.` });
    } else {
      insights.push({ type: "neutral", text: `기록된 수면 시간은 하루 평균 ${totalAvg.toFixed(1)}시간입니다. 기록되지 않은 수면이 있을 수 있습니다.` });
    }
  }

  // 밤잠 추이
  if (sleepDays.length >= 7) {
    const lastWeekNight = sleepDays.slice(-7).reduce((s, d) => s + d.nightSleepMinutes, 0) / 7;
    const firstWeekNight = sleepDays.slice(0, 7).reduce((s, d) => s + d.nightSleepMinutes, 0) / 7;
    if (lastWeekNight > firstWeekNight * 1.2) {
      insights.push({ type: "positive", text: "밤잠 시간이 점차 늘어나고 있습니다. 수면 패턴이 발달하고 있는 좋은 신호입니다." });
    }
  }

  return insights;
}

export function analyzeDiaper(data: DailySummary[]): Insight[] {
  if (data.length === 0) return [];
  const insights: Insight[] = [];

  const counts = data.map((d) => d.diaperCount);
  const avg = counts.reduce((s, c) => s + c, 0) / counts.length;
  const lastDaysOld = getDaysOld(data[data.length - 1].date);

  if (lastDaysOld <= 42) {
    if (avg >= 3) {
      insights.push({ type: "positive", text: `일평균 ${avg.toFixed(1)}회 대변으로 충분한 수유량을 나타냅니다.` });
    } else if (avg >= 1) {
      insights.push({ type: "neutral", text: `일평균 ${avg.toFixed(1)}회 대변입니다. 생후 6주까지는 하루 3회 이상이 이상적입니다.` });
    }
  } else {
    if (avg >= 1) {
      insights.push({ type: "positive", text: `일평균 ${avg.toFixed(1)}회 대변입니다. 생후 6주 이후에는 빈도가 줄어드는 것이 정상입니다.` });
    }
  }

  // 0회인 날 체크
  const zeroDays = counts.filter((c) => c === 0).length;
  if (zeroDays > 0 && lastDaysOld <= 42) {
    insights.push({ type: "neutral", text: `대변이 없는 날이 ${zeroDays}일 있습니다. 2일 이상 연속이면 관찰이 필요합니다.` });
  }

  return insights;
}

export function analyzeOverall(data: DailySummary[]): Insight[] {
  if (data.length === 0) return [];
  const insights: Insight[] = [];
  const lastDaysOld = getDaysOld(data[data.length - 1].date);

  const totalFeedings = data.reduce((s, d) => s + d.feedingCount + d.formulaCount + d.pumpedCount, 0);
  const totalBottle = data.reduce((s, d) => s + d.formulaCount + d.pumpedCount, 0);

  if (totalBottle === 0) {
    insights.push({ type: "positive", text: "이번 달은 완전모유수유를 유지하고 있습니다." });
  } else {
    const bottlePct = Math.round((totalBottle / totalFeedings) * 100);
    if (bottlePct <= 5) {
      insights.push({ type: "positive", text: `젖병 수유 비율이 ${bottlePct}%로 거의 완전모유수유에 가깝습니다.` });
    } else {
      insights.push({ type: "neutral", text: `젖병 수유(분유+유축) 비율이 ${bottlePct}%입니다.` });
    }
  }

  if (lastDaysOld >= 28 && lastDaysOld <= 42) {
    insights.push({ type: "neutral", text: "생후 4~6주는 수유 패턴이 안정화되는 시기입니다. 일관된 수유 리듬을 유지해주세요." });
  } else if (lastDaysOld > 42 && lastDaysOld <= 90) {
    insights.push({ type: "neutral", text: "생후 6주~3개월은 수유 간격이 점차 벌어지고, 밤잠이 길어지는 시기입니다." });
  }

  return insights;
}
