"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { Flag, LayoutDashboard, Menu, Users, X, LogIn, Tags, LucideIcon } from "lucide-react";
import { User } from "@supabase/supabase-js";

type MobileNavBarProps = {
  user: User | null;
};


export default function MobileNavBar({ user }: MobileNavBarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const role = user?.user_metadata?.role;

  const navItems = [
    { href: "/pricing", label: "Prijzen", icon: Tags },
    ...(!user || role === "client" ? [{ href: "/join", label: "Join met Coach Code", icon: Users }] : []),
    ...(user
      ? [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }]
      : [
          { href: "/login", label: "Inloggen", icon: LogIn },
          { href: "/register", label: "Start gratis", icon: Flag },
        ]),
  ] as { href: string; label: string; icon: LucideIcon }[];

  const overlay = (
    <div
      className={[
        "fixed inset-0 transition-opacity duration-300 ease-out lg:hidden",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      ].join(" ")}
      style={{ zIndex: 9999 }}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
    >
      <button type="button" onClick={() => setOpen(false)} className="absolute inset-0 bg-gray-900/50" aria-label="Sluit menu" />

      <aside
        className={[
          "absolute right-0 top-0 h-full w-[85vw] max-w-sm border-l border-gray-200 bg-white p-4 shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="mb-5 flex items-center justify-between">
          <p className="text-base font-semibold text-gray-900">Navigatie</p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label="Sluit menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                onClick={() => setOpen(false)}
                className={[
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                ].join(" ")}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        aria-label="Open menu"
      >
        <Menu size={18} />
        Menu
      </button>

      {open ? createPortal(overlay, document.body) : null}
    </>
  );
}
