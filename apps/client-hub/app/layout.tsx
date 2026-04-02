import type { Metadata } from "next";
import { Sidebar } from "@/components/sidebar";
import { SearchBar } from "@/components/search-bar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Client Hub — Consulting Platform",
  description: "Central dashboard for managing clients, contacts, and engagements",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
              <SearchBar />
            </header>
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
