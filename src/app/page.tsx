import { loadAllData } from "@/lib/parser";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const allData = loadAllData();

  return (
    <main className="min-h-screen py-4 px-3 sm:py-8 sm:px-4 max-w-6xl mx-auto">
      <header className="mb-5 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">BabyLog</h1>
        <p className="text-gray-500 text-sm sm:text-base mt-1">성찬이 육아 대시보드</p>
      </header>
      <Dashboard allData={allData} />
    </main>
  );
}
