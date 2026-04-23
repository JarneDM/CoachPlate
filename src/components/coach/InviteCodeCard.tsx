"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

export function InviteCodeCard({ inviteCode }: { inviteCode: string }) {
  const [copied, setCopied] = useState(false);

  const joinUrl = `https://www.coachplate.com/join?code=${inviteCode}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="font-semibold text-gray-900 text-sm mb-1">Jouw uitnodigingscode</h2>
      <p className="text-xs text-gray-400 mb-4">Deel deze code of link met je klanten zodat ze een account kunnen aanmaken.</p>

      <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center justify-between mb-3">
        <span className="font-mono font-bold text-green-700 tracking-wider text-lg">{inviteCode}</span>
      </div>

      <button
        onClick={handleCopy}
        className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-green-300 hover:bg-green-50 text-gray-600 hover:text-green-700 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? "Link gekopieerd!" : "Kopieer uitnodigingslink"}
      </button>
    </div>
  );
}
