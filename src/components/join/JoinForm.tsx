"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { joinViaCode } from "@/app/services/auth/join";
import { KeyRound, User, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function JoinForm({ initialCode }: { initialCode: string }) {
  const [step, setStep] = useState<"code" | "register">(initialCode ? "register" : "code");
  const [code, setCode] = useState(initialCode);
  const [coachName, setCoachName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  // Stap 1 — Code verifiëren
  async function handleVerifyCode() {
    if (!code) {
      setError("Vul een code in");
      return;
    }
    setVerifying(true);
    setError("");

    const res = await fetch("/api/verify-invite-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code.toUpperCase() }),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      setError("Ongeldige code. Vraag je coach om de juiste code.");
      setVerifying(false);
      return;
    }

    setCoachName(data.coachName);
    setStep("register");
    setVerifying(false);
  }

  // Stap 2 — Account aanmaken
  async function handleRegister() {
    if (!fullName) {
      setError("Vul je naam in");
      return;
    }
    if (!email) {
      setError("Vul je e-mailadres in");
      return;
    }
    if (password.length < 8) {
      setError("Wachtwoord moet minstens 8 tekens zijn");
      return;
    }

    setLoading(true);
    setError("");

    const result = await joinViaCode({
      code: code.toUpperCase(),
      email,
      password,
      fullName,
    });

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push("/client/dashboard");
  }

  // Stap 1 — Code invoeren
  if (step === "code") {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Voer je uitnodigingscode in</h2>
          <p className="text-sm text-gray-400">Je coach heeft je een code gegeven om toegang te krijgen.</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">{error}</div>}

        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
            <KeyRound size={14} className="text-gray-400" />
            Uitnodigingscode
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="COACH-JDM-4829"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-mono tracking-wider"
            onKeyDown={(e) => e.key === "Enter" && handleVerifyCode()}
          />
        </div>

        <button
          onClick={handleVerifyCode}
          disabled={verifying || !code}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
        >
          {verifying ? "Code controleren..." : "Doorgaan"}
        </button>
      </div>
    );
  }

  // Stap 2 — Registratie
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Account aanmaken</h2>
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <p className="text-sm text-green-700">
            Je wordt gekoppeld aan coach <strong>{coachName}</strong>
          </p>
          <button onClick={() => setStep("code")} className="ml-auto text-xs text-green-600 hover:underline">
            Wijzigen
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">{error}</div>}

      {/* Naam */}
      <div>
        <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
          <User size={14} className="text-gray-400" />
          Volledige naam
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Jan Janssen"
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Email */}
      <div>
        <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
          <Mail size={14} className="text-gray-400" />
          E-mailadres
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jan@email.com"
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Wachtwoord */}
      <div>
        <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
          <Lock size={14} className="text-gray-400" />
          Wachtwoord
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minstens 8 tekens"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">Minstens 8 tekens</p>
      </div>

      <button
        onClick={handleRegister}
        disabled={loading || !fullName || !email || !password}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
      >
        {loading ? "Account aanmaken..." : "Account aanmaken"}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Door te registreren ga je akkoord met ons{" "}
        <a href="/privacy" className="underline">
          privacybeleid
        </a>
        .
      </p>
    </div>
  );
}
