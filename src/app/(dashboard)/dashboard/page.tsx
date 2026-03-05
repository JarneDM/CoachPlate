import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: coach }, { count: clientCount }, { count: planCount }] = await Promise.all([
    supabase.from("coaches").select("*").eq("id", user.id).single(),
    supabase.from("clients").select("*", { count: "exact", head: true }).eq("coach_id", user.id),
    supabase.from("meal_plans").select("*", { count: "exact", head: true }).eq("coach_id", user.id),
  ]);

  const { data: recentClients } = await supabase
    .from("clients")
    .select("*")
    .eq("coach_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("coach_id", user.id)
    .eq("status", "active")
    .single();

  return (
    <div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welkom terug, {coach?.full_name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Hier is een overzicht van je CoachPlate activiteit.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatCard
          label="Actieve klanten"
          value={clientCount ?? 0}
          icon="👥"
          href="/dashboard/clients"
        />
        <StatCard
          label="Weekplannen"
          value={planCount ?? 0}
          icon="🗓️"
          href="/dashboard/meal-plans"
        />
        <StatCard
          label="Huidig plan"
          value={subscription?.plan ?? "Gratis"}
          icon="⭐"
          href="/dashboard/settings"
          capitalize
        />
      </div>

      {!subscription && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-green-900">
              Upgrade naar Pro voor AI features
            </h3>
            <p className="text-green-700 text-sm mt-1">
              Genereer weekplannen met AI, onbeperkt klanten en meer.
            </p>
          </div>
          <Link
            href="/dashboard/settings#pricing"
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap ml-4"
          >
            Bekijk plannen
          </Link>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Recente klanten</h2>
          <Link
            href="/dashboard/clients"
            className="text-sm text-green-600 hover:underline"
          >
            Alle klanten →
          </Link>
        </div>

        {recentClients && recentClients.length > 0 ? (
          <div className="space-y-3">
            {recentClients.map((client) => (
              <div
                key={client.id}
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-medium text-sm">
                    {client.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {client.full_name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {client.goal ?? "Geen doel ingesteld"}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/dashboard/clients/${client.id}`}
                  className="text-xs text-green-600 hover:underline"
                >
                  Bekijk →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm mb-3">
              Je hebt nog geen klanten toegevoegd.
            </p>
            <Link
              href="/dashboard/clients/new"
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Eerste klant toevoegen
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <QuickAction
          href="/dashboard/clients/new"
          icon="👤"
          title="Nieuwe klant"
          description="Voeg een klant toe"
        />
        <QuickAction
          href="/dashboard/meal-plans/new"
          icon="🗓️"
          title="Nieuw weekplan"
          description="Maak een weekplan aan"
        />
        <QuickAction
          href="/dashboard/recipes/new"
          icon="🍽️"
          title="Nieuw recept"
          description="Voeg een recept toe"
        />
        <QuickAction
          href="/dashboard/meal-plans/new?ai=true"
          icon="🤖"
          title="AI weekplan"
          description="Genereer met AI"
        />
      </div>

    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  href,
  capitalize = false,
}: {
  label: string;
  value: string | number;
  icon: string;
  href: string;
  capitalize?: boolean;
}) {
  return (
    <Link href={href}>
      <div className="bg-white rounded-xl border border-gray-100 p-6 hover:border-green-200 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl">{icon}</span>
        </div>
        <p className={`text-2xl font-bold text-gray-900 ${capitalize ? "capitalize" : ""}`}>
          {value}
        </p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
      </div>
    </Link>
  );
}

function QuickAction({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <Link href={href}>
      <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 hover:border-green-200 transition-colors">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
      </div>
    </Link>
  );
}
