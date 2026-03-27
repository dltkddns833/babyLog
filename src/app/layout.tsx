import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "찬찬기록 - 성찬이 육아 대시보드",
  description: "성찬이의 수유·수면·기저귀 기록 대시보드",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="text-gray-800 antialiased" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>{children}</body>
    </html>
  );
}
