import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EasyPoster - AI 海报生成器",
  description: "使用 AI 快速生成精美海报，支持多种风格，一键下载",
  keywords: ["AI", "海报生成", "DALL-E", "海报设计", "AI绘图"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
