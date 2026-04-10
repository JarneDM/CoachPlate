import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Dumbbell, ArrowRight, Hand } from "lucide-react";

export default async function ClientDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/join");

  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: client } = await admin
    .from("clients")
    .select("id, full_name")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!client) redirect("/join");

  const [{ data: mealPlans }, { data: trainingPlans }] = await Promise.all([
    admin.from("meal_plans").select("id, name, created_at").eq("client_id", client.id).order("created_at", { ascending: false }),
    admin.from("training_plans").select("id, name, created_at").eq("client_id", client.id).order("created_at", { ascending: false }),
  ]);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
          Welkom, {client.full_name?.split(" ")[0]}!
          <Hand className="h-5 w-5 text-green-600" />
        </h1>
        <p className="text-gray-500 mt-1">Hier vind je al je plannen van je coach.</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarDays size={18} className="text-green-600" />
            <h2 className="font-semibold text-gray-900">Weekplannen</h2>
          </div>
          <span className="text-sm text-gray-400">
            {mealPlans?.length ?? 0} plan{(mealPlans?.length ?? 0) !== 1 ? "nen" : ""}
          </span>
        </div>

        {!mealPlans?.length ? (
          <div className="text-center py-8">
            <CalendarDays className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400">Nog geen weekplannen ontvangen van je coach.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {mealPlans.map((plan) => (
              <Link
                key={plan.id}
                href={`/client/meal-plans/${plan.id}`}
                className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 hover:border-green-200 hover:bg-green-50/30 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{plan.name}</p>
                    {
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(plan.created_at).toLocaleDateString("nl-BE", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    }
                  </div>
                </div>
                <ArrowRight size={16} className="text-gray-300 group-hover:text-green-500 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Dumbbell size={18} className="text-green-600" />
            <h2 className="font-semibold text-gray-900">Trainingsschema&apos;s</h2>
          </div>
          <span className="text-sm text-gray-400">
            {trainingPlans?.length ?? 0} schema{(trainingPlans?.length ?? 0) !== 1 ? "&apos;s" : ""}
          </span>
        </div>

        {!trainingPlans?.length ? (
          <div className="text-center py-8">
            <Dumbbell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400">Nog geen trainingsschema&apos;s ontvangen van je coach.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {trainingPlans.map((plan) => (
              <Link
                key={plan.id}
                href={`/client/training-plans/${plan.id}`}
                className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 hover:border-green-200 hover:bg-green-50/30 transition-colors group"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{plan.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(plan.created_at).toLocaleDateString("nl-BE", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <ArrowRight size={16} className="text-gray-300 group-hover:text-green-500 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
