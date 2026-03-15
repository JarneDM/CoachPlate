import { getRecipes } from "@/app/services/recipes/recipes";
import Link from "next/link";
import DeleteRecipeButton from "@/components/recipes/DeleteRecipeButton";
import { Timer, ChefHat, Plus } from "lucide-react";
import { MacroBadge } from "@/components/recipes/MacroBadge";
import Button from "@/components/CTA/Button";


const mealTypeLabels: Record<string, string> = {
  ontbijt: "Ontbijt",
  lunch: "Lunch",
  avondeten: "Avondeten",
  snack: "Snack",
};

export default async function RecipesPage() {
  const recipes = await getRecipes();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recepten</h1>
          <p className="text-gray-400 text-sm mt-1">
            {recipes.length} {recipes.length === 1 ? "recept" : "recepten"} in je bibliotheek
          </p>
        </div>
        <Button href="/recipes/new" label="Nieuw recept" icon={<Plus size={14} />} />
      </div>

      {recipes.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:border-green-200 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{recipe.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {recipe.meal_type && (
                      <span className="text-xs text-gray-400">{mealTypeLabels[recipe.meal_type] ?? recipe.meal_type}</span>
                    )}
                    {recipe.prep_time_min && (
                      <span className="text-xs text-gray-400 flex gap-1">
                        <Timer className="w-4 h-4" /> {recipe.prep_time_min} min
                      </span>
                    )}
                  </div>
                </div>
                <DeleteRecipeButton id={recipe.id} />
              </div>

              {recipe.calories && (
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <MacroBadge label="kcal" value={recipe.calories} color="orange" />
                  <MacroBadge label="eiwit" value={recipe.protein_g} color="blue" />
                  <MacroBadge label="koolh" value={recipe.carbs_g} color="yellow" />
                  <MacroBadge label="vet" value={recipe.fat_g} color="red" />
                </div>
              )}

              {recipe.description && <p className="text-xs text-gray-400 mb-4 line-clamp-2">{recipe.description}</p>}

              <Link href={`/recipes/${recipe.id}`} className="text-xs text-green-600 font-medium hover:underline">
                Bekijk recept →
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-xl border border-gray-100">
          <div className="text-5xl mb-4 flex justify-center items-center">
            <ChefHat className="w-12 h-12 text-gray-300" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Nog geen recepten</h3>
          <p className="text-gray-400 text-sm mb-6">Maak je eerste recept aan om te gebruiken in weekplannen.</p>
          <div className="items-center justify-center flex">
            <Button href="/recipes/new" label="Eerste recept aanmaken" icon={<Plus size={14} />} width="max-w-[300px] w-auto" />
          </div>
        </div>
      )}
    </div>
  );
}


