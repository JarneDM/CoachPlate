"use client";

import { useState } from "react";
import { updateClientProfile } from "@/app/services/client/updateProfile";
import { User, Weight, Target, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

const ALLERGENS = [
  "Gluten",
  "Lactose",
  "Noten",
  "Pinda's",
  "Eieren",
  "Vis",
  "Schaaldieren",
  "Soja",
  "Sesamzaad",
  "Mosterd",
];

const GENDER_OPTIONS = [
  { value: "man", label: "Man" },
  { value: "vrouw", label: "Vrouw" },
  { value: "anders", label: "Anders / Wil ik niet zeggen" },
];

interface Props {
  client: {
    full_name: string;
    email?: string | null;
    weight_kg?: number | null;
    height_cm?: number | null;
    birth_date?: string | null;
    gender?: string | null;
    goal?: string | null;
    preferences?: string | null;
    allergies?: string[] | null;
  };
}

const input =
  "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-0 bg-white transition-colors placeholder:text-gray-400";
const label = "block text-sm font-medium text-gray-700 mb-1.5";

function SectionHeader({ icon, title, description }: { icon: React.ReactNode; title: string; description?: string }) {
  return (
    <div className="flex items-start gap-3 pb-4 border-b border-gray-100 mb-5">
      <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <h2 className="font-semibold text-gray-900">{title}</h2>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
    </div>
  );
}

export default function ClientSettingsForm({ client }: Props) {
  const [fullName, setFullName] = useState(client.full_name ?? "");
  const [email, setEmail] = useState(client.email ?? "");
  const [weightKg, setWeightKg] = useState(client.weight_kg?.toString() ?? "");
  const [heightCm, setHeightCm] = useState(client.height_cm?.toString() ?? "");
  const [birthDate, setBirthDate] = useState(() => {
    const raw = client.birth_date ?? "";
    const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return match ? `${match[3]}/${match[2]}/${match[1]}` : raw;
  });
  const [gender, setGender] = useState(client.gender ?? "");
  const [goal, setGoal] = useState(client.goal ?? "");
  const [preferences, setPreferences] = useState(client.preferences ?? "");
  const [allergies, setAllergies] = useState<string[]>(client.allergies ?? []);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function toggleAllergen(allergen: string) {
    setAllergies((prev) =>
      prev.includes(allergen) ? prev.filter((a) => a !== allergen) : [...prev, allergen]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const result = await updateClientProfile({
      full_name: fullName,
      email,
      weight_kg: weightKg ? parseFloat(weightKg) : null,
      height_cm: heightCm ? parseFloat(heightCm) : null,
      birth_date: birthDate || null,
      gender: gender || null,
      goal: goal || null,
      preferences: preferences || null,
      allergies,
    });

    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  }

  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Feedback */}
      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <XCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2.5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle size={16} className="shrink-0" />
          Instellingen opgeslagen!
        </div>
      )}

      {/* Profiel header */}
      <div className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xl shrink-0">
          {initials || "?"}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{fullName || "Jouw naam"}</p>
          <p className="text-sm text-gray-400">{email || "—"}</p>
        </div>
      </div>

      {/* Persoonlijke gegevens */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <SectionHeader
          icon={<User size={15} />}
          title="Persoonlijke gegevens"
          description="Je naam en contactgegevens"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Volledige naam</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={input}
              required
            />
          </div>
          <div>
            <label className={label}>E-mailadres</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={input}
            />
          </div>
          <div>
            <label className={label}>Geboortedatum</label>
            <input
              type="text"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              placeholder="DD/MM/JJJJ"
              className={input}
            />
          </div>
          <div>
            <label className={label}>Geslacht</label>
            <div className="flex gap-2 flex-wrap">
              {GENDER_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setGender(gender === o.value ? "" : o.value)}
                  className={[
                    "rounded-lg border px-3 py-2.5 text-sm font-medium transition-all",
                    gender === o.value
                      ? "border-green-300 bg-green-50 text-green-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50",
                  ].join(" ")}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lichaamsgegevens */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <SectionHeader
          icon={<Weight size={15} />}
          title="Lichaamsgegevens"
          description="Je coach gebruikt deze info voor je plannen"
        />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Gewicht</label>
            <div className="relative">
              <input
                type="number"
                min="20"
                max="300"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="70"
                className={`${input} pr-10`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">kg</span>
            </div>
          </div>
          <div>
            <label className={label}>Lengte</label>
            <div className="relative">
              <input
                type="number"
                min="100"
                max="250"
                step="1"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder="175"
                className={`${input} pr-10`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">cm</span>
            </div>
          </div>
        </div>

        {weightKg && heightCm && (
          <div className="mt-4 rounded-lg bg-gray-50 border border-gray-100 px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-gray-500">BMI</span>
            <span className="text-sm font-semibold text-gray-900">
              {(parseFloat(weightKg) / Math.pow(parseFloat(heightCm) / 100, 2)).toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Doelen & voorkeuren */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <SectionHeader
          icon={<Target size={15} />}
          title="Doelen & voorkeuren"
          description="Wat wil je bereiken?"
        />
        <div className="space-y-4">
          <div>
            <label className={label}>Mijn doel</label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="bv. afvallen, spiermassa opbouwen, gezonder eten..."
              className={input}
            />
          </div>
          <div>
            <label className={label}>Voedingsvoorkeuren</label>
            <textarea
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="bv. vegetarisch, geen varkensvlees, houdt van Aziatisch eten..."
              rows={3}
              className={input}
            />
          </div>
        </div>
      </div>

      {/* Allergieën */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <SectionHeader
          icon={<AlertTriangle size={15} />}
          title="Allergieën & intoleranties"
          description="Selecteer alles wat van toepassing is"
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {ALLERGENS.map((allergen) => {
            const active = allergies.includes(allergen);
            return (
              <button
                key={allergen}
                type="button"
                onClick={() => toggleAllergen(allergen)}
                className={[
                  "flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all text-left",
                  active
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50",
                ].join(" ")}
              >
                <span>{allergen}</span>
                <span
                  className={[
                    "w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors text-[10px] font-bold",
                    active ? "border-red-400 bg-red-100 text-red-600" : "border-gray-300",
                  ].join(" ")}
                >
                  {active ? "✕" : ""}
                </span>
              </button>
            );
          })}
        </div>

        {allergies.length > 0 && (
          <p className="mt-3 text-xs text-gray-400">
            {allergies.length} allergie{allergies.length !== 1 ? "ën" : ""} geselecteerd
          </p>
        )}
      </div>

      {/* Opslaan */}
      <div className="flex items-center justify-end gap-3 pt-1">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-medium rounded-lg px-6 py-2.5 text-sm transition-colors"
        >
          {loading ? "Opslaan..." : "Wijzigingen opslaan"}
        </button>
      </div>
    </form>
  );
}
