import MealSlot from "./MealSlot";
import { Day, Client } from "@/types/interfaces";

const MEAL_TYPE_LABELS: Record<string, string> = {
  ontbijt: "Ontbijt",
  lunch: "Lunch",
  avondeten: "Avondeten",
  snack: "Snack",
};

interface Props {
  day: Day;
  dayName: string;
  mealTypes: string[];
  client: Client | null;
  onAddRecipe: (dayId: string, mealType: string) => void;
  onRemoveRecipe: (mealRecipeId: string) => void;
}

export default function DayColumn({ day, dayName, mealTypes, client, onAddRecipe, onRemoveRecipe }: Props) {
  const allMealRecipes = day.meals.flatMap((m) => m.meal_recipes);
  const totals = allMealRecipes.reduce(
    (acc, mr) => ({
      calories: acc.calories + (mr.recipes.calories ?? 0) * mr.servings,
      protein_g: acc.protein_g + (mr.recipes.protein_g ?? 0) * mr.servings,
      carbs_g: acc.carbs_g + (mr.recipes.carbs_g ?? 0) * mr.servings,
      fat_g: acc.fat_g + (mr.recipes.fat_g ?? 0) * mr.servings,
    }),
    { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 },
  );

  const calorieProgress = client?.calories_goal ? Math.min((totals.calories / client.calories_goal) * 100, 100) : null;

  return (
    <div className="flex flex-col gap-2 min-w-0">
      <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
        <p className="font-semibold text-gray-900 text-sm">{dayName}</p>
        {day.date && (
          <p className="text-xs text-gray-400 mt-0.5">
            {new Date(day.date).toLocaleDateString("nl-BE", {
              day: "numeric",
              month: "short",
            })}
          </p>
        )}
      </div>

      {mealTypes.map((mealType) => {
        const meal = day.meals.find((m) => m.meal_type === mealType);
        return (
          <MealSlot
            key={mealType}
            mealType={mealType}
            label={MEAL_TYPE_LABELS[mealType]}
            mealRecipes={meal?.meal_recipes ?? []}
            onAdd={() => onAddRecipe(day.id, mealType)}
            onRemove={onRemoveRecipe}
          />
        );
      })}

      <div className="bg-white rounded-xl border border-gray-100 p-3 space-y-2">
        <p className="text-xs font-medium text-gray-400 text-center">Totaal</p>

        {calorieProgress !== null && (
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">{Math.round(totals.calories)} kcal</span>
              <span className="text-gray-400">{client?.calories_goal}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  calorieProgress >= 90 ? "bg-green-500" : calorieProgress >= 60 ? "bg-yellow-400" : "bg-red-400"
                }`}
                style={{ width: `${calorieProgress}%` }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-1 text-center">
          <div>
            <p className="text-xs font-bold text-blue-600">{Math.round(totals.protein_g)}g</p>
            <p className="text-xs text-gray-400">eiwit</p>
          </div>
          <div>
            <p className="text-xs font-bold text-yellow-600">{Math.round(totals.carbs_g)}g</p>
            <p className="text-xs text-gray-400">koolh</p>
          </div>
          <div>
            <p className="text-xs font-bold text-red-500">{Math.round(totals.fat_g)}g</p>
            <p className="text-xs text-gray-400">vet</p>
          </div>
        </div>
      </div>
    </div>
  );
}
