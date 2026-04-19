import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AppointmentSlotForm } from "@/components/appointments/AppointmentSlotForm";

export default async function AddAppointmentSlotPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: clients } = await supabase
    .from("clients")
    .select("id, full_name")
    .eq("coach_id", user.id)
    .order("full_name", { ascending: true });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-green-600">Tijdslot toevoegen</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Maak een beschikbaar tijdslot aan</h1>
        <p className="mt-2 text-sm text-gray-600">
          Kies een datum, tijd en type. Je kunt het slot ook direct aan een specifieke klant koppelen.
        </p>
      </div>

      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <AppointmentSlotForm clients={clients ?? []} />
      </div>
    </div>
  );
}
