"use client";

import { useState } from "react";
import { Sparkles, ChefHat, RotateCcw, Save } from "lucide-react";
import { createRecipe } from "@/app/services/recipes/actions";
import { GeneratedRecipe } from "@/types/interfaces";
import { MacroCard } from "./MacroCard";

const mealTypes = ["ontbijt", "lunch", "avondeten", "snack"];

export default function AIRecipeGenerator() {
  const [name, setName] = useState("");
  const [wishes, setWishes] = useState("");
  const [mealType, setMealType] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [recipe, setRecipe] = useState<GeneratedRecipe | null>(null);

  async function handleGenerate() {
    if (!name) {
      setError("Vul een naam of beschrijving in");
      return;
    }

    setLoading(true);
    setError("");
    setRecipe(null);

    try {
      const res = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, wishes, mealType }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      setRecipe(data.recipe);
    } catch {
      setError("Er ging iets mis. Probeer opnieuw.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!recipe) return;
    setSaving(true);

    await createRecipe({
      name: recipe.name,
      description: recipe.description,
      instructions: recipe.instructions,
      prep_time_min: recipe.prep_time_min,
      meal_type: recipe.meal_type,
      servings: recipe.servings,
      ingredients: recipe.ingredients,
    });
  }

  const totals = recipe?.ingredients.reduce(
    (acc, ing) => {
      const factor = ing.amount_g / 100;
      return {
        calories: acc.calories + ing.calories * factor,
        protein_g: acc.protein_g + ing.protein_g * factor,
        carbs_g: acc.carbs_g + ing.carbs_g * factor,
        fat_g: acc.fat_g + ing.fat_g * factor,
      };
    },
    { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 },
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 text-sm">Vertel de AI wat je wil</h2>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Naam of beschrijving <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="bv. Hoog proteïne pasta, Griekse salade, Havermout..."
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Maaltijdtype</label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Kies type</option>
              {mealTypes.map((t) => (
                <option key={t} value={t} className="capitalize">
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Extra wensen</label>
            <input
              type="text"
              value={wishes}
              onChange={(e) => setWishes(e.target.value)}
              placeholder="bv. glutenvrij, geen vlees..."
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !name}
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
        >
          <Sparkles size={14} />
          {loading ? "Recept genereren..." : "Genereer recept"}
        </button>
      </div>

      {loading && (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-3 animate-pulse">
            <ChefHat size={20} className="text-green-600" />
          </div>
          <p className="text-sm text-gray-500">AI is je recept aan het maken...</p>
        </div>
      )}

      {recipe && !loading && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-green-200 p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">✨ AI gegenereerd</span>
                  {recipe.meal_type && (
                    <span className="bg-gray-50 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full capitalize">
                      {recipe.meal_type}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{recipe.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{recipe.description}</p>
              </div>
            </div>

            {totals && (
              <div className="grid grid-cols-4 gap-3 mt-4">
                <MacroCard label="Calorieën" value={Math.round(totals.calories / recipe.servings).toString()} unit="kcal" colorClass="bg-orange-500/50" />
                <MacroCard label="Eiwitten" value={Math.round(totals.protein_g / recipe.servings).toString()} unit="g" colorClass="bg-blue-500/50" />
                <MacroCard label="Koolhydraten" value={Math.round(totals.carbs_g / recipe.servings).toString()} unit="g" colorClass="bg-yellow-500/50" />
                <MacroCard label="Vetten" value={Math.round(totals.fat_g / recipe.servings).toString()} unit="g" colorClass="bg-red-500/50" />
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Ingrediënten</h3>
            <div className="space-y-2">
              {recipe.ingredients.map((ing, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-700">{ing.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{ing.amount_g}g</span>
                    <span className="text-xs text-orange-500">{Math.round((ing.calories * ing.amount_g) / 100)} kcal</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {recipe.instructions && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 text-sm mb-3">Bereiding</h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{recipe.instructions}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleGenerate}
              className="flex items-center gap-2 border border-gray-200 hover:border-gray-300 text-gray-600 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
            >
              <RotateCcw size={14} />
              Opnieuw genereren
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
            >
              <Save size={14} />
              {saving ? "Opslaan..." : "Recept opslaan"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


