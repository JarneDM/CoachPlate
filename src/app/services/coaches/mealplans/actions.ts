"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createMealPlan(formData: {
  name: string;
  client_id: string;
  start_date?: string;
  end_date?: string;
  notes?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plan, error: planError } = await supabase
    .from("meal_plans")
    .insert({
      coach_id: user!.id,
      name: formData.name,
      client_id: formData.client_id,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      notes: formData.notes || null,
      is_active: true,
    })
    .select()
    .single();

  if (planError || !plan) {
    console.error("Plan error:", planError);
    return { error: "Weekplan aanmaken mislukt" };
  }

  const days = Array.from({ length: 7 }, (_, i) => ({
    meal_plan_id: plan.id,
    day_number: i + 1,
    date: formData.start_date
      ? new Date(new Date(formData.start_date).getTime() + i * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
      : null,
  }));

  const { error: daysError } = await supabase.from("meal_plan_days").insert(days);

  if (daysError) {
    console.error("Days error:", daysError);
    return { error: "Dagen aanmaken mislukt" };
  }

  revalidatePath("/meal-plans");
  redirect(`/meal-plans/${plan.id}`);
}
