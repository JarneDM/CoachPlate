"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const supabase = createClient();

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

    const { error: authError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: normalizedName,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/register/verify-email");
  }

  return (
    <>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Account aanmaken</h2>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</div>}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Volledige naam</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jan Janssen"
            className="w-full border text-black border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-mailadres</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jouw@email.com"
            className="w-full border text-black border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Wachtwoord</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minstens 8 tekens"
            className="w-full border text-black border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-400 mt-1">Minstens 8 tekens</p>
        </div>

        <button
          onClick={handleRegister}
          disabled={loading || !fullName.trim() || !email.trim() || !password}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
        >
          {loading ? "Account aanmaken..." : "Gratis starten"}
        </button>
      </div>

      <p className="text-xs text-gray-400 text-center mt-4">
        Door te registreren ga je akkoord met onze{" "}
        <Link href="/privacy" className="underline">
          privacybeleid
        </Link>{" "}
        en{" "}
        <Link href="/terms" className="underline">
          gebruiksvoorwaarden
        </Link>
        .
      </p>

      <p className="text-center text-sm text-gray-500 mt-4">
        Al een account?{" "}
        <Link href="/login" className="text-green-600 font-medium hover:underline">
          Inloggen
        </Link>
      </p>
    </>
  );
}
