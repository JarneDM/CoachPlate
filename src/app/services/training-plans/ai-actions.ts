"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface AIGeneratedExercise {
  name: string;
  muscle_group: string;
  sets: number;
  reps: number;
  rest_seconds: number;
  notes: string;
}

interface AIGeneratedDay {
  day_number: number;
  name: string;
  exercises: AIGeneratedExercise[];
}

interface AIGeneratedPlan {
  days: AIGeneratedDay[];
}

function normalizeExerciseName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export async function createTrainingPlanFromAI(formData: {
  name: string;
  client_id: string;
  generatedPlan: AIGeneratedPlan;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Niet ingelogd" };
  }

  if (!formData.generatedPlan?.days?.length) {
    return { error: "AI schema bevat geen trainingsdagen" };
  }

  const { data: plan, error: planError } = await supabase
    .from("training_plans")
    .insert({
      coach_id: user.id,
      name: formData.name,
      client_id: formData.client_id,
    })
    .select()
    .single();

  if (planError || !plan) {
    console.error("Plan error:", planError);
    return { error: "Schema aanmaken mislukt" };
  }

  const dayRows = formData.generatedPlan.days.map((day, index) => ({
    training_plan_id: plan.id,
    day_number: day.day_number || index + 1,
    name: day.name,
  }));

  const { data: insertedDays, error: daysError } = await supabase
    .from("training_plan_days")
    .insert(dayRows)
    .select("id, day_number");

  if (daysError || !insertedDays) {
    console.error("Days error:", daysError);
    return { error: "Dagen aanmaken mislukt" };
  }

  const { data: existingExercises, error: existingExercisesError } = await supabase
    .from("exercises")
    .select("id, name")
    .or(`coach_id.eq.${user.id},coach_id.is.null`);

  if (existingExercisesError) {
    console.error("Existing exercises error:", existingExercisesError);
    return { error: "Bestaande oefeningen ophalen mislukt" };
  }

  const exerciseMap = new Map<string, string>();
  for (const ex of existingExercises ?? []) {
    exerciseMap.set(normalizeExerciseName(ex.name), ex.id);
  }

  const missingExerciseRows = new Map<string, { name: string; muscle_group: string | null }>();

  for (const day of formData.generatedPlan.days) {
    for (const exercise of day.exercises) {
      const normalizedName = normalizeExerciseName(exercise.name);
      if (!exerciseMap.has(normalizedName) && !missingExerciseRows.has(normalizedName)) {
        missingExerciseRows.set(normalizedName, {
          name: exercise.name.trim(),
          muscle_group: exercise.muscle_group?.trim() || null,
        });
      }
    }
  }

  if (missingExerciseRows.size > 0) {
    const { data: createdExercises, error: createExercisesError } = await supabase
      .from("exercises")
      .insert(
        Array.from(missingExerciseRows.values()).map((exercise) => ({
          coach_id: user.id,
          name: exercise.name,
          muscle_group: exercise.muscle_group,
        })),
      )
      .select("id, name");

    if (createExercisesError) {
      console.error("Create exercises error:", createExercisesError);
      return { error: "Nieuwe oefeningen aanmaken mislukt" };
    }

    for (const ex of createdExercises ?? []) {
      exerciseMap.set(normalizeExerciseName(ex.name), ex.id);
    }
  }

  const dayIdByNumber = new Map<number, string>();
  for (const day of insertedDays) {
    dayIdByNumber.set(day.day_number, day.id);
  }

  const exerciseRows: {
    training_plan_day_id: string;
    exercise_id: string;
    sets: number;
    reps: number;
    rest_seconds: number | null;
    notes: string | null;
    order_index: number;
  }[] = [];

  for (const day of formData.generatedPlan.days) {
    const dayId = dayIdByNumber.get(day.day_number);
    if (!dayId) continue;

    day.exercises.forEach((exercise, index) => {
      const exerciseId = exerciseMap.get(normalizeExerciseName(exercise.name));
      if (!exerciseId) return;

      exerciseRows.push({
        training_plan_day_id: dayId,
        exercise_id: exerciseId,
        sets: Math.max(1, Math.round(exercise.sets || 3)),
        reps: Math.max(1, Math.round(exercise.reps || 10)),
        rest_seconds: exercise.rest_seconds ? Math.max(0, Math.round(exercise.rest_seconds)) : null,
        notes: exercise.notes?.trim() || null,
        order_index: index,
      });
    });
  }

  if (exerciseRows.length > 0) {
    const { error: exerciseRowsError } = await supabase.from("exercises_trainingplans").insert(exerciseRows);

    if (exerciseRowsError) {
      console.error("Exercises in plan error:", exerciseRowsError);
      return { error: "Oefeningen toevoegen aan schema mislukt" };
    }
  }

  revalidatePath("/training-plans");
  revalidatePath(`/training-plans/${plan.id}`);

  return { planId: plan.id };
}
