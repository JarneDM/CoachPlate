"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function joinViaCode({
  code,
  email,
  password,
  fullName,
}: {
  code: string;
  email: string;
  password: string;
  fullName: string;
}) {
  const supabase = await createClient();
  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Coach ophalen via code
  const { data: coach, error: codeError } = await admin.from("coaches").select("id").eq("invite_code", code).maybeSingle();

  if (codeError || !coach) {
    return { error: "Ongeldige code" };
  }

  // 2. Supabase account aanmaken
  const { data, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: "client",
      },
    },
  });

  if (authError || !data.user) {
    if (authError?.message.includes("already registered")) {
      return { error: "Dit e-mailadres is al geregistreerd" };
    }
    return { error: "Account aanmaken mislukt" };
  }

  // 3. Client profiel aanmaken of updaten
  const { data: existingClient } = await admin.from("clients").select("id").eq("coach_id", coach.id).eq("email", email).maybeSingle();

  if (existingClient) {
    // Bestaande client koppelen aan user account
    await admin
      .from("clients")
      .update({
        user_id: data.user.id,
        has_account: true,
      })
      .eq("id", existingClient.id);
  } else {
    // Nieuw client profiel aanmaken
    await admin.from("clients").insert({
      coach_id: coach.id,
      user_id: data.user.id,
      full_name: fullName,
      email,
      has_account: true,
    });
  }

  return { success: true };
}
