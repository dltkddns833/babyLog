import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BabyLog - 성찬이 육아 대시보드",
  description: "BabyTime 데이터 시각화 대시보드",
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
      </head>
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
