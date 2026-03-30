import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "CoachPlate - v0.1.0",
  description: "Under construction",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen flex flex-col">
          <div className="flex-1 z-50">{children}</div>

          <footer className="border-t border-gray-200 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/80 z-40">
            <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500">
              <p>© {new Date().getFullYear()} CoachPlate</p>
              <nav className="flex flex-wrap items-center gap-4">
                <Link href="/terms" className="hover:text-gray-700 transition-colors">
                  Algemene voorwaarden
                </Link>
                <Link href="/privacy" className="hover:text-gray-700 transition-colors">
                  Privacybeleid
                </Link>
                <Link href="/cookies" className="hover:text-gray-700 transition-colors">
                  Cookiebeleid
                </Link>
                <Link href="/verwerkersovereenkomst" className="hover:text-gray-700 transition-colors">
                  Verwerkersovereenkomst
                </Link>
              </nav>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
