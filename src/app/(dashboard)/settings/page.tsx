import { CircleDollarSign, Lock, Sparkles, UserRound, Users } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSubscription } from "@/app/services/coaches/subscription/getSubscription";
import { updateCoachPassword, updateCoachProfile } from "@/app/services/coaches/settings/actions";
import { PLAN_LIMITS } from "@/lib/stripe";
import PasswordFields from "@/components/settings/PasswordFields";
import SettingsPasswordToast from "@/components/settings/SettingsPasswordToast";
import SettingsSubmitButton from "@/components/settings/SettingsSubmitButton";
import { Toaster } from "@/components/ui/sonner";

type SearchParams = {
  saved?: string;
  error?: string;
};

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export default async function SettingsPage({ searchParams }: { searchParams?: SearchParams | Promise<SearchParams> }) {
  const params = (await Promise.resolve(searchParams)) ?? {};

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: coach }, { data: subscription }] = await Promise.all([getCoachData(user.id), getSubscription(user)]);

  const activePlan = subscription?.plan ?? "starter";
  const limits = PLAN_LIMITS[activePlan as keyof typeof PLAN_LIMITS] ?? PLAN_LIMITS.starter;

  return (
    <div className="mx-auto max-w-5xl">
      <Toaster position="top-center" richColors closeButton />
      <SettingsPasswordToast saved={params.saved} error={params.error ? safeDecode(params.error) : undefined} />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Instellingen</h1>
        <p className="text-gray-500 mt-1">Beheer je account, branding en abonnement.</p>
      </div>

      {params.saved && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {params.saved === "password" ? "Wachtwoord succesvol aangepast." : "Instellingen succesvol opgeslagen."}
        </div>
      )}

      {params.error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{safeDecode(params.error)}</div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <CircleDollarSign size={16} />
            <span className="text-xs uppercase tracking-wide font-semibold">Plan</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{capitalize(subscription?.plan ?? "gratis")}</p>
          <p className="text-sm text-gray-400 mt-1">Status: {subscription?.status ?? "niet actief"}</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Users size={16} />
            <span className="text-xs uppercase tracking-wide font-semibold">Klantlimiet</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{Number.isFinite(limits.maxClients) ? limits.maxClients : "Onbeperkt"}</p>
          <p className="text-sm text-gray-400 mt-1">Volgens je huidig plan</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Sparkles size={16} />
            <span className="text-xs uppercase tracking-wide font-semibold">AI Features</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{limits.aiAccess ? "Actief" : "Niet actief"}</p>
          <p className="text-sm text-gray-400 mt-1">Upgrade om AI te gebruiken</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="bg-white border border-gray-100 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <UserRound size={16} className="text-green-600" />
            <h2 className="font-semibold text-gray-900">Profiel</h2>
          </div>

          <form action={updateCoachProfile} encType="multipart/form-data" className="space-y-4">
            <div>
              <label htmlFor="full_name" className="block text-sm text-gray-600 mb-1">
                Volledige naam
              </label>
              <input
                id="full_name"
                name="full_name"
                defaultValue={coach?.full_name ?? ""}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-green-500 focus:ring-0"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm text-gray-600 mb-1">
                E-mail
              </label>
              <input
                id="email"
                defaultValue={coach?.email ?? user.email ?? ""}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
                readOnly
              />
            </div>

            <div>
              <label htmlFor="logo" className="block text-sm text-gray-600 mb-1">
                Logo voor PDF
              </label>
              <input
                id="logo"
                name="logo"
                type="file"
                accept="image/png,image/jpeg"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 file:mr-3 file:rounded-md file:border-0 file:bg-green-50 file:px-3 file:py-1.5 file:text-green-700"
              />
              <p className="text-xs text-gray-400 mt-1">Gebruik PNG of JPG (max. 2MB). Dit logo verschijnt in je PDF exports.</p>
              {coach?.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coach.logo_url}
                  alt="Huidig coachlogo"
                  className="mt-3 h-14 w-auto rounded-md border border-gray-200 bg-white p-2"
                />
              ) : null}
            </div>

            {/* <div>
              <label htmlFor="brand_color" className="block text-sm text-gray-600 mb-1">
                Merkkleur (hex)
              </label>
              <div className="relative">
                <Palette size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="brand_color"
                  name="brand_color"
                  placeholder="#16a34a"
                  defaultValue={coach?.brand_color ?? ""}
                  className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm text-gray-900 focus:border-green-500 focus:ring-0"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Voorbeeld: #16a34a</p>
            </div> */}

            <SettingsSubmitButton
              label="Profiel opslaan"
              pendingLabel="Profiel wordt opgeslagen..."
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
            />
          </form>
        </section>

        <section className="bg-white border border-gray-100 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock size={16} className="text-green-600" />
            <h2 className="font-semibold text-gray-900">Beveiliging</h2>
          </div>

          <form action={updateCoachPassword} className="space-y-4">
            <PasswordFields />

            <SettingsSubmitButton
              label="Wachtwoord updaten"
              pendingLabel="Wachtwoord wordt geüpdatet..."
              className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
            />
          </form>
        </section>
      </div>

      <section id="pricing" className="mt-8 bg-white border border-gray-100 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 mb-1">Abonnementen</h2>
        <p className="text-sm text-gray-500 mb-5">Upgrade-opties worden binnenkort beschikbaar via Stripe checkout.</p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              key: "starter",
              title: "Starter",
              clients: "Tot 10 klanten",
              ai: "10 AI gegenereerde recepten per maand",
            },
            {
              key: "pro",
              title: "Pro",
              clients: "Onbeperkte klanten",
              ai: "AI meal & training plans",
            },
            {
              key: "studio",
              title: "Studio",
              clients: "Onbeperkte klanten",
              ai: "AI + premium support",
            },
          ].map((plan) => {
            const isActive = String(activePlan).toLowerCase() === plan.key;

            return (
              <div
                key={plan.key}
                className={`rounded-xl border p-4 ${isActive ? "border-green-300 bg-green-50" : "border-gray-200 bg-white"}`}
              >
                <p className="text-sm font-semibold text-gray-900">{plan.title}</p>
                <p className="text-sm text-gray-500 mt-2">{plan.clients}</p>
                <p className="text-sm text-gray-500">{plan.ai}</p>
                <p className="text-xs mt-3 font-medium text-green-700">{isActive ? "Huidig plan" : "Binnenkort beschikbaar"}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

async function getCoachData(userId: string) {
  const supabase = await createClient();

  return supabase.from("coaches").select("full_name, email, brand_color, logo_url").eq("id", userId).single();
}
