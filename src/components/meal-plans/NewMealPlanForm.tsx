"use client";

import { useState } from "react";
import { createMealPlan } from "@/app/services/coaches/mealplans/actions";
import {
  CalendarDays,
  User,
  FileText,
  AlignLeft,
  ChevronDown,
} from "lucide-react";
import { ClientOption } from "@/types/interfaces";
import Link from "next/link";



export default function NewMealPlanForm({ clients }: { clients: ClientOption[] }) {
  const [name, setName] = useState("");
  const [clientId, setClientId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleStartDate(value: string) {
    setStartDate(value);
    if (value) {
      const end = new Date(new Date(value).getTime() + 6 * 24 * 60 * 60 * 1000);
      setEndDate(end.toISOString().split("T")[0]);
    }
  }

  function handleClientChange(value: string) {
    setClientId(value);
    const client = clients.find(c => c.id === value);
    if (client && !name) {
      const now = new Date();
      const week = getWeekNumber(now);
      setName(`${client.full_name} — Week ${week}`);
    }
  }

  function getWeekNumber(date: Date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }

  async function handleSubmit() {
    if (!name) { setError("Vul een naam in"); return; }
    if (!clientId) { setError("Selecteer een klant"); return; }

    setLoading(true);
    setError("");

    const result = await createMealPlan({
      name,
      client_id: clientId,
      start_date: startDate || undefined,
      end_date: endDate || undefined,
      notes: notes || undefined,
    });

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
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
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.full_name}
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
            placeholder="bv. Jan — Week 12"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <p className="text-xs text-gray-400 mt-1">Wordt automatisch ingevuld als je een klant selecteert.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 text-sm">Periode (optioneel)</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
              <CalendarDays size={14} className="text-gray-400" />
              Startdatum
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleStartDate(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
              <CalendarDays size={14} className="text-gray-400" />
              Einddatum
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        <p className="text-xs text-gray-400">Einddatum wordt automatisch op 7 dagen na startdatum gezet.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
          <AlignLeft size={14} className="text-gray-400" />
          Notities (optioneel)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Extra info over dit weekplan..."
          rows={3}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pb-8">
        <Link
          href="/meal-plans"
          className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Annuleer
        </Link>
        <button
          onClick={handleSubmit}
          disabled={loading || !name || !clientId}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          <CalendarDays size={14} />
          {loading ? "Aanmaken..." : "Plan aanmaken & openen"}
        </button>
      </div>
    </div>
  );
}