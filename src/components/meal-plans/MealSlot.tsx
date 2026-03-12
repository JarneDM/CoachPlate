import { Plus, X } from "lucide-react";
import { MealRecipe } from "@/types/interfaces";

interface Props {
  mealType: string;
  label: string;
  mealRecipes: MealRecipe[];
  onAdd: () => void;
  onRemove: (mealRecipeId: string) => void;
}

const MEAL_COLORS: Record<string, string> = {
  ontbijt: "text-orange-500",
  lunch: "text-yellow-500",
  avondeten: "text-blue-500",
  snack: "text-green-500",
};

export default function MealSlot({ mealType, label, mealRecipes, onAdd, onRemove }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-2.5 min-h-[80px]">
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-semibold ${MEAL_COLORS[mealType]}`}>{label}</span>
        <button
          onClick={onAdd}
          className="w-5 h-5 rounded-full bg-gray-100 hover:bg-green-100 hover:text-green-600 flex items-center justify-center transition-colors text-gray-400"
        >
          <Plus size={10} />
        </button>
      </div>

      {mealRecipes.length > 0 ? (
        <div className="space-y-1.5">
          {mealRecipes.map((mr) => (
            <div key={mr.id} className="group flex items-start justify-between gap-1 bg-gray-50 rounded-lg p-1.5">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-700 truncate leading-tight">{mr.recipes.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {mr.servings !== 1 && <span className="text-xs text-gray-400">×{mr.servings}</span>}
                  {mr.recipes.calories && (
                    <span className="text-xs text-orange-500">{Math.round(mr.recipes.calories * mr.servings)} kcal</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => onRemove(mr.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all shrink-0 mt-0.5"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <button
          onClick={onAdd}
          className="w-full text-xs text-gray-300 hover:text-gray-400 text-center py-2 border border-dashed border-gray-200 rounded-lg hover:border-green-300 hover:text-green-400 transition-colors"
        >
          + recept
        </button>
      )}
    </div>
  );
}
