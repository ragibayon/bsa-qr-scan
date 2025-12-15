// app/components/Header.tsx
import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export default function Header({
  title = "Bangladesh Student Association",
  subtitle = "Texas State University",
  compact = false,
}: HeaderProps) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-4 ${
        compact ? "" : "py-4"
      } hover:opacity-90 transition`}
    >
      <Image
        src="/logo.png"
        alt="Bangladesh Student Association Logo"
        width={44}
        height={44}
        className="rounded-full"
        priority
      />

      <div>
        {/* Desktop / Laptop */}
        <h1 className="hidden sm:block text-base sm:text-lg font-medium tracking-wide text-white">
          {title}
        </h1>

        {/* Mobile */}
        <h1 className="block sm:hidden text-base font-medium text-white">
          BSA
        </h1>

        {/* Subtitle only on larger screens */}
        <p className="hidden sm:block text-xs sm:text-sm text-white/80">
          {subtitle}
        </p>
      </div>
    </Link>
  );
}
