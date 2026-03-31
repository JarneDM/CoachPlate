"use client";

import { useState, useTransition } from "react";
import { addRecipeToMeal, removeRecipeFromMeal } from "@/app/services/coaches/mealplans/builder-actions";
import DayColumn from "./DayColumn";
import RecipePicker from "./RecipePicker";
import { Props } from "@/types/interfaces";

const DAY_NAMES = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"];
const MEAL_TYPES = ["ontbijt", "lunch", "avondeten", "snack"];

export default function WeekBuilder({ plan, days, recipes, client }: Props) {
  const [isPending, startTransition] = useTransition();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<{
    dayId: string;
    mealType: string;
  } | null>(null);

  function openPicker(dayId: string, mealType: string) {
    setPickerTarget({ dayId, mealType });
    setPickerOpen(true);
  }

  function handleAddRecipe(recipeId: string, servings: number) {
  if (!pickerTarget) return;

  startTransition(async () => {
    await addRecipeToMeal({
      mealPlanDayId: pickerTarget.dayId,
      mealType: pickerTarget.mealType,
      recipeId,
      servings,
      planId: plan.id, 
    });
  });

  setPickerOpen(false);
  setPickerTarget(null);
}

  function handleRemoveRecipe(mealRecipeId: string) {
    startTransition(async () => {
      await removeRecipeFromMeal(mealRecipeId, plan.id);
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

      <div className="grid grid-flow-col auto-cols-[minmax(16rem,1fr)] gap-3 overflow-x-auto pb-4 snap-x snap-mandatory xl:grid-flow-row xl:auto-cols-auto xl:grid-cols-7 xl:overflow-visible">
        {days.map((day) => (
          <DayColumn
            key={day.id}
            day={day}
            dayName={DAY_NAMES[day.day_number - 1]}
            mealTypes={MEAL_TYPES}
            client={client}
            onAddRecipe={openPicker}
            onRemoveRecipe={handleRemoveRecipe}
          />
        ))}
      </div>

      {pickerOpen && pickerTarget && (
        <RecipePicker
          recipes={recipes}
          mealType={pickerTarget.mealType}
          onSelect={handleAddRecipe}
          onClose={() => {
            setPickerOpen(false);
            setPickerTarget(null);
          }}
        />
      )}
    </div>
  );
}
