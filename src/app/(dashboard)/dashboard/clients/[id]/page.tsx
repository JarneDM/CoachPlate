import React from "react";
import { getClientById } from "@/app/services/clients/clients";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ClientStatCard } from "@/components/ui/ClientStatCard";
import { MacroCard } from "@/components/ui/MacroCard";
import { Section } from "@/components/Section";
import { InfoRow } from "@/components/InfoRow";
import { Empty } from "@/components/Empty";
import {ActionButton} from "@/components/QuickAction";
import {
  CalendarDays,
  ClipboardList,
  Gauge,
  Ruler,
  Scale,
  Target,
  TriangleAlert,
  User,
  UserRound,
  Bot,
  NotebookPen,
  Cake,
} from "lucide-react";

async function ClientDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  let client: Awaited<ReturnType<typeof getClientById>> | null = null;

  try {
    client = await getClientById(id);
  } catch {
    notFound();
  }

  if (!client) notFound();
  const bmi =
    client.weight_kg && client.height_cm
      ? (client.weight_kg / Math.pow(client.height_cm / 100, 2)).toFixed(1)
      : null;

  const age = client.birth_date
    ? Math.floor(
        new Date().getFullYear() -
          new Date(client.birth_date).getFullYear() -
          (new Date() < new Date(new Date().getFullYear(), new Date(client.birth_date).getMonth(), new Date(client.birth_date).getDate())
            ? 1
            : 0),
      )
    : null;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/dashboard/clients" className="hover:text-gray-600 transition-colors">
          Klanten
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">{client.full_name}</span>
      </div>

      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 font-bold text-2xl">
            {(client.full_name?.charAt(0) ?? "?").toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{client.full_name}</h1>
            <div className="flex items-center gap-3 mt-1">
              {client.email && <span className="text-sm text-gray-400">{client.email}</span>}
              {client.goal && (
                <span className="bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">{client.goal}</span>
              )}
            </div>
          </div>
        </div>
        <Link
          href={`/dashboard/clients/${id}/edit`}
          className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Bewerken
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <ClientStatCard label="Gewicht" value={client.weight_kg ? `${client.weight_kg} kg` : "—"} icon={<Scale size={18} />} />
        <ClientStatCard label="Lengte" value={client.height_cm ? `${client.height_cm} cm` : "—"} icon={<Ruler size={18} />} />
        <ClientStatCard label="BMI" value={bmi ?? "—"} icon={<Gauge size={18} />} />
        <ClientStatCard label="Leeftijd" value={age !== null ? `${age} jaar` : "—"} icon={<Cake size={18} />} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-2 space-y-6">
          <Section title="Macro doelen" icon={<Target size={16} />}>
            {client.calories_goal || client.protein_goal || client.carbs_goal || client.fat_goal ? (
              <div className="grid grid-cols-2 gap-4">
                <MacroCard label="Calorieën" value={client.calories_goal} unit="kcal" color="orange" />
                <MacroCard label="Proteïne" value={client.protein_goal} unit="g" color="blue" />
                <MacroCard label="Koolhydraten" value={client.carbs_goal} unit="g" color="yellow" />
                <MacroCard label="Vetten" value={client.fat_goal} unit="g" color="red" />
              </div>
            ) : (
              <Empty text="Nog geen macro doelen ingesteld" />
            )}
          </Section>

          <Section title="Allergieën & intoleranties" icon={<TriangleAlert size={16} />}>
            {client.allergies && client.allergies.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {client.allergies.map((allergy: string) => (
                  <span key={allergy} className="bg-red-50 text-red-600 border border-red-100 text-sm font-medium px-3 py-1 rounded-full">
                    {allergy}
                  </span>
                ))}
              </div>
            ) : (
              <Empty text="Geen allergieën geregistreerd" />
            )}
          </Section>

          <Section title="Voorkeuren & notities" icon={<NotebookPen size={16} />}>
            {client.preferences || client.notes ? (
              <div className="space-y-3">
                {client.preferences && (
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Voorkeuren</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{client.preferences}</p>
                  </div>
                )}
                {client.notes && (
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Notities</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{client.notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <Empty text="Geen voorkeuren of notities" />
            )}
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Persoonlijke info" icon={<UserRound size={16} />}>
            <div className="space-y-3">
              <InfoRow label="Geslacht" value={client.gender ?? "—"} />
              <InfoRow
                label="Geboortedatum"
                value={
                  client.birth_date
                    ? new Date(client.birth_date).toLocaleDateString("nl-BE", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "—"
                }
              />
              <InfoRow
                label="Toegevoegd op"
                value={new Date(client.created_at).toLocaleDateString("nl-BE", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              />
            </div>
          </Section>

          <Section title="Acties" icon={<User size={16} />}>
            <div className="space-y-2">
              <ActionButton href={`/meal-plans/new?client=${id}`} icon={<CalendarDays size={16} />} label="Nieuw weekplan" />
              <ActionButton href={`/meal-plans/new?client=${id}&ai=true`} icon={<Bot size={16} />} label="AI weekplan genereren" />
              <ActionButton href={`/dashboard/clients/${id}/plans`} icon={<ClipboardList size={16} />} label="Alle plannen bekijken" />
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

export default ClientDetailPage;
