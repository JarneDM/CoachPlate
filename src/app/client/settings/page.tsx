import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import ClientSettingsForm from "@/components/client/ClientSettingsForm";

export default async function ClientSettingsPage() {
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
    .select("full_name, email, weight_kg, height_cm, birth_date, gender, goal, preferences, allergies")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!client) redirect("/join");

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 px-4 sm:px-6 lg:px-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Instellingen</h1>
        <p className="text-sm text-gray-400 mt-1">Beheer je persoonlijke gegevens.</p>
      </div>

      <ClientSettingsForm client={client} />
    </div>
  );
}
