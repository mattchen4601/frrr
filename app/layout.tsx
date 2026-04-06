import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "反诈演示站",
  description: "用于家庭反诈演示的虚拟账户页面",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
