"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Dumbbell, RotateCcw, Save, ChevronDown } from "lucide-react";
import { createTrainingPlanFromAI } from "@/app/services/training-plans/ai-actions";

interface Client {
  id: string;
  full_name: string;
  goal?: string | null;
  preferences?: string | null;
  notes?: string | null;
}

interface GeneratedExercise {
  name: string;
  muscle_group: string;
  sets: number;
  reps: number;
  rest_seconds: number;
  notes: string;
}

interface GeneratedDay {
  day_number: number;
  name: string;
  exercises: GeneratedExercise[];
}

interface GeneratedTrainingPlan {
  days: GeneratedDay[];
}

function isGeneratedTrainingPlan(value: unknown): value is GeneratedTrainingPlan {
  if (!value || typeof value !== "object") return false;

  const plan = value as Record<string, unknown>;
  return Array.isArray(plan.days) && plan.days.length > 0;
}

export default function AITrainingPlanGenerator({ clients }: { clients: Client[] }) {
  const [clientId, setClientId] = useState("");
  const [planName, setPlanName] = useState("");
  const [extraWishes, setExtraWishes] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedTrainingPlan | null>(null);
  const [split, setSplit] = useState("");
  const [days, setDays] = useState<number>(4);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  

  const router = useRouter();
  const selectedClient = clients.find((c) => c.id === clientId);

  useEffect(() => {
    if (!loading) return;

    const timerId = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [loading]);

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;

  function handleClientChange(id: string) {
    setClientId(id);
    const client = clients.find((c) => c.id === id);
    if (client) {
      setPlanName(`${client.full_name} - trainingsschema`);
    }
  }

  async function handleGenerate() {
    if (!clientId) {
      setError("Selecteer een klant");
      return;
    }

    if (!selectedClient) {
      setError("Klant niet gevonden");
      return;
    }

    setLoading(true);
    setError("");
    setGeneratedPlan(null);

    try {
      const res = await fetch("/api/generate-training-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: {
            full_name: selectedClient.full_name,
            goal: selectedClient.goal ?? "",
            preferences: selectedClient.preferences ?? "",
            split: split,
            days: days,
            notes: selectedClient.notes ?? "",
          },
          extraWishes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "AI kon geen trainingsschema genereren.");
        return;
      }

      if (data.error) {
        setError(data.error);
        return;
      }

      if (!isGeneratedTrainingPlan(data.plan)) {
        setError("AI gaf een ongeldige trainingsplan-structuur terug. Probeer opnieuw.");
        return;
      }

      setGeneratedPlan(data.plan);
    } catch {
      setError("Er ging iets mis. Probeer opnieuw.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!generatedPlan || !clientId || !planName) return;

    setSaving(true);
    setError("");

    const result = await createTrainingPlanFromAI({
      name: planName,
      client_id: clientId,
      generatedPlan,
    });

    if (result?.error) {
      setError(result.error);
      setSaving(false);
      return;
    }

    if (result?.planId) {
      router.push(`/training-plans/${result.planId}`);
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
                  disabled={loading}
                  onChange={(e) => handleClientChange(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white"
                >
                  <option value="">Selecteer een klant</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.full_name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {selectedClient && (
              <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400">Doel</p>
                  <p className="text-sm font-medium text-gray-700">{selectedClient.goal ?? "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Voorkeuren</p>
                  <p className="text-sm font-medium text-gray-700">{selectedClient.preferences ?? "Geen"}</p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Schema naam</label>
              <input
                disabled={loading}
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder="Bijv. Emma - AI split"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Split</label>
              <select
                disabled={loading}
                value={split}
                onChange={(e) => setSplit(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Geen voorkeur</option>
                <option value="full body">Full body</option>
                <option value="upper lower">Upper/lower</option>
                <option value="push pull legs">Push/pull/legs</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Aantal trainingsdagen per week</label>
              <input
                disabled={loading}
                type="text"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                placeholder="Bijv. 4"
                pattern="[1-9]\d*"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                min={1}
                max={7}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Extra wensen (optioneel)</label>
              <input
                disabled={loading}
                type="text"
                value={extraWishes}
                onChange={(e) => setExtraWishes(e.target.value)}
                placeholder="Bijv. focus op glutes, geen barbell oefeningen"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !clientId}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
            >
              <Sparkles size={14} />
              {loading ? "Schema genereren..." : "Genereer trainingsschema"}
            </button>

            <p className="text-xs text-gray-400 justify-center items-center mx-auto flex">
              De AI kan fouten maken, dus controleer het schema voordat je het gebruikt.
            </p>
          </div>

          {loading && (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-3 animate-pulse">
                <Dumbbell size={20} className="text-green-600" />
              </div>
              <p className="text-sm text-gray-500">AI maakt je trainingsschema aan...</p>
              <p className="text-xs text-gray-500">
                Tijd: {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </p>
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

          <div className="overflow-x-auto">
            <div className="flex gap-2 w-max min-w-full">
              {generatedPlan.days.map((day) => (
                <div key={day.day_number} className="bg-white rounded-xl border border-gray-100 p-3 flex flex-col w-56 shrink-0">
                  <p className="text-xs font-bold text-gray-900 text-center mb-2">D{day.day_number}</p>

                  <p className="text-xs text-gray-400 text-center line-clamp-1 mb-2">{day.name}</p>

                  <div className="space-y-1.5 flex-1">
                    {day.exercises.slice(0, 5).map((exercise, index) => (
                      <div key={`${exercise.name}-${index}`} className="bg-gray-50 rounded-lg p-1.5">
                        <p className="text-xs font-medium text-green-600 line-clamp-1">{exercise.name}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {exercise.sets}x{exercise.reps} • {exercise.rest_seconds}s
                        </p>
                      </div>
                    ))}

                    {day.exercises.length > 5 && <p className="text-xs text-gray-400 text-center">+{day.exercises.length - 5} meer</p>}
                  </div>

                  <div className="mt-2 pt-2 border-t border-gray-100 text-center">
                    <p className="text-xs font-bold text-gray-700">{day.exercises.length}</p>
                    <p className="text-xs text-gray-400">oefeningen</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || !planName}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-sm font-medium py-3 rounded-lg transition-colors"
          >
            <Save size={14} />
            {saving ? "Opslaan..." : "Schema opslaan en openen in builder"}
          </button>
        </div>
      )}
    </div>
  );
}
