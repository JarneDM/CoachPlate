"use client";

import { useState } from "react";
import { createTrainingPlan } from "@/app/services/training-plans/actions";
import {
  User,
  FileText,
  Plus,
  Trash2,
  ChevronDown,
  Dumbbell,
} from "lucide-react";
import Link from "next/link";

interface Client {
  id: string;
  full_name: string;
}

interface Day {
  day_number: number;
  name: string;
}

const DAY_PRESETS = [
  { label: "Push/Pull/Legs", days: ["Push", "Pull", "Legs"] },
  { label: "Full body 3x", days: ["Full Body A", "Full Body B", "Full Body C"] },
  { label: "Upper/Lower", days: ["Upper A", "Lower A", "Upper B", "Lower B"] },
  { label: "5 dagen split", days: ["Borst", "Rug", "Schouders", "Benen", "Armen"] },
];

export default function NewTrainingPlanForm({ clients }: { clients: Client[] }) {
  const [name, setName] = useState("");
  const [clientId, setClientId] = useState("");
  const [days, setDays] = useState<Day[]>([
    { day_number: 1, name: "Dag 1" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleClientChange(id: string) {
    setClientId(id);
    const client = clients.find(c => c.id === id);
    if (client && !name) {
      setName(`${client.full_name} — Trainingsschema`);
    }
  }

  function addDay() {
    setDays(prev => [
      ...prev,
      { day_number: prev.length + 1, name: `Dag ${prev.length + 1}` },
    ]);
  }

  function removeDay(index: number) {
    setDays(prev =>
      prev
        .filter((_, i) => i !== index)
        .map((d, i) => ({ ...d, day_number: i + 1 }))
    );
  }

  function updateDayName(index: number, value: string) {
    setDays(prev =>
      prev.map((d, i) => i === index ? { ...d, name: value } : d)
    );
  }

  function applyPreset(preset: typeof DAY_PRESETS[0]) {
    setDays(preset.days.map((name, i) => ({
      day_number: i + 1,
      name,
    })));
  }

  async function handleSubmit() {
    if (!name) { setError("Vul een naam in"); return; }
    if (!clientId) { setError("Selecteer een klant"); return; }
    if (days.length === 0) { setError("Voeg minstens één dag toe"); return; }

    setLoading(true);
    setError("");

    await createTrainingPlan({ name, client_id: clientId, days });
  }

  return (
    <div className="space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">{error}</div>}

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 text-sm">Basisinformatie</h2>

        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
            <User size={14} className="text-gray-400" />
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

        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
            <FileText size={14} className="text-gray-400" />
            Naam <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="bv. Jan — Push Pull Legs"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 text-sm">Trainingsdagen</h2>
          <span className="text-xs text-gray-400">{days.length} dagen</span>
        </div>

        <div>
          <p className="text-xs text-gray-400 mb-2">Snel instellen via preset:</p>
          <div className="flex flex-wrap gap-2">
            {DAY_PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => applyPreset(preset)}
                className="text-xs border border-gray-200 hover:border-green-300 hover:bg-green-50 hover:text-green-700 text-gray-600 px-3 py-1.5 rounded-lg transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {days.map((day, index) => (
            <div key={index} className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2.5">
              <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-green-700">{day.day_number}</span>
              </div>
              <input
                type="text"
                value={day.name}
                onChange={(e) => updateDayName(index, e.target.value)}
                className="flex-1 bg-transparent text-sm text-gray-700 focus:outline-none"
                placeholder={`Dag ${day.day_number}`}
              />
              <button
                onClick={() => removeDay(index)}
                disabled={days.length === 1}
                className="text-gray-300 hover:text-red-400 disabled:opacity-30 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addDay}
          className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-200 hover:border-green-300 hover:text-green-600 text-gray-400 text-sm py-2.5 rounded-lg transition-colors"
        >
          <Plus size={14} />
          Dag toevoegen
        </button>
      </div>

      <div className="flex items-center justify-end gap-3 pb-8">
        <Link
          href="/training-plans"
          className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Annuleer
        </Link>
        <button
          onClick={handleSubmit}
          disabled={loading || !name || !clientId || days.length === 0}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          <Dumbbell size={14} />
          {loading ? "Aanmaken..." : "Schema aanmaken & openen"}
        </button>
      </div>
    </div>
  );
}