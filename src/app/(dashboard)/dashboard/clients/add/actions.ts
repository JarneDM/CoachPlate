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

export async function createClientAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const fullName = String(formData.get("full_name") ?? "").trim();

  if (!fullName) {
    redirect("/dashboard/clients/add?error=Naam%20is%20verplicht");
  }

  const allergiesInput = String(formData.get("allergies") ?? "").trim();
  const allergies = allergiesInput
    ? allergiesInput
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean)
    : null;

  const payload = {
    coach_id: user.id,
    full_name: fullName,
    email: normalizeOptionalText(formData.get("email")),
    birth_date: normalizeOptionalText(formData.get("birth_date")),
    gender: normalizeOptionalText(formData.get("gender")),
    weight_kg: normalizeOptionalNumber(formData.get("weight_kg")),
    height_cm: normalizeOptionalNumber(formData.get("height_cm")),
    goal: normalizeOptionalText(formData.get("goal")),
    active: normalizeOptionalText(formData.get("active")),
    calories_goal: normalizeOptionalNumber(formData.get("calories_goal")),
    protein_goal: normalizeOptionalNumber(formData.get("protein_goal")),
    carbs_goal: normalizeOptionalNumber(formData.get("carbs_goal")),
    fat_goal: normalizeOptionalNumber(formData.get("fat_goal")),
    allergies,
    preferences: normalizeOptionalText(formData.get("preferences")),
    notes: normalizeOptionalText(formData.get("notes")),
  };

  const { error } = await supabase.from("clients").insert(payload);

  //! use shadcn toast instead of query params for error handling
  if (error) {
    const message = encodeURIComponent(error.message || "Kon klant niet opslaan");
    redirect(`/dashboard/clients/add?error=${message}`);
  }

  revalidatePath("/dashboard/clients");
  revalidatePath("/dashboard");
  redirect("/dashboard/clients?created=1");
}
