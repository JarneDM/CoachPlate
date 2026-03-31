"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={[
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
        isActive ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-green-50 hover:text-green-700",
      ].join(" ")}
    >
      <span
        className={[
          "rounded-lg p-1.5 transition-colors",
          isActive ? "bg-green-100 text-green-700" : "bg-gray-50 text-gray-500 group-hover:bg-green-100 group-hover:text-green-700",
        ].join(" ")}
      >
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}
