"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [disabled, setDisabled] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function redirectIfLoggedIn() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.replace("/dashboard");
        router.refresh();
      }
    }

    void redirectIfLoggedIn();
  }, [router, supabase]);

  async function handleLogin() {
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Vul zowel e-mail als wachtwoord in");
      setLoading(false);
      setDisabled(true);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("E-mail of wachtwoord incorrect");
      setLoading(false);
      setDisabled(true);
      return;
    }
    setDisabled(false);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <>
      <div className="mb-7">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Welkom terug</h2>
        <p className="mt-1 text-sm text-slate-500">Log in om je dashboard en cliënten te beheren.</p>
      </div>

      {error && <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}

      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">E-mailadres</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jouw@email.com"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/15"
            autoComplete="email"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="block text-sm font-semibold text-slate-700">Wachtwoord</label>
            <Link href="/reset-password" className="text-xs font-semibold text-green-700 transition hover:text-green-600 hover:underline">
              Vergeten?
            </Link>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/15"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            autoComplete="current-password"
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading || disabled}
          className="w-full rounded-xl bg-linear-to-r from-green-600 to-green-500 py-3 text-sm font-semibold text-white shadow-lg shadow-green-200 transition hover:-translate-y-0.5 hover:from-green-700 hover:to-green-600 disabled:translate-y-0 disabled:cursor-not-allowed disabled:from-green-300 disabled:to-green-300 disabled:shadow-none"
        >
          {loading ? "Inloggen..." : "Inloggen"}
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        Nog geen account?{" "}
        <Link href="/register" className="font-semibold text-green-700 transition hover:text-green-600 hover:underline">
          Registreer gratis
        </Link>
      </p>
    </>
  );
}
