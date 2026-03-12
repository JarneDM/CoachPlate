import { createClient } from "@/lib/supabase/server";
import { Client } from "@/types";


export async function getClients() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("clients")
    .select("id, full_name")
    .eq("coach_id", user!.id)
    .order("full_name", { ascending: true });

  if (error) {
    console.error("Error fetching clients:", error);
    return [];
  }

  return data;
}

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

