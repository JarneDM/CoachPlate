"use client";

import Link from "next/link";
import { User } from '@supabase/supabase-js';

function NavBar({user}: {user: User | null}) {

  return (
    <header className="sticky top-0 z-50 w-full border-b border-green-100/80 bg-white/85 backdrop-blur supports-backdrop-filter:bg-white/70">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="text-xl font-black tracking-tight text-slate-900">
          CoachPlate
        </Link>

        <ul className="flex items-center gap-2 sm:gap-3">
          <li>
            <Link
              href="/pricing"
              className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-green-50 hover:text-green-900"
            >
              Prijzen
            </Link>
          </li>

          {user ? (
            <li>
              <Link
                href="/dashboard"
                className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
              >
                Dashboard
              </Link>
            </li>
          ) : (
            <>
              <li>
                <Link
                  href="/login"
                  className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-green-50"
                >
                  Inloggen
                </Link>
              </li>
              <li className="flex-none">
                <Link
                  href="/register"
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
                >
                  Start gratis
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default NavBar
