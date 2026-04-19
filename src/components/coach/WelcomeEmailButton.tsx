"use client";

import { useState } from "react";
import { sendEmail } from "@/app/services/email/sendEmail";

export function WelcomeEmailButton({ name }: { name: string }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await sendEmail(name || "Gebruiker");
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading || sent}
      className="ml-4 whitespace-nowrap rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
    >
      {sent ? "Verzonden" : loading ? "Versturen..." : "Stuur welkom email"}
    </button>
  );
}