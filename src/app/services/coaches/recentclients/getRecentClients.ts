import { createClient } from "@/lib/supabase/server";

export const getRecentClients = async (user: { id: string }) => {
  const supabase = await createClient();
  const data = await supabase.from("clients").select("*").eq("coach_id", user.id).order("created_at", { ascending: false }).limit(5);

  return data;
}