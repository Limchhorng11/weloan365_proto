import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Weloan365 — Mobile Prototype",
  description: "Interactive prototype for the Weloan365 mobile app",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1f5fff",
};

/**
 * Root layout — minimal HTML shell. Each route group provides its own
 * chrome via its own layout:
 *   - app/(prototype)/layout.tsx → phone frame + side panel + toast/sheet hosts
 *   - app/(workshop)/layout.tsx  → desktop reading layout for the workshop pack
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
