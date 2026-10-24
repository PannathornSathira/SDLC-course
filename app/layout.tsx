import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Farmart - Grocery Supermarket",
  description: "Farmart online grocery store - Fresh food, dairy, and daily deals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&_*::-webkit-scrollbar]:w-2 [&_*::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-[#f1f1f1] [&_*::-webkit-scrollbar-track]:bg-[#f1f1f1] [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-sm [&_*::-webkit-scrollbar-thumb]:bg-slate-300 [&_*::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-thumb:hover]:bg-slate-400 [&_*::-webkit-scrollbar-thumb:hover]:bg-slate-400`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden bg-white text-[#171717] font-sans">{children}</body>
    </html>
  );
}
