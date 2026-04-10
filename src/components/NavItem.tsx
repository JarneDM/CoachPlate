"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const pathname = usePathname();

  // alright so im adding this comment for the future.
  // this is a bit of a hack to make sure that the "active" state of the nav item works correctly for theclient page
  // when visiting /dashboard/clients, the "Dashboard" nav item should not be active, but the "Clients" nav item should be active, and this was not the case cuz both of them were active
  // the logic is as follows: if the pathname starts with the href, then we check if the second part of the pathname (after splitting by "/")
  // is the same as the second part of the href, this way we can ensure that only the correct nav item is active
  const url = pathname === href || pathname.startsWith(`${href}/`);
  const rest = pathname.startsWith("/dashboard/");
  const isActive = rest ? pathname.split("/")[2] === href.split("/")[2] : url;

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
