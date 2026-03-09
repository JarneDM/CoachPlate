import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Users, CalendarDays, NotepadText, Sparkles, CircleDollarSign } from "lucide-react";
import { StatCard } from "@/components/ui/StatsCard";
import { QuickAction } from "@/components/QuickAction";
import { getCoach } from "@/app/services/coaches/getCoach";
import { getClientsCount } from "@/app/services/clients/clients";
import { getMealPlans } from "@/app/services/coaches/mealplans/getMealPlans";
import { getRecentClients } from "@/app/services/coaches/recentclients/getRecentClients";
import { getSubscription } from "@/app/services/coaches/subscription/getSubscription";
import { Client } from "@/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: coach }, { count: clientCount }, { count: planCount }] = await Promise.all([
    getCoach(),
    getClientsCount(),
    getMealPlans(),
  ]);

  const { data: recentClients } = await getRecentClients(user);

  const { data: subscription } = await getSubscription(user);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welkom terug, {coach?.full_name?.split(" ")[0]}! 👋</h1>
        <p className="text-gray-500 mt-1">Hier is een overzicht van je CoachPlate activiteit.</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatCard label="Actieve klanten" value={clientCount ?? 0} icon={<Users className="w-5 h-5 text-black" />} href="/clients" />
        <StatCard label="Weekplannen" value={planCount ?? 0} icon={<CalendarDays className="w-5 h-5 text-black" />} href="/meal-plans" />
        <StatCard
          label="Huidig plan"
          value={subscription?.plan ?? "Gratis"}
          icon={<CircleDollarSign className="w-5 h-5 text-black" />}
          href="/settings"
          capitalize
        />
      </div>

      {!subscription && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-green-900">Upgrade naar Pro voor AI features</h3>
            <p className="text-green-700 text-sm mt-1">Genereer weekplannen met AI, onbeperkt klanten en meer.</p>
          </div>
          <Link
            href="/settings#pricing"
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap ml-4"
          >
            Bekijk plannen
          </Link>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Recente klanten</h2>
          <Link href="/clients" className="text-sm text-green-600 hover:underline">
            Alle klanten →
          </Link>
        </div>

        {recentClients && recentClients.length > 0 ? (
          <div className="space-y-3">
            {recentClients.map((client: Client) => (
              <div key={client.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-medium text-sm">
                    {client.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{client.full_name}</p>
                    <p className="text-xs text-gray-400">{client.goal ?? "Geen doel ingesteld"}</p>
                  </div>
                </div>
                <Link href={`/clients/${client.id}`} className="text-xs text-green-600 hover:underline">
                  Bekijk →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-10 h-10 text-gray-400 mx-auto mb-8" />
            <p className="text-gray-400 text-sm mb-3">Je hebt nog geen klanten toegevoegd.</p>
            <Link
              href="/clients/add"
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Eerste klant toevoegen
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <QuickAction
          href="/clients/add"
          icon={<Users className="w-5 h-5 text-black" />}
          title="Nieuwe klant"
          description="Voeg een klant toe"
        />
        <QuickAction
          href="/meal-plans/new"
          icon={<CalendarDays className="w-5 h-5 text-black" />}
          title="Nieuw weekplan"
          description="Maak een weekplan aan"
        />
        <QuickAction
          href="/recipes/new"
          icon={<NotepadText className="w-5 h-5 text-black" />}
          title="Nieuw recept"
          description="Voeg een recept toe"
        />
        <QuickAction
          href="/meal-plans/new?ai=true"
          icon={<Sparkles className="w-5 h-5 text-black" />}
          title="AI weekplan"
          description="Genereer met AI"
        />
      </div>
    </div>
  );
}




