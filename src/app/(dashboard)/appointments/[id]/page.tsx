import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { getAppointmentById } from "@/app/services/appointments/appointments";
import { AppointmentNotesForm } from "@/components/appointments/AppointmentNotesForm";
import Link from "next/link";

export default async function AppointmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const appointment = await getAppointmentById(id);

  if (!appointment) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm text-gray-500">
          <Link href="/appointments" className="hover:text-gray-700">
            Afspraken
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">Afspraak detail</span>
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">{appointment.clients?.full_name ?? "Afspraak"}</h1>
        <p className="mt-2 text-sm text-gray-600">
          {appointment.date} · {appointment.start_time.slice(0, 5)} - {appointment.end_time.slice(0, 5)}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400">Type</p>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {appointment.slot_type ?? appointment.appointment_types?.type ?? "Afspraak"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400">Klant</p>
            <p className="mt-1 text-sm font-medium text-gray-900">{appointment.clients?.full_name ?? "Onbekend"}</p>
            <p className="text-sm text-gray-500">{appointment.clients?.email ?? "Geen e-mail"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400">Status</p>
            <p className="mt-1 text-sm font-medium text-gray-900">{appointment.status}</p>
          </div>
          {appointment.meeting_url && (
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">Meeting URL</p>
              <a href={appointment.meeting_url} className="mt-1 block text-sm text-green-700 underline break-all">
                {appointment.meeting_url}
              </a>
            </div>
          )}
        </div>

        <AppointmentNotesForm
          appointmentId={appointment.id}
          initialNotes={appointment.notes}
          initialStatus={appointment.status}
          meetingUrl={appointment.meeting_url}
        />
      </div>
    </div>
  );
}
