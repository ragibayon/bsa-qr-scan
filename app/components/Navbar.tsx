"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Header from "./Header";

export default function Navbar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `text-base sm:text-lg font-medium transition-colors duration-200 border-b-2 ${
      pathname === path
        ? "text-white border-blue-400"
        : "text-white/70 border-transparent hover:text-blue-400 hover:border-blue-400"
    }`;

  return (
    <header className="w-full border-b border-white/10 bg-black">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3 sm:px-6 sm:py-3">
        {/* Brand (reused Header style) */}
        <Header compact />

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          {/* <Link href="/" className={linkClass("/")}>
            Home
          </Link> */}

          <Link href="/scan" className={linkClass("/scan")}>
            QR Scan
          </Link>
        </nav>
      </div>
    </header>
  );
}
