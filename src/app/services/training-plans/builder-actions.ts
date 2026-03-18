"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addExerciseToDay({
  trainingPlanDayId,
  exerciseId,
  sets,
  reps,
  weightKg,
  restSeconds,
  notes,
  planId,
}: {
  trainingPlanDayId: string;
  exerciseId: string;
  sets: number;
  reps: number;
  weightKg?: number;
  restSeconds?: number;
  notes?: string;
  planId: string;
}) {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("exercises_trainingplans")
    .select("order_index")
    .eq("training_plan_day_id", trainingPlanDayId)
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextIndex = existing ? (existing.order_index ?? 0) + 1 : 0;

  const { error } = await supabase.from("exercises_trainingplans").insert({
    training_plan_day_id: trainingPlanDayId,
    exercise_id: exerciseId,
    sets,
    reps,
    weight_kg: weightKg ?? null,
    rest_seconds: restSeconds ?? null,
    notes: notes ?? null,
    order_index: nextIndex,
  });

  if (error) {
    console.error("Error adding exercise:", error);
    return { error: "Oefening toevoegen mislukt" };
  }

  revalidatePath(`/training-plans/${planId}`);
  return { success: true };
}

export async function removeExerciseFromDay(exerciseTrainingPlanId: number, planId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("exercises_trainingplans").delete().eq("id", exerciseTrainingPlanId);

  if (error) {
    console.error("Error removing exercise:", error);
    return { error: "Oefening verwijderen mislukt" };
  }

  revalidatePath(`/training-plans/${planId}`);
  return { success: true };
}

export async function updateExercise(
  exerciseTrainingPlanId: number,
  data: {
    sets?: number;
    reps?: number;
    weight_kg?: number;
    rest_seconds?: number;
    notes?: string;
  },
  planId: string,
) {
  const supabase = await createClient();

  const { error } = await supabase.from("exercises_trainingplans").update(data).eq("id", exerciseTrainingPlanId);

  if (error) {
    console.error("Error updating exercise:", error);
    return { error: "Oefening updaten mislukt" };
  }

  revalidatePath(`/training-plans/${planId}`);
  return { success: true };
}

export async function createExercise(data: {
  name: string;
  muscle_group?: string;
  category?: string;
  equipment?: string;
  difficulty?: string;
  instructions?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: exercise, error } = await supabase
    .from("exercises")
    .insert({ ...data, coach_id: user!.id })
    .select()
    .single();

  if (error) {
    console.error("Error creating exercise:", error);
    return { error: "Oefening aanmaken mislukt" };
  }

  return { exercise };
}
