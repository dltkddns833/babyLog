import { loadAllData } from "@/lib/parser";
import Dashboard from "@/components/Dashboard";
import HeartEasterEgg from "@/components/HeartEasterEgg";

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
    <main className="min-h-screen py-5 px-4 sm:py-8 sm:px-6 max-w-6xl mx-auto">
      <header className="mb-6 sm:mb-10 animate-slide-in">
        <div className="flex items-center gap-2.5">
          <HeartEasterEgg>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/baby.jpg" alt="성찬이" className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl shadow-md animate-float object-cover ring-2 ring-white/60" />
          </HeartEasterEgg>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
              찬찬기록
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
              성찬이의 성장 기록 · 생후 <span className="font-semibold text-purple-400">{daysOld}일</span>
            </p>
          </div>
        </div>
      </header>
      <Dashboard allData={allData} />
    </main>
  );
}
