import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getClientAppointmentSlots } from "@/app/services/appointments/client-appointments";
import { AppointmentBookingCard } from "@/components/appointments/AppointmentBookingCard";
import { CalendarCheck2, Clock3, ChevronLeft, ChevronRight } from "lucide-react";
import { getWeekRangeFromOffset, parseWeekOffset } from "@/app/services/appointments/week";
import { getCoachName } from "@/app/services/client/updateProfile";

type SearchParams = {
  week?: string;
};

function buildWeekHref(offset: number) {
  return offset === 0 ? "/client/appointments" : `/client/appointments?week=${offset}`;
}

export default async function ClientAppointmentsPage({ searchParams }: { searchParams?: SearchParams | Promise<SearchParams> }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/join");

  const admin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data: client } = await admin.from("clients").select("id, full_name, coach_id").eq("user_id", user.id).maybeSingle();

  if (!client) redirect("/join");

  const params = (await Promise.resolve(searchParams)) ?? {};
  const weekOffset = parseWeekOffset(params.week);
  const { from, to, label } = getWeekRangeFromOffset(weekOffset);
  const { slots, appointments } = await getClientAppointmentSlots(from, to);
  const coachName = await getCoachName(client.coach_id);
 
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-green-100 bg-linear-to-br from-green-50 via-white to-lime-50 p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-green-600">Afspraak inplannen</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Kies een beschikbaar moment bij {coachName ?? "je coach"}</h1>
        <p className="mt-2 text-sm text-gray-600">
          Selecteer een tijdslot en bevestig je check-in call. Jij en je coach krijgen meteen een bevestiging.
        </p>
        <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
          <p className="text-sm text-gray-500">Week: {label}</p>
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
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Clock3 className="h-4 w-4 text-green-600" />
            Beschikbare tijdsloten
          </div>

          {slots.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
              Er zijn momenteel geen open tijdsloten beschikbaar.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {slots.map((slot) => (
                <AppointmentBookingCard key={slot.id} slot={slot} coachName={coachName} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <CalendarCheck2 className="h-4 w-4 text-green-600" />
            Mijn afspraken
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            {appointments.length === 0 ? (
              <p className="text-sm text-gray-500">Nog geen afspraken geboekt.</p>
            ) : (
              <div className="space-y-3">
                {appointments.map((appointment) => (
                  <Link href={`/client/appointments/${appointment.id}`} key={appointment.id} className="cursor-pointer hover:bg-gray-50">
                    <div key={appointment.id} className="mt-2 mb-2 rounded-xl border-2 bg-gray-100 border-solid border-red-500 p-3">
                      <p className="text-sm font-medium text-gray-900">{appointment.availability_slots.type || "Afspraak"}</p>
                      <p className="text-xs text-gray-500">
                        {appointment.availability_slots.date} · {appointment.availability_slots.start_time.slice(0, 5)} -{" "}
                        {appointment.availability_slots.end_time.slice(0, 5)}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">{appointment.status}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}