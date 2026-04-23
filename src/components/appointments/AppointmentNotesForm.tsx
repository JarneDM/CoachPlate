"use client";

import { useState } from "react";
import { updateAppointmentNotesAction } from "@/app/services/appointments/actions";
import { CheckCircle2, Loader2, NotebookPen } from "lucide-react";
import { useRouter } from "next/navigation";

interface AppointmentNotesFormProps {
  appointmentId: string;
  initialNotes?: string | null;
  initialStatus?: string | null;
  meetingUrl?: string | null;
}

export function AppointmentNotesForm({ appointmentId, initialNotes, initialStatus, meetingUrl }: AppointmentNotesFormProps) {
  const router = useRouter();
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [status, setStatus] = useState(initialStatus ?? "completed");
  const [url, setUrl] = useState(meetingUrl ?? "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setLoading(true);
    setError("");
    setSuccess(false);

    const result = await updateAppointmentNotesAction(appointmentId, {
      notes: notes || undefined,
      status: status as "scheduled" | "completed" | "cancelled" | "no_show",
      meetingUrl: url || undefined,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <NotebookPen className="h-4 w-4 text-green-600" />
        <h3 className="font-semibold text-gray-900">Notities bijwerken</h3>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-gray-700">Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none"
          >
            <option value="scheduled">Ingepland</option>
            <option value="completed">Afgerond</option>
            <option value="cancelled">Geannuleerd</option>
            <option value="no_show">No-show</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-gray-700">Meeting URL</span>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-gray-700">Notities</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={6}
            placeholder="Wat is besproken, volgende stappen, gewicht update..."
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none"
          />
        </label>
      </div>

      {error && <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {success && (
        <p className="mt-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4" />
          Opgeslagen
        </p>
      )}

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Opslaan
        </button>
      </div>
    </div>
  );
}