"use client";

import { useState, useTransition } from "react";
import { addExerciseToDay, removeExerciseFromDay } from "@/app/services/training-plans/builder-actions";
import DayCard from "./DayCard";
import ExercisePicker from "./ExercisePicker";

interface Exercise {
  id: string;
  name: string;
  muscle_group?: string | null;
  category?: string | null;
  equipment?: string | null;
  difficulty?: string | null;
  instructions?: string | null;
}

interface ExerciseTrainingPlan {
  id: number;
  sets: number | null;
  reps: number | null;
  weight_kg: number | null;
  rest_seconds: number | null;
  notes: string | null;
  order_index: number | null;
  exercises: Exercise;
}

interface Day {
  id: string;
  day_number: number;
  name: string | null;
  exercises_trainingplans: ExerciseTrainingPlan[];
}

interface Props {
  plan: { id: string };
  days: Day[];
  exercises: Exercise[];
}

export default function TrainingPlanBuilder({ plan, days, exercises }: Props) {
  const [isPending, startTransition] = useTransition();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<string | null>(null);

  function openPicker(dayId: string) {
    setPickerTarget(dayId);
    setPickerOpen(true);
  }

  function handleAddExercise(data: {
    exerciseId: string;
    sets: number;
    reps: number;
    weightKg?: number;
    restSeconds?: number;
    notes?: string;
  }) {
    if (!pickerTarget) return;

    startTransition(async () => {
      await addExerciseToDay({
        trainingPlanDayId: pickerTarget,
        planId: plan.id,
        ...data,
      });
    });

    setPickerOpen(false);
    setPickerTarget(null);
  }

  function handleRemoveExercise(exerciseTrainingPlanId: number) {
    startTransition(async () => {
      await removeExerciseFromDay(exerciseTrainingPlanId, plan.id);
    });
  }

  return (
    <div className="relative">
      {isPending && (
        <div className="fixed top-4 right-4 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-full z-50 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          Opslaan...
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {days.map((day) => (
          <DayCard
            key={day.id}
            day={day}
            planId={plan.id}
            onAddExercise={() => openPicker(day.id)}
            onRemoveExercise={handleRemoveExercise}
          />
        ))}
      </div>

      {pickerOpen && pickerTarget && (
        <ExercisePicker
          exercises={exercises}
          onSelect={handleAddExercise}
          onClose={() => {
            setPickerOpen(false);
            setPickerTarget(null);
          }}
        />
      )}
    </div>
  );
}
