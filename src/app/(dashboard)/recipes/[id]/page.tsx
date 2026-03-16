import React from "react";
import { getRecipeById } from "@/app/services/recipes/recipes";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChefHat, Clock, Flame, Dumbbell, Wheat, Droplets, UtensilsCrossed, ArrowLeft, Scale, BookOpen, Pencil } from "lucide-react";
import { MacroCard } from "@/components/recipes/MacroCard";
import { Ingredient } from "@/types/index";

async function RecipeDetail({ params }: { params: { id: string } }) {
  const { id } = await params;

  let recipe: Awaited<ReturnType<typeof getRecipeById>> | null = null;

  try {
    recipe = await getRecipeById(id);
  } catch {
    notFound();
  }

  if (!recipe) notFound();

  const hasIngredients = recipe.recipe_ingredients.length > 0;

  const totalCalories: number = hasIngredients
    ? recipe.recipe_ingredients.reduce((total: number, ri: Ingredient) => total + (ri.amount_g / 100) * ri.ingredients.calories, 0)
    : (recipe.calories ?? 0) * (recipe.servings ?? 1);
  const totalProtein: number = hasIngredients
    ? recipe.recipe_ingredients.reduce((total: number, ri: Ingredient) => total + (ri.amount_g / 100) * ri.ingredients.protein_g, 0)
    : (recipe.protein_g ?? 0) * (recipe.servings ?? 1);
  const totalCarbs: number = hasIngredients
    ? recipe.recipe_ingredients.reduce((total: number, ri: Ingredient) => total + (ri.amount_g / 100) * ri.ingredients.carbs_g, 0)
    : (recipe.carbs_g ?? 0) * (recipe.servings ?? 1);
  const totalFat: number = hasIngredients
    ? recipe.recipe_ingredients.reduce((total: number, ri: Ingredient) => total + (ri.amount_g / 100) * ri.ingredients.fat_g, 0)
    : (recipe.fat_g ?? 0) * (recipe.servings ?? 1);

  const perServing = {
    calories: totalCalories / (recipe.servings ?? 1),
    protein: totalProtein / (recipe.servings ?? 1),
    carbs: totalCarbs / (recipe.servings ?? 1),
    fat: totalFat / (recipe.servings ?? 1),
  };

  const mealTypeLabels: Record<string, string> = {
    ontbijt: "Ontbijt",
    lunch: "Lunch",
    avondeten: "Avondeten",
    snack: "Snack",
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/recipes" className="flex items-center gap-1.5 hover:text-gray-600 transition-colors">
          <ArrowLeft size={14} />
          Recepten
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">{recipe.name}</span>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
            <ChefHat size={28} className="text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{recipe.name}</h1>
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              {recipe.meal_type && (
                <span className="flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
                  <UtensilsCrossed size={11} />
                  {mealTypeLabels[recipe.meal_type] ?? recipe.meal_type}
                </span>
              )}
              {recipe.prep_time_min && (
                <span className="flex items-center gap-1 text-sm text-gray-400">
                  <Clock size={13} />
                  {recipe.prep_time_min} min
                </span>
              )}
              {recipe.servings && (
                <span className="flex items-center gap-1 text-sm text-gray-400">
                  <Scale size={13} />
                  {recipe.servings} {recipe.servings === 1 ? "portie" : "porties"}
                </span>
              )}
            </div>
          </div>
        </div>
        <Link
          href={`/recipes/${id}/edit`}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Pencil size={14} />
          Bewerken (werkt nog niet)
        </Link>
      </div>

      {recipe.description && (
        <p className="text-gray-500 text-sm leading-relaxed mb-8 bg-white border border-gray-100 rounded-xl p-5">{recipe.description}</p>
      )}

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Flame size={16} className="text-green-600" />
              <h2 className="font-semibold text-gray-900 text-sm">Macro{"'"}s per portie</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <MacroCard
                icon={<Flame size={16} />}
                label="Calorieën"
                value={perServing.calories.toFixed(0)}
                unit="kcal"
                colorClass="bg-orange-50 text-orange-600"
              />
              <MacroCard
                icon={<Dumbbell size={16} />}
                label="Eiwitten"
                value={perServing.protein.toFixed(1)}
                unit="g"
                colorClass="bg-blue-50 text-blue-600"
              />
              <MacroCard
                icon={<Wheat size={16} />}
                label="Koolhydraten"
                value={perServing.carbs.toFixed(1)}
                unit="g"
                colorClass="bg-yellow-50 text-yellow-600"
              />
              <MacroCard
                icon={<Droplets size={16} />}
                label="Vetten"
                value={perServing.fat.toFixed(1)}
                unit="g"
                colorClass="bg-red-50 text-red-600"
              />
            </div>
          </div>

          {recipe.instructions && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={16} className="text-green-600" />
                <h2 className="font-semibold text-gray-900 text-sm">Bereidingswijze</h2>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{recipe.instructions}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <UtensilsCrossed size={16} className="text-green-600" />
              <h2 className="font-semibold text-gray-900 text-sm">Ingrediënten</h2>
            </div>

            {recipe.recipe_ingredients.length > 0 ? (
              <ul className="space-y-2">
                {recipe.recipe_ingredients.map((ri: Ingredient) => (
                  <li key={ri.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-700 truncate flex-1">{ri.ingredients.name}</span>
                    <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full ml-2 shrink-0">
                      {ri.amount_g}g
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 italic">Geen ingrediënten gevonden</p>
            )}

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Scale size={11} />
                Totaal gewicht
              </span>
              <span className="text-xs font-semibold text-gray-600">
                {recipe.recipe_ingredients.reduce((t: number, ri: Ingredient) => t + ri.amount_g, 0)}g
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



export default RecipeDetail;
