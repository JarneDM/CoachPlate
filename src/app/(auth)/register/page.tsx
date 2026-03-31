"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  async function handleRegister() {
    setLoading(true);
    setError("");

    const normalizedName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (password.length < 8) {
      setError("Wachtwoord moet minstens 8 tekens zijn");
      setLoading(false);
      return;
    }

    if (!acceptedTerms) {
      setError("Je moet de algemene voorwaarden accepteren om te registreren");
      setLoading(false);
      return;
    }

    const acceptedAt = new Date().toISOString();

    const { error: authError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        emailRedirectTo: `https://www.coachplate.com/auth/callback`,
        data: {
          full_name: normalizedName,
          terms_accepted: true,
          terms_accepted_at: acceptedAt,
          terms_version: "2026-03-29",
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/login");
  }

  return (
    <>
      <div className="mb-7">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Start je gratis account</h2>
        <p className="mt-1 text-sm text-slate-500">Krijg direct toegang tot slimme meal- en trainingsplanning.</p>
      </div>

      {error && <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}

      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">Volledige naam</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jan Janssen"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/15"
            autoComplete="name"
          />
        </div>

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
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">Wachtwoord</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minstens 8 tekens"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/15"
            autoComplete="new-password"
          />
          <p className="mt-1.5 text-xs text-slate-500">Minstens 8 tekens</p>
        </div>

        <label className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-green-700 focus:ring-green-500"
          />
          <span>
            Ik ga akkoord met de{" "}
            <Link
              href="/terms"
              className="font-medium text-slate-800 underline decoration-slate-300 underline-offset-2 transition hover:text-slate-900"
            >
              algemene voorwaarden
            </Link>{" "}
            en het{" "}
            <Link
              href="/privacy"
              className="font-medium text-slate-800 underline decoration-slate-300 underline-offset-2 transition hover:text-slate-900"
            >
              privacybeleid
            </Link>
            .
          </span>
        </label>

        <button
          onClick={handleRegister}
          disabled={loading || !fullName.trim() || !email.trim() || !password || !acceptedTerms}
          className="w-full rounded-xl bg-linear-to-r from-green-600 to-green-500 py-3 text-sm font-semibold text-white shadow-lg shadow-green-200 transition hover:-translate-y-0.5 hover:from-green-700 hover:to-green-600 disabled:translate-y-0 disabled:cursor-not-allowed disabled:from-green-300 disabled:to-green-300 disabled:shadow-none"
        >
          {loading ? "Account aanmaken..." : "Gratis starten"}
        </button>
      </div>

      <p className="mt-4 text-center text-xs leading-relaxed text-slate-500">
        Door te registreren ga je akkoord met onze{" "}
        <Link href="/privacy" className="underline decoration-slate-300 underline-offset-2 hover:text-slate-700">
          privacybeleid
        </Link>{" "}
        en{" "}
        <Link href="/terms" className="underline decoration-slate-300 underline-offset-2 hover:text-slate-700">
          gebruiksvoorwaarden
        </Link>
        ,{" "}
        <Link href="/cookies" className="underline decoration-slate-300 underline-offset-2 hover:text-slate-700">
          cookiebeleid
        </Link>{" "}
        en{" "}
        <Link href="/verwerkersovereenkomst" className="underline decoration-slate-300 underline-offset-2 hover:text-slate-700">
          verwerkersovereenkomst
        </Link>
        .
      </p>

      <p className="mt-4 text-center text-sm text-slate-500">
        Al een account?{" "}
        <Link href="/login" className="font-semibold text-green-700 transition hover:text-green-600 hover:underline">
          Inloggen
        </Link>
      </p>
    </>
  );
}
