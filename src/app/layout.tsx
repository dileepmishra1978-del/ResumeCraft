import type { Metadata } from "next";
import { Outfit, Manrope } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ResumeCraft — AI ATS Resume Builder (RenderCV Engine)",
  description: "Build 100% ATS-compliant, high-impact resumes powered by RenderCV typography, ResumeCraft XYZ formula rewrites, and AI job tailoring.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-gray-50 text-gray-900 selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
