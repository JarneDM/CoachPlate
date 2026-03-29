"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTrainingPlan(formData: { name: string; client_id: string; days: { name: string; day_number: number }[] }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plan, error: planError } = await supabase
    .from("training_plans")
    .insert({
      coach_id: user!.id,
      name: formData.name,
      client_id: formData.client_id,
    })
    .select()
    .single();

  if (planError || !plan) {
    console.error("Plan error:", planError);
    return { error: "Schema aanmaken mislukt" };
  }

  if (formData.days.length > 0) {
    const { error: daysError } = await supabase.from("training_plan_days").insert(
      formData.days.map((day) => ({
        training_plan_id: plan.id,
        day_number: day.day_number,
        name: day.name,
      })),
    );

    if (daysError) {
      console.error("Days error:", daysError);
      return { error: "Dagen aanmaken mislukt" };
    }
  }

  revalidatePath("/training-plans");
  redirect(`/training-plans/${plan.id}`);
}
