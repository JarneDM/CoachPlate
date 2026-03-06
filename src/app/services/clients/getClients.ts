import { createClient } from "@/lib/supabase/server";

export const getClients = async (user: { id: string }) => {
  const supabase = await createClient();
  const data = await supabase.from("clients").select("*", { count: "exact", head: true }).eq("coach_id", user.id);

  return data;
}