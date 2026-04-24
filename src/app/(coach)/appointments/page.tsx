import Link from "next/link";
import { CalendarDays, Plus, Clock3, Users, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getAppointmentsByDateRange, getUpcomingAppointments } from "@/app/services/appointments/appointments";
import { getAvailabilitySlots } from "@/app/services/appointments/availability-slots";
import { getWeekRangeFromOffset, parseWeekOffset } from "@/app/services/appointments/week";

type SearchParams = {
  week?: string;
};

function buildWeekHref(offset: number) {
  return offset === 0 ? "/appointments" : `/appointments?week=${offset}`;
}

export default async function AppointmentsPage({ searchParams }: { searchParams?: SearchParams | Promise<SearchParams> }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const params = (await Promise.resolve(searchParams)) ?? {};
  const weekOffset = parseWeekOffset(params.week);
  const { from, to, label } = getWeekRangeFromOffset(weekOffset);

  const [appointments, openSlots, upcomingAppointments] = await Promise.all([
    getAppointmentsByDateRange(from, to),
    getAvailabilitySlots(from, to),
    getUpcomingAppointments(8),
  ]);

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(from);
    date.setDate(date.getDate() + index);
    const key = date.toISOString().split("T")[0];

    return {
      key,
      label: date.toLocaleDateString("nl-BE", { weekday: "short", day: "numeric", month: "short" }),
      appointments: appointments.filter((appointment) => appointment.date === key),
      openSlots: openSlots.filter((slot) => slot.date === key),
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-green-100 bg-linear-to-br from-green-50 via-white to-lime-50 p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-2">
          <p className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-700">
            Afspraken
          </p>
          <h1 className="text-3xl font-bold text-gray-900">Weekoverzicht van afspraken en open tijdsloten</h1>
          <p className="text-sm text-gray-600">
            Maak vrije blokken aan, koppel ze optioneel aan een klant en volg hier alle geplande afspraken.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-medium text-gray-700">Week:</span>
            <span>{label}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href={buildWeekHref(weekOffset - 1)}
            aria-label="Vorige week"
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <ChevronLeft size={18} />
          </Link>
          <Link
            href={buildWeekHref(0)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Deze week
          </Link>
          <Link
            href={buildWeekHref(weekOffset + 1)}
            aria-label="Volgende week"
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <ChevronRight size={18} />
          </Link>
          <Link
            href="/appointments/add"
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
          >
            <Plus size={16} />
            Tijdslot toevoegen
          </Link>
          <Link
            href="/appointments/availability"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <CalendarDays size={16} />
            Beschikbaarheid beheren
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users className="h-4 w-4 text-green-600" />
            Open tijdsloten deze week
          </div>
          <p className="mt-3 text-3xl font-bold text-gray-900">{openSlots.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock3 className="h-4 w-4 text-green-600" />
            Afspraken deze week
          </div>
          <p className="mt-3 text-3xl font-bold text-gray-900">{appointments.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ArrowRight className="h-4 w-4 text-green-600" />
            Komende afspraken
          </div>
          <p className="mt-3 text-3xl font-bold text-gray-900">{upcomingAppointments.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-7">
        {days.map((day) => (
          <div key={day.key} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="mb-4 border-b border-gray-100 pb-3">
              <p className="text-sm font-semibold text-gray-900">{day.label}</p>
              <p className="text-xs text-gray-400">
                {day.openSlots.length} slots · {day.appointments.length} afspraken
              </p>
            </div>

            <div className="space-y-3">
              {day.openSlots.length === 0 && day.appointments.length === 0 ? <p className="text-sm text-gray-400">Geen afspraken</p> : null}

              {day.openSlots.map((slot) => (
                <div key={slot.id} className="rounded-xl border border-dashed border-green-200 bg-green-50/40 p-3">
                  <p className="text-sm font-medium text-green-800">{slot.type ?? "Vrij slot"}</p>
                  <p className="text-xs text-green-700">
                    {/* remove seconds */}
                    {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                  </p>
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-green-600">Open</p>
                </div>
              ))}

              {day.appointments.map((appointment) => (
                <Link
                  key={appointment.id}
                  href={`/appointments/${appointment.id}`}
                  className="block rounded-xl border border-gray-200 bg-gray-50 p-3 transition-colors hover:border-green-200 hover:bg-green-50/40"
                >
                  <p className="text-sm font-medium text-gray-900">{appointment.clients?.full_name ?? "Klant"}</p>
                  <p className="text-xs text-gray-500">
                    {appointment.start_time.slice(0, 5)} - {appointment.end_time.slice(0, 5)}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {appointment.slot_type ?? appointment.appointment_types?.type ?? appointment.status}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
