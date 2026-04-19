"use client";

import { useState } from "react";
import { confirmAppointmentBookingAction } from "@/app/services/appointments/actions";
import { CalendarCheck2, Clock3, MapPin, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface Slot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  type?: string | null;
}

interface AppointmentBookingCardProps {
  slot: Slot;
  coachName?: string | null;
}

export function AppointmentBookingCard({ slot, coachName }: AppointmentBookingCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleBook() {
    setLoading(true);
    setError("");

    const result = await confirmAppointmentBookingAction(slot.id);

    console.log("Appointment booking result:", result);

      setSuccess(true);
      router.refresh();

    setLoading(false);
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-900">{slot.type ?? "Check-in call"}</p>
          <p className="mt-1 text-sm text-gray-500">
            {new Date(slot.date).toLocaleDateString("nl-BE", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>
        {success ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <CalendarCheck2 className="h-5 w-5 text-green-600" />}
      </div>

      <div className="mt-4 space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-gray-400" />
          <span>
            {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span>{coachName ?? "Jouw coach"}</span>
        </div>
      </div>

      {error && <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {success && <p className="mt-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">Afspraak bevestigd. Je ontvangt een bevestigingsmail.</p>}

      <button
        type="button"
        onClick={handleBook}
        disabled={loading || success}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
        {success ? "Geboekt" : "Bevestig afspraak"}
      </button>
    </div>
  );
}