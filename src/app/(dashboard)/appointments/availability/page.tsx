import { createClient } from "@/lib/supabase/server";
import { getAvailabilitySlots } from "@/app/services/appointments/availability-slots";
import { redirect } from "next/navigation";
import { CalendarDays, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { DeleteAvailabilitySlotButton } from "@/components/appointments/DeleteAvailabilitySlotButton";
import { getWeekRangeFromOffset, parseWeekOffset } from "@/app/services/appointments/week";

type SearchParams = {
  week?: string;
};

function buildWeekHref(offset: number) {
  return offset === 0 ? "/appointments/availability" : `/appointments/availability?week=${offset}`;
}

export default async function AvailabilityPage({ searchParams }: { searchParams?: SearchParams | Promise<SearchParams> }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const params = (await Promise.resolve(searchParams)) ?? {};
  const weekOffset = parseWeekOffset(params.week);
  const { from, to, label } = getWeekRangeFromOffset(weekOffset);
  const slots = await getAvailabilitySlots(from, to);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-green-600">Beschikbaarheid</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Open tijdsloten beheren</h1>
          <p className="mt-1 text-sm text-gray-500">Week: {label}</p>
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
            Nieuw slot
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CalendarDays size={16} className="text-green-600" />
            {slots.length} open slot{slots.length !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {slots.length === 0 ? (
            <div className="px-6 py-14 text-center text-sm text-gray-400">Nog geen open tijdsloten voor deze week.</div>
          ) : (
            slots.map((slot) => (
              <div key={slot.id} className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{slot.type ?? "Vrij slot"}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(slot.date).toLocaleDateString("nl-BE", { weekday: "long", day: "numeric", month: "long" })} ·{" "}
                    {slot.start_time} - {slot.end_time}
                  </p>
                </div>

                <DeleteAvailabilitySlotButton slotId={slot.id} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
