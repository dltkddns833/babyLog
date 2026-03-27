import { loadAllData } from "@/lib/parser";
import Dashboard from "@/components/Dashboard";

const BIRTH_DATE = new Date("2026-01-27");

function getDaysOld(): number {
  const today = new Date();
  const diff = today.getTime() - BIRTH_DATE.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}

export default function Home() {
  const allData = loadAllData();
  const daysOld = getDaysOld();

  return (
    <main className="min-h-screen py-4 px-3 sm:py-8 sm:px-4 max-w-6xl mx-auto">
      <header className="mb-5 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">BabyLog</h1>
        <p className="text-gray-500 text-sm sm:text-base mt-1">
          성찬이 육아 대시보드 · 생후 {daysOld}일
        </p>
      </header>
      <Dashboard allData={allData} />
    </main>
  );
}
