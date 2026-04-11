import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function getRole(): Promise<"coach" | "client" | null> {
  const admin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const {
    data: { user },
  } = await admin.auth.getUser();

  if (!user) return null;

  if (user.user_metadata?.role === "coach") return "coach";
  if (user.user_metadata?.role === "client") return "client";

  // fallback: check in the database
  const { data: coach } = await admin.from("coaches").select("id").eq("id", user.id).maybeSingle();
  if (coach) return "coach";

  const { data: client } = await admin.from("clients").select("id").eq("user_id", user.id).maybeSingle();
  if (client) return "client";

  return null;
}
