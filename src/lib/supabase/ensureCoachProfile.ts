import type { User } from "@supabase/supabase-js";
import type { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export async function ensureCoachProfile(supabase: SupabaseServerClient, user: User) {
  const { data: existingCoach } = await supabase.from("coaches").select("full_name, email").eq("id", user.id).maybeSingle();

  const metadataName = typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name.trim() : "";
  const fallbackName = user.email ? user.email.split("@")[0] : "Coach";
  const fullName = metadataName || existingCoach?.full_name || fallbackName;
  const email = user.email ?? existingCoach?.email ?? "";

  // Upsert keeps profile creation idempotent across register, callback, and future logins.
  const { error } = await supabase.from("coaches").upsert(
    {
      id: user.id,
      full_name: fullName,
      email,
    },
    { onConflict: "id" },
  );

  return { error };
}