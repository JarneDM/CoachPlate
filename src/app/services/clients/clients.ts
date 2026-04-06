import { createClient } from "@/lib/supabase/server";
import { Client } from "@/types";


export async function getClients() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase.from("clients").select("*").eq("coach_id", user!.id).order("full_name", { ascending: true });

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

export const deleteClientById = async (id: string) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return supabase.from("clients").delete().eq("id", id).eq("coach_id", user?.id);
};

export async function createClientAccount({ clientId, email, fullName }: { clientId: string; email: string; fullName: string }) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      role: "client",
      client_id: clientId,
    },
  });

  if (error || !data.user) return { error: "Account aanmaken mislukt" };

  await supabase
    .from("clients")
    .update({
      user_id: data.user.id,
      has_account: true,
    })
    .eq("id", clientId);

  await supabase.auth.admin.generateLink({
    type: "recovery",
    email,
  });

  return { success: true };
}
