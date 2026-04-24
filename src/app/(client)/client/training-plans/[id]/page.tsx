import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ClientTrainingDays from "@/components/client/ClientTrainingDays";

export default async function ClientTrainingPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

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
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!client) redirect("/join");

  const { data: plan } = await admin
    .from("training_plans")
    .select(`
      id, name, created_at,
      training_plan_days (
        id, day_number, name,
        exercises_trainingplans (
          id, sets, reps, weight_kg, rest_seconds, notes, order_index,
          exercises (
            id, name, muscle_group, category
          )
        )
      )
    `)
    .eq("id", id)
    .eq("client_id", client.id)
    .maybeSingle();

  if (!plan) notFound();

  const sortedDays = [...(plan.training_plan_days ?? [])].sort((a, b) => a.day_number - b.day_number);

  return (
    <div>
      <div className="mb-6 flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <div className="flex flex-wrap items-center gap-2 text-sm md:gap-3">
          <Link
            href="/client/dashboard"
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft size={14} />
            Dashboard
          </Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-base font-bold text-gray-900 md:text-lg">{plan.name}</h1>
        </div>
      </div>

      {sortedDays.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-8 text-center text-sm text-gray-400">
          Dit schema heeft nog geen dagen.
        </div>
      ) : (
        <ClientTrainingDays days={sortedDays as unknown as Parameters<typeof ClientTrainingDays>[0]["days"]} />
      )}
    </div>
  );
}
