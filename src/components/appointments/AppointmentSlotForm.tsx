"use client";

import { useMemo, useState } from "react";
import { createAppointmentAvailabilityAction, createRecurringAppointmentAvailabilityAction } from "@/app/services/appointments/actions";
import { CalendarDays, Clock3, Repeat, Users, Tag, XCircle, CheckCircle2 } from "lucide-react";

type ClientOption = {
  id: string;
  full_name: string;
};

interface AppointmentSlotFormProps {
  clients: ClientOption[];
}

export function AppointmentSlotForm({ clients }: AppointmentSlotFormProps) {
  const [mode, setMode] = useState<"single" | "recurring">("single");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [type, setType] = useState("Check-in call");
  const [clientId, setClientId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [interval, setInterval] = useState<"weekly" | "biweekly">("weekly");
  const [occurrences, setOccurrences] = useState(4);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const title = useMemo(() => (mode === "single" ? "Eenmalig slot" : "Terugkerende slots"), [mode]);

  async function handleSubmit() {
    setLoading(true);
    setError("");
    setMessage("");

    const result =
      mode === "single"
        ? await createAppointmentAvailabilityAction({
            date,
            startTime,
            endTime,
            type,
            clientId: clientId || undefined,
          })
        : await createRecurringAppointmentAvailabilityAction({
            startDate,
            startTime,
            endTime,
            type,
            clientId: clientId || undefined,
            interval,
            occurrences,
          });

    if (result?.error) {
      setError(result.error);
    } else {
      setMessage("Tijdslot opgeslagen");
      setDate("");
      setStartDate("");
      setStartTime("");
      setEndTime("");
      setClientId("");
    }

    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMode("single")}
          className={[
            "rounded-full px-4 py-2 text-sm font-medium transition-colors",
            mode === "single" ? "bg-green-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50",
          ].join(" ")}
        >
          Eenmalig slot
        </button>
        <button
          type="button"
          onClick={() => setMode("recurring")}
          className={[
            "rounded-full px-4 py-2 text-sm font-medium transition-colors",
            mode === "recurring" ? "bg-green-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50",
          ].join(" ")}
        >
          Herhalend slot
        </button>
      </div>

      {(error || message) && (
        <div
          className={[
            "flex items-center gap-2 rounded-xl border px-4 py-3 text-sm",
            error ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700",
          ].join(" ")}
        >
          {error ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
          {error || message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="space-y-1.5">
          <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <CalendarDays size={14} className="text-gray-400" />
            {mode === "single" ? "Datum" : "Startdatum"}
          </span>
          <input
            type="date"
            value={mode === "single" ? date : startDate}
            onChange={(e) => (mode === "single" ? setDate(e.target.value) : setStartDate(e.target.value))}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none"
          />
        </label>

        <label className="space-y-1.5">
          <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Tag size={14} className="text-gray-400" />
            Type
          </span>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Check-in call"
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none"
          />
        </label>

        <label className="space-y-1.5">
          <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Clock3 size={14} className="text-gray-400" />
            Starttijd
          </span>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none"
          />
        </label>

        <label className="space-y-1.5">
          <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Clock3 size={14} className="text-gray-400" />
            Eindtijd
          </span>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none"
          />
        </label>

        <label className="space-y-1.5 md:col-span-2">
          <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Users size={14} className="text-gray-400" />
            Optionele klant
          </span>
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none"
          >
            <option value="">Geen specifieke klant</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.full_name}
              </option>
            ))}
          </select>
        </label>

        {mode === "recurring" && (
          <>
            <label className="space-y-1.5">
              <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Repeat size={14} className="text-gray-400" />
                Interval
              </span>
              <select
                value={interval}
                onChange={(e) => setInterval(e.target.value as "weekly" | "biweekly")}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none"
              >
                <option value="weekly">Wekelijks</option>
                <option value="biweekly">Tweewekelijks</option>
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-gray-700">Aantal herhalingen</span>
              <input
                type="number"
                min={1}
                max={12}
                value={occurrences}
                onChange={(e) => setOccurrences(parseInt(e.target.value, 10) || 1)}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none"
              />
            </label>
          </>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !startTime || !endTime || (mode === "single" ? !date : !startDate)}
          className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
        >
          {loading ? "Opslaan..." : `Sla ${title.toLowerCase()} op`}
        </button>
      </div>
    </div>
  );
}