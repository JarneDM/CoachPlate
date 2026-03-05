"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const supabase = createClient();

  async function handleLogin() {
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("E-mail of wachtwoord incorrect");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Inloggen</h2>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</div>}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-mailadres</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jouw@email.com"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">Wachtwoord</label>
            <Link href="/reset-password" className="text-xs text-green-600 hover:underline">
              Vergeten?
            </Link>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading || !email || !password}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
        >
          {loading ? "Inloggen..." : "Inloggen"}
        </button>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        Nog geen account?{" "}
        <Link href="/register" className="text-green-600 font-medium hover:underline">
          Registreer gratis
        </Link>
      </p>
    </>
  );
}
