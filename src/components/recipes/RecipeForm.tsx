"use client";

import { useState } from "react";
import { createRecipe } from "@/app/services/recipes/actions";
import { searchIngredients, type FoodFactsResult } from "@/app/services/ingredients/open-food-facts";
import { MacroTotal } from "@/components/recipes/MacroTotal";
import { IngredientRow } from "@/types/interfaces";


const mealTypes = ["ontbijt", "lunch", "avondeten", "snack"];

export default function RecipeForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [mealType, setMealType] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [servings, setServings] = useState("1");
  const [ingredients, setIngredients] = useState<IngredientRow[]>([]);
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
    { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }
  );

  const perServing = {
    calories: Math.round(macros.calories / Number(servings)),
    protein_g: Math.round(macros.protein_g / Number(servings)),
    carbs_g: Math.round(macros.carbs_g / Number(servings)),
    fat_g: Math.round(macros.fat_g / Number(servings)),
  };

  async function handleSearch() {
    setSearching(true);
    const results = await searchIngredients(search);
    setSearchResults(results);
    setSearching(false);
  }

  function addIngredient(food: FoodFactsResult) {
    setIngredients(prev => [...prev, {
      id: food.id,
      name: food.name,
      amount_g: 100,
      calories: food.calories,
      protein_g: food.protein_g,
      carbs_g: food.carbs_g,
      fat_g: food.fat_g,
    }]);
    setSearch("");
    setSearchResults([]);
  }

  function updateAmount(id: string, amount: number) {
    setIngredients(prev =>
      prev.map(ing => ing.id === id ? { ...ing, amount_g: amount } : ing)
    );
  }

  function removeIngredient(id: string) {
    setIngredients(prev => prev.filter(ing => ing.id !== id));
  }

  async function handleSubmit() {
    if (!name) { setError("Vul een naam in"); return; }
    if (ingredients.length === 0) { setError("Voeg minstens één ingrediënt toe"); return; }

    setLoading(true);
    setError("");

    await createRecipe({
      name,
      description,
      instructions,
      meal_type: mealType,
      prep_time_min: prepTime ? Number(prepTime) : undefined,
      servings: Number(servings),
      ingredients,
    });
  }

  return (
    <div className="space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">{error}</div>}

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Basisinformatie</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Naam <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="bv. Havermout met banaan"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Maaltijdtype</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Bereidingstijd (min)</label>
            <input
              type="number"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              placeholder="15"
              min="1"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Porties</label>
            <input
              type="number"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              min="1"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Beschrijving</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Korte beschrijving van het recept..."
            rows={2}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bereidingswijze</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Stap voor stap bereiding..."
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">
          Ingrediënten <span className="text-red-400">*</span>
        </h2>

        <div className="relative mb-4 flex items-center gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Zoek ingrediënt via Open Food Facts..."
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={() => handleSearch()}
            className="px-4 py-2.5 rounded-md text-white bg-blue-500 hover:bg-blue-600 transition-colors text-sm font-medium cursor-pointer"
          >
            Zoek
          </button>
          {searching && <div className="absolute right-3 top-3 text-gray-400 text-xs">Zoeken...</div>}

          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-10 max-h-60 overflow-y-auto">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => addIngredient(result)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                >
                  <p className="text-sm font-medium text-gray-900 truncate">{result.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {result.calories} kcal · {result.protein_g}g prot · {result.carbs_g}g koolh · {result.fat_g}g vet (per 100g)
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {ingredients.length > 0 ? (
          <div className="space-y-2">
            <div className="grid grid-cols-12 gap-2 text-xs text-gray-400 font-medium px-2 mb-1">
              <span className="col-span-4">Ingrediënt</span>
              <span className="col-span-2">Gram</span>
              <span className="col-span-2">Kcal</span>
              <span className="col-span-1">Prot</span>
              <span className="col-span-1">Koolh</span>
              <span className="col-span-1">Vet</span>
              <span className="col-span-1"></span>
            </div>

            {ingredients.map((ing) => {
              const factor = ing.amount_g / 100;
              return (
                <div key={ing.id} className="grid grid-cols-12 gap-2 items-center bg-gray-50 rounded-lg px-2 py-2">
                  <span className="col-span-4 text-sm text-gray-700 truncate">{ing.name}</span>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={ing.amount_g}
                      onChange={(e) => updateAmount(ing.id, Number(e.target.value))}
                      min="1"
                      className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  </div>
                  <span className="col-span-2 text-sm text-orange-600 font-medium">{Math.round(ing.calories * factor)}</span>
                  <span className="col-span-1 text-sm text-blue-600">{Math.round(ing.protein_g * factor)}g</span>
                  <span className="col-span-1 text-sm text-yellow-600">{Math.round(ing.carbs_g * factor)}g</span>
                  <span className="col-span-1 text-sm text-red-500">{Math.round(ing.fat_g * factor)}g</span>
                  <button
                    onClick={() => removeIngredient(ing.id)}
                    className="col-span-1 text-gray-300 hover:text-red-400 transition-colors text-center"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 border border-dashed border-gray-200 rounded-lg">
            <p className="text-sm text-gray-400">Zoek hierboven naar ingrediënten om toe te voegen</p>
          </div>
        )}

        {ingredients.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-400 mb-2">
              Totaal per portie ({servings} {Number(servings) === 1 ? "portie" : "porties"})
            </p>
            <div className="grid grid-cols-4 gap-3">
              <MacroTotal label="Calorieën" value={perServing.calories} unit="kcal" color="orange" />
              <MacroTotal label="Proteïne" value={perServing.protein_g} unit="g" color="blue" />
              <MacroTotal label="Koolhydraten" value={perServing.carbs_g} unit="g" color="yellow" />
              <MacroTotal label="Vetten" value={perServing.fat_g} unit="g" color="red" />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3">
        <a href="/recipes" className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          Annuleer
        </a>
        <button
          onClick={handleSubmit}
          disabled={loading || !name || ingredients.length === 0}
          className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          {loading ? "Opslaan..." : "Recept opslaan"}
        </button>
      </div>
    </div>
  );
}

