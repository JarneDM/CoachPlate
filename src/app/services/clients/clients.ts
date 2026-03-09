import { createClient } from "@/lib/supabase/server";
import { Client } from "@/types";


export const getClients = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return supabase.from("clients").select("*").eq("coach_id", user?.id);
};

export const getClientsCount = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return supabase.from("clients").select("*", { count: "exact", head: true }).eq("coach_id", user?.id);
};

export async function getClientById(id: string): Promise<Client | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.from("clients").select("*").eq("id", id).maybeSingle();

  if (error) {
    console.error("Error fetching client:", error);
    return null;
  }

  return data;
}
