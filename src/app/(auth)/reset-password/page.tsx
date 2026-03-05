"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const supabase = createClient();

  async function handleReset() {
    setLoading(true);

    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="text-5xl mb-4">✉️</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Resetlink verstuurd</h2>
        <p className="text-gray-500 text-sm">Check je e-mail voor de resetlink.</p>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Wachtwoord vergeten</h2>
      <p className="text-gray-500 text-sm mb-6">Vul je e-mailadres in en we sturen je een resetlink.</p>

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

        <button
          onClick={handleReset}
          disabled={loading || !email}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
        >
          {loading ? "Versturen..." : "Stuur resetlink"}
        </button>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        <Link href="/login" className="text-green-600 font-medium hover:underline">
          Terug naar inloggen
        </Link>
      </p>
    </>
  );
}
