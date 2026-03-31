"use client";

import { useState } from "react";
import { createRecipe, updateRecipe } from "@/app/services/recipes/actions";
import { searchIngredients, type FoodFactsResult } from "@/app/services/ingredients/open-food-facts";
import { MacroTotal } from "@/components/recipes/MacroTotal";
import { IngredientRow } from "@/types/interfaces";
import Link from "next/link";
import { X } from "lucide-react";

const mealTypes = ["ontbijt", "lunch", "avondeten", "snack"];

interface RecipeFormProps {
  initialRecipe?: {
    id: string;
    name: string;
    description: string | null;
    instructions: string | null;
    meal_type: string | null;
    prep_time_min: number | null;
    servings: number;
    recipe_ingredients: Array<{
      id: string;
      amount_g: number;
      ingredients: {
        id: string;
        name: string;
        calories: number;
        protein_g: number;
        carbs_g: number;
        fat_g: number;
      };
    }>;
  };
}

export default function RecipeForm({ initialRecipe }: RecipeFormProps) {
  const isEditMode = !!initialRecipe;
  const initialIngredients = initialRecipe?.recipe_ingredients
    ? initialRecipe.recipe_ingredients.map((ri) => ({
        id: ri.ingredients.id,
        name: ri.ingredients.name,
        amount_g: ri.amount_g,
        calories: ri.ingredients.calories,
        protein_g: ri.ingredients.protein_g,
        carbs_g: ri.ingredients.carbs_g,
        fat_g: ri.ingredients.fat_g,
      }))
    : [];

  const [name, setName] = useState(initialRecipe?.name || "");
  const [description, setDescription] = useState(initialRecipe?.description || "");
  const [instructions, setInstructions] = useState(initialRecipe?.instructions || "");
  const [mealType, setMealType] = useState(initialRecipe?.meal_type || "");
  const [prepTime, setPrepTime] = useState(initialRecipe?.prep_time_min?.toString() || "");
  const [servings, setServings] = useState(initialRecipe?.servings?.toString() || "1");
  const [ingredients, setIngredients] = useState<IngredientRow[]>(initialIngredients);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<FoodFactsResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const macros = ingredients.reduce(
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

  const perServing = {
    calories: Math.round(macros.calories / Number(servings || 1)),
    protein_g: Math.round(macros.protein_g / Number(servings || 1)),
    carbs_g: Math.round(macros.carbs_g / Number(servings || 1)),
    fat_g: Math.round(macros.fat_g / Number(servings || 1)),
  };

  async function handleSearch() {
    setSearching(true);
    const results = await searchIngredients(search);
    setSearchResults(results);
    setSearching(false);
  }

  function addIngredient(food: FoodFactsResult) {
    setIngredients((prev) => [
      ...prev,
      {
        id: food.id,
        name: food.name,
        amount_g: 100,
        calories: food.calories,
        protein_g: food.protein_g,
        carbs_g: food.carbs_g,
        fat_g: food.fat_g,
      },
    ]);
    setSearch("");
    setSearchResults([]);
  }

  function updateAmount(id: string, amount: number) {
    setIngredients((prev) => prev.map((ing) => (ing.id === id ? { ...ing, amount_g: amount } : ing)));
  }

  function removeIngredient(id: string) {
    setIngredients((prev) => prev.filter((ing) => ing.id !== id));
  }

  async function handleSubmit() {
    if (!name) {
      setError("Vul een naam in");
      return;
    }

    if (ingredients.length === 0) {
      setError("Voeg minstens een ingrediënt toe");
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      name,
      description,
      instructions,
      meal_type: mealType,
      prep_time_min: prepTime ? Number(prepTime) : undefined,
      servings: Number(servings || 1),
      ingredients,
    };

    if (isEditMode && initialRecipe) {
      await updateRecipe(initialRecipe.id, payload);
    } else {
      await createRecipe(payload);
    }
  }

  return (
    <div className="space-y-6">
      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-6">
        <h2 className="font-semibold text-gray-900">Basisinformatie</h2>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Naam <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="bv. Havermout met banaan"
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Maaltijdtype</label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
            <label className="mb-1 block text-sm font-medium text-gray-700">Bereidingstijd (min)</label>
            <input
              type="number"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              placeholder="15"
              min="1"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Porties</label>
            <input
              type="number"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              min="1"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Beschrijving</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Korte beschrijving van het recept..."
            rows={2}
            className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Bereidingswijze</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Stap voor stap bereiding..."
            rows={4}
            className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6">
        <h2 className="mb-4 font-semibold text-gray-900">
          Ingrediënten <span className="text-red-400">*</span>
        </h2>

        <div className="relative mb-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Zoek ingrediënt via Open Food Facts..."
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleSearch}
              className="rounded-md bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-600"
            >
              Zoek
            </button>
          </div>

          {searching && <div className="absolute right-3 top-3 text-xs text-gray-400">Zoeken...</div>}

          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => addIngredient(result)}
                  className="w-full border-b border-gray-50 px-4 py-3 text-left transition-colors last:border-0 hover:bg-gray-50"
                >
                  <p className="truncate text-sm font-medium text-gray-900">{result.name}</p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {result.calories} kcal · {result.protein_g}g prot · {result.carbs_g}g koolh · {result.fat_g}g vet (per 100g)
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {ingredients.length > 0 ? (
          <div className="space-y-2">
            <div className="mb-1 hidden grid-cols-12 gap-2 px-2 text-xs font-medium text-gray-400 md:grid">
              <span className="col-span-4">Ingrediënt</span>
              <span className="col-span-2">Gram</span>
              <span className="col-span-2">Kcal</span>
              <span className="col-span-1">Prot</span>
              <span className="col-span-1">Koolh</span>
              <span className="col-span-1">Vet</span>
              <span className="col-span-1" />
            </div>

            {ingredients.map((ing) => {
              const factor = ing.amount_g / 100;

              return (
                <div
                  key={ing.id}
                  className="rounded-lg bg-gray-50 px-3 py-3 md:grid md:grid-cols-12 md:items-center md:gap-2 md:px-2 md:py-2"
                >
                  <div className="mb-2 flex items-start justify-between gap-3 md:col-span-4 md:mb-0 md:block">
                    <span className="text-sm text-gray-700 md:truncate">{ing.name}</span>
                    <button
                      onClick={() => removeIngredient(ing.id)}
                      className="rounded p-1 text-gray-300 transition-colors hover:text-red-400 md:hidden"
                      aria-label={`Verwijder ${ing.name}`}
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="mb-2 grid grid-cols-2 gap-2 sm:grid-cols-5 md:col-span-7 md:mb-0 md:grid-cols-5">
                    <div className="rounded-md bg-white px-2 py-1.5 md:bg-transparent md:p-0">
                      <p className="mb-1 text-[11px] text-gray-400 md:hidden">Gram</p>
                      <input
                        type="number"
                        value={ing.amount_g}
                        onChange={(e) => updateAmount(ing.id, Number(e.target.value))}
                        min="1"
                        className="w-full rounded border border-gray-200 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </div>

                    <div className="rounded-md bg-white px-2 py-1.5 text-sm md:bg-transparent md:p-0">
                      <p className="mb-1 text-[11px] text-gray-400 md:hidden">Kcal</p>
                      <span className="text-orange-600">{Math.round(ing.calories * factor)}</span>
                    </div>

                    <div className="rounded-md bg-white px-2 py-1.5 text-sm md:bg-transparent md:p-0">
                      <p className="mb-1 text-[11px] text-gray-400 md:hidden">Prot</p>
                      <span className="text-blue-600">{Math.round(ing.protein_g * factor)}g</span>
                    </div>

                    <div className="rounded-md bg-white px-2 py-1.5 text-sm md:bg-transparent md:p-0">
                      <p className="mb-1 text-[11px] text-gray-400 md:hidden">Koolh</p>
                      <span className="text-yellow-600">{Math.round(ing.carbs_g * factor)}g</span>
                    </div>

                    <div className="rounded-md bg-white px-2 py-1.5 text-sm md:bg-transparent md:p-0">
                      <p className="mb-1 text-[11px] text-gray-400 md:hidden">Vet</p>
                      <span className="text-red-500">{Math.round(ing.fat_g * factor)}g</span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeIngredient(ing.id)}
                    className="hidden text-center text-gray-300 transition-colors hover:text-red-400 md:col-span-1 md:block"
                    aria-label={`Verwijder ${ing.name}`}
                  >
                    <X size={14} className="mx-auto" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-200 py-8 text-center">
            <p className="text-sm text-gray-400">Zoek hierboven naar ingrediënten om toe te voegen</p>
          </div>
        )}

        {ingredients.length > 0 && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <p className="mb-2 text-xs font-medium text-gray-400">
              Totaal per portie ({servings} {Number(servings) === 1 ? "portie" : "porties"})
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <MacroTotal label="Calorieën" value={perServing.calories} unit="kcal" color="orange" />
              <MacroTotal label="Proteïne" value={perServing.protein_g} unit="g" color="blue" />
              <MacroTotal label="Koolhydraten" value={perServing.carbs_g} unit="g" color="yellow" />
              <MacroTotal label="Vetten" value={perServing.fat_g} unit="g" color="red" />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
        <Link
          href={isEditMode ? `/recipes/${initialRecipe?.id}` : "/recipes"}
          className="rounded-lg px-4 py-2 text-center text-sm text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
        >
          Annuleer
        </Link>
        <button
          onClick={handleSubmit}
          disabled={loading || !name || ingredients.length === 0}
          className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:bg-green-300"
        >
          {loading ? (isEditMode ? "Bijwerken..." : "Opslaan...") : isEditMode ? "Recept bijwerken" : "Recept opslaan"}
        </button>
      </div>
    </div>
  );
}
