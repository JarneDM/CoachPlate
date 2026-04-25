"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function normalizeOptionalText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

function normalizeOptionalNumber(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  if (!text) return null;

  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function updateClientAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const clientId = String(formData.get("id") ?? "").trim();
  const fullName = String(formData.get("full_name") ?? "").trim();

  if (!clientId) {
    redirect("/dashboard/clients?error=Ongeldige%20klant");
  }

  if (!fullName) {
    redirect(`/dashboard/clients/${clientId}/edit?error=Naam%20is%20verplicht`);
  }

  const allergiesInput = String(formData.get("allergies") ?? "").trim();
  const allergies = allergiesInput
    ? allergiesInput
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean)
    : null;

  const payload = {
    full_name: fullName,
    email: normalizeOptionalText(formData.get("email")),
    birth_date: normalizeOptionalText(formData.get("birth_date")),
    gender: normalizeOptionalText(formData.get("gender")),
    weight_kg: normalizeOptionalNumber(formData.get("weight_kg")),
    height_cm: normalizeOptionalNumber(formData.get("height_cm")),
    goal: normalizeOptionalText(formData.get("goal")),
    calories_goal: normalizeOptionalNumber(formData.get("calories_goal")),
    protein_goal: normalizeOptionalNumber(formData.get("protein_goal")),
    carbs_goal: normalizeOptionalNumber(formData.get("carbs_goal")),
    fat_goal: normalizeOptionalNumber(formData.get("fat_goal")),
    allergies,
    preferences: normalizeOptionalText(formData.get("preferences")),
    notes: normalizeOptionalText(formData.get("notes")),
  };

  const { data, error } = await supabase
    .from("clients")
    .update(payload)
    .eq("id", clientId)
    .eq("coach_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    const message = encodeURIComponent(error.message || "Kon klant niet bijwerken");
    redirect(`/dashboard/clients/${clientId}/edit?error=${message}`);
  }

  if (!data) {
    redirect(`/dashboard/clients/${clientId}/edit?error=Kon%20deze%20klant%20niet%20bijwerken`);
  }

  revalidatePath("/dashboard/clients");
  revalidatePath(`/dashboard/clients/${clientId}`);
  revalidatePath("/dashboard");

  redirect(`/dashboard/clients/${clientId}?updated=1`);
}
