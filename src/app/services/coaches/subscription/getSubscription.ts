import { createClient } from "@/lib/supabase/server";

export const getSubscription = async (user: { id: string }) => {
  const supabase = await createClient();

  const data = await supabase.from("subscriptions").select("*").eq("coach_id", user.id).in("status", ["active", "trialing"]).single();

  return data;
}