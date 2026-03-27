import { loadAllData } from "@/lib/parser";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const allData = loadAllData();

  return (
    <main className="min-h-screen py-8 px-4 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">BabyLog</h1>
        <p className="text-gray-500 mt-1">성찬이 육아 대시보드</p>
      </header>
      <Dashboard allData={allData} />
    </main>
  );
}
