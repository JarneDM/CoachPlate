"use client";

import { useState } from "react";
import { Sparkles, ChefHat, ChevronDown, Save, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { createMealPlanFromAI } from "@/app/services/coaches/mealplans/ai-actions";

interface Client {
  id: string;
  full_name: string;
  calories_goal?: number | null;
  protein_goal?: number | null;
  carbs_goal?: number | null;
  fat_goal?: number | null;
  allergies?: string[] | null;
  preferences?: string | null;
  goal?: string | null;
}

interface GeneratedMeal {
  name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  ingredients: GeneratedIngredient[];
}

interface GeneratedIngredient {
  name: string;
  amount_g: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

interface GeneratedDay {
  day: string;
  meals: {
    ontbijt: GeneratedMeal;
    lunch: GeneratedMeal;
    avondeten: GeneratedMeal;
    snack: GeneratedMeal;
  };
}

interface GeneratedPlan {
  days: GeneratedDay[];
}

function isGeneratedPlan(value: unknown): value is GeneratedPlan {
  if (!value || typeof value !== "object") return false;
  const plan = value as Record<string, unknown>;
  return Array.isArray(plan.days);
}

const MEAL_TYPE_LABELS: Record<string, string> = {
  ontbijt: "Ontbijt",
  lunch: "Lunch",
  avondeten: "Avondeten",
  snack: "Snack",
};

const MEAL_COLORS: Record<string, string> = {
  ontbijt: "text-orange-500",
  lunch: "text-yellow-500",
  avondeten: "text-blue-500",
  snack: "text-green-500",
};

export default function AIMealPlanGenerator({ clients }: { clients: Client[] }) {
  const [clientId, setClientId] = useState("");
  const [extraWishes, setExtraWishes] = useState("");
  const [planName, setPlanName] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);

  const router = useRouter();
  const selectedClient = clients.find((c) => c.id === clientId);

  function handleClientChange(id: string) {
    setClientId(id);
    const client = clients.find((c) => c.id === id);
    if (client) {
      const week = getWeekNumber(new Date());
      setPlanName(`${client.full_name} — Week ${week}`);
    }
  }

  function getWeekNumber(date: Date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }

  async function handleGenerate() {
    if (!clientId) {
      setError("Selecteer een klant");
      return;
    }
    if (!selectedClient) return;

    setLoading(true);
    setError("");
    setGeneratedPlan(null);

    try {
      const res = await fetch("/api/generate-menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: {
            full_name: selectedClient.full_name,
            weight_kg: null,
            calories_goal: selectedClient.calories_goal ?? 2000,
            protein_goal: selectedClient.protein_goal ?? 150,
            carbs_goal: selectedClient.carbs_goal ?? 200,
            fat_goal: selectedClient.fat_goal ?? 65,
            allergies: selectedClient.allergies ?? [],
            preferences: extraWishes || selectedClient.preferences || "",
            goal: selectedClient.goal ?? "gezond eten",
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "AI kon geen weekplan genereren.");
        return;
      }

      if (data.error) {
        setError(data.error);
        return;
      }

      if (!isGeneratedPlan(data.menu)) {
        setError("AI gaf een ongeldig weekplan terug. Probeer opnieuw.");
        return;
      }

      setGeneratedPlan(data.menu);
    } catch {
      setError("Er ging iets mis. Probeer opnieuw.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!generatedPlan || !clientId || !planName) return;
    setSaving(true);

    const result = await createMealPlanFromAI({
      name: planName,
      clientId,
      generatedPlan,
    });

    if (result?.error) {
      setError(result.error);
      setSaving(false);
      return;
    }

    if (result?.planId) {
      router.push(`/meal-plans/${result.planId}`);
    }
  }

  return (
    <div className="space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">{error}</div>}

      {!generatedPlan && (
        <>
          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
            <h2 className="font-semibold text-gray-900 text-sm">Instellingen</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Klant <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  value={clientId}
                  onChange={(e) => handleClientChange(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white"
                >
                  <option value="">Selecteer een klant</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.full_name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {selectedClient && (
              <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400">Doel</p>
                  <p className="text-sm font-medium text-gray-700">{selectedClient.goal ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Caloriedoel</p>
                  <p className="text-sm font-medium text-gray-700">
                    {selectedClient.calories_goal ? `${selectedClient.calories_goal} kcal` : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Allergieën</p>
                  <p className="text-sm font-medium text-gray-700">
                    {selectedClient.allergies?.length ? selectedClient.allergies.join(", ") : "Geen"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Proteïne doel</p>
                  <p className="text-sm font-medium text-gray-700">
                    {selectedClient.protein_goal ? `${selectedClient.protein_goal}g` : "—"}
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Plan naam</label>
              <input
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder="bv. Jan — Week 12"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Extra wensen (optioneel)</label>
              <input
                type="text"
                value={extraWishes}
                onChange={(e) => setExtraWishes(e.target.value)}
                placeholder="bv. veel groenten, mediterraans, budget-vriendelijk..."
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !clientId}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
            >
              <Sparkles size={14} />
              {loading ? "Weekplan genereren..." : "Genereer weekplan"}
            </button>
          </div>

          {loading && (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-3 animate-pulse">
                <ChefHat size={20} className="text-green-600" />
              </div>
              <p className="text-sm text-gray-500">AI maakt je weekplan aan...</p>
              <p className="text-xs text-gray-400 mt-1">Dit kan een paar minuutjes duren</p>
            </div>
          )}
        </>
      )}

      {generatedPlan && generatedPlan.days.length > 0 && !loading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">✨ AI gegenereerd</span>
              <h2 className="font-semibold text-gray-900">{planName}</h2>
            </div>
            <button
              onClick={handleGenerate}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              <RotateCcw size={13} />
              Opnieuw
            </button>
          </div>
          <div className="overflow-y-scroll">
            <div className="grid grid-cols-7 gap-2 w-screen overflow-y-auto">
              {generatedPlan.days.map((day) => {
                const dayTotals = Object.values(day.meals).reduce(
                  (acc, meal) => ({
                    calories: acc.calories + meal.calories,
                    protein_g: acc.protein_g + meal.protein_g,
                  }),
                  { calories: 0, protein_g: 0 },
                );

                return (
                  <div key={day.day} className="bg-white rounded-xl border border-gray-100 p-3">
                    <p className="text-xs font-bold text-gray-900 text-center mb-2">{day.day.slice(0, 2)}</p>
                    <div className="space-y-1.5">
                      {Object.entries(day.meals).map(([type, meal]) => (
                        <div key={type} className="bg-gray-50 rounded-lg p-1.5">
                          <p className={`text-xs font-medium ${MEAL_COLORS[type]}`}>{MEAL_TYPE_LABELS[type]}</p>
                          <p className="text-xs text-gray-700 leading-tight mt-0.5 line-clamp-2">{meal.name}</p>
                          <p className="text-xs text-orange-500 mt-0.5">{meal.calories} kcal</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-100 text-center">
                      <p className="text-xs font-bold text-gray-700">{dayTotals.calories}</p>
                      <p className="text-xs text-gray-400">kcal</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || !planName}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-sm font-medium py-3 rounded-lg transition-colors"
          >
            <Save size={14} />
            {saving ? "Opslaan..." : "Weekplan opslaan en openen in builder"}
          </button>
        </div>
      )}
    </div>
  );
}
