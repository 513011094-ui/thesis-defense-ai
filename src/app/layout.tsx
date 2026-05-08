import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import MainContent from "@/components/layout/MainContent";

export const metadata: Metadata = {
  title: "一坨答辩 - AI模拟论文答辩系统",
  description: "让AI提前折磨你一次，别在现场崩",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-screen">
        <Sidebar />
        <MainContent>{children}</MainContent>
      </body>
    </html>
  );
}
