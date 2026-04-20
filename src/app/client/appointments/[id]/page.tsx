import React from 'react'
import { getAppointmentById } from "@/app/services/appointments/appointments";
import { notFound } from 'next/dist/client/components/navigation';
import Link from 'next/dist/client/link';
import { getCoachName } from '@/app/services/client/updateProfile';

async function ClientAppointmentDetails({params}: {params: {id: string}}) {
  const { id } = await params;

  const appointment = await getAppointmentById(id);
  const coach = await getCoachName(appointment.coach_id);

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

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-3">
          <div>
            <p className="text-sm uppercase tracking-wide text-gray-400">Type</p>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {appointment.slot_type ?? appointment.appointment_types?.type ?? "Afspraak"}
            </p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-wide text-gray-400">Coach</p>
            <p className="mt-1 text-sm font-medium text-gray-900">{coach}</p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-wide text-gray-400">Status</p>
            <p className="mt-1 text-sm font-medium text-gray-900">{appointment.status}</p>
          </div>
          {appointment.meeting_url ? (
            <div>
              <p className="text-sm uppercase tracking-wide text-gray-400">Meeting URL</p>
              <a href={appointment.meeting_url} className="mt-1 block text-sm text-green-700 underline break-all">
                {appointment.meeting_url}
              </a>
            </div>
          ) : (
            <div>
              <p className="text-sm uppercase tracking-wide text-gray-400">Meeting URL</p>
              <p className="text-sm">Er is (nog) geen meeting URL beschikbaar voor deze afspraak.</p>
            </div>
          )}
        </div>

        <div
          className="self-start rounded-2xl border border-gray-100 bg-white p-5 shadow-sm min-h-0 overflow-hidden flex flex-col"
          style={{ height: "17rem" }}
        >
          <h2 className="uppercase text-sm text-gray-400">Notities</h2>
          <div className="mt-3 flex-1 min-h-0 overflow-y-auto pr-1">
            {appointment.notes ? (
              <p className="whitespace-pre-wrap">{appointment.notes}</p>
            ) : (
              <p className="text-sm text-gray-500">Er zijn nog geen notities toegevoegd aan deze afspraak.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientAppointmentDetails
