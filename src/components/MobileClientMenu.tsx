"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { CalendarDays, LayoutDashboard, Menu, Settings, X, CalendarRange } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

type MobileClientMenuProps = {
  clientName?: string | null;
  clientEmail?: string | null;
};

const navItems = [
  { href: "/client/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/client/appointments", label: "Afspraken", icon: CalendarRange },
  { href: "/client/public-recipes", label: "Publieke recepten", icon: CalendarDays },
  { href: "/client/settings", label: "Instellingen", icon: Settings },
];

export default function MobileClientMenu({ clientName, clientEmail }: MobileClientMenuProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-gray-900/50"
        aria-label="Sluit menu"
      />

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
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={[
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                ].join(" ")}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-5 border-t border-gray-100 pt-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
              {(clientName?.charAt(0) || "K").toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">{clientName || "Klant"}</p>
              <p className="truncate text-xs text-gray-400">{clientEmail || ""}</p>
            </div>
          </div>
          <LogoutButton />
        </div>
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
        <Menu size={16} />
        Menu
      </button>

      {open ? createPortal(overlay, document.body) : null}
    </>
  );
}
