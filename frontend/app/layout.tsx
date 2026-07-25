import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nawy Apartments",
  description: "Browse apartment listings",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/nawy-logo.png" alt="Nawy" width={40} height={40} priority />
              <span className="text-lg font-semibold text-teal-700">Apartments</span>
            </Link>
            <Link
              href="/apartments/new"
              className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
            >
              Add apartment
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
