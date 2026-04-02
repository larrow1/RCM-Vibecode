import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RCM Assessment Platform — App Library",
  description: "Catalog of tools for assessment consultants analyzing financials, org structures, contracts, and operations",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
