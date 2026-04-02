"use client";

import { useEffect, useState } from "react";
import { Search, X, ChefHat, NotepadText } from "lucide-react";
import { Recipe } from "@/types/interfaces";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

interface Props {
  recipes: Recipe[];
  mealType: string;
  onSelect: (recipeId: string, servings: number) => void;
  onClose: () => void;
}

const MEAL_TYPE_LABELS: Record<string, string> = {
  ontbijt: "Ontbijt",
  lunch: "Lunch",
  avondeten: "Avondeten",
  snack: "Snack",
};

export default function RecipePicker({ recipes, mealType, onSelect, onClose }: Props) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Recipe | null>(null);
  const [servings, setServings] = useState(1);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let isActive = true;
    let unsubscribe: (() => void) | undefined;

    void (async () => {
      const supabase = await createClient();

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (isActive) {
          setUser(session?.user ?? null);
        }
      });

      unsubscribe = () => subscription.unsubscribe();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (isActive) {
        setUser(session?.user ?? null);
      }
    })();

    return () => {
      isActive = false;
      unsubscribe?.();
    };
  }, []);

  const mealtypeRecipes = recipes.filter((r) => r.meal_type === mealType);

  const filtered = mealtypeRecipes.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

  function handleConfirm() {
    if (!selected) return;
    onSelect(selected.id, servings);
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-gray-900">Recept toevoegen</h3>
            <p className="text-xs text-gray-400 mt-0.5">{MEAL_TYPE_LABELS[mealType]}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Zoek recept..."
              autoFocus
              className="w-full border border-gray-200 rounded-lg pl-8 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto p-2">
          {filtered.length > 0 ? (
            filtered.map((recipe) => {
              const isCoachRecipe = recipe.coach_id === user?.id;

              return (
                <button
                  key={recipe.id}
                  onClick={() => setSelected(recipe)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center gap-3 ${
                    selected?.id === recipe.id ? "bg-green-50 border border-green-200" : "hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`w-8 h-8 ${isCoachRecipe ? "bg-gray-200" : "bg-green-100"} rounded-lg flex items-center justify-center shrink-0`}
                  >
                    {isCoachRecipe ? <NotepadText size={14} /> : <ChefHat size={14} className="text-green-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{recipe.name}</p>
                    {recipe.calories && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {recipe.calories} kcal · {recipe.protein_g}g eiw · {recipe.carbs_g}g koolh · {recipe.fat_g}g vet
                      </p>
                    )}
                  </div>
                  {selected?.id === recipe.id && (
                    <div className="w-4 h-4 bg-green-500 rounded-full shrink-0 flex items-center justify-center">
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1 4L3 6L7 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400">
                {recipes.length === 0 ? "Je hebt nog geen recepten aangemaakt" : "Geen recepten gevonden"}
              </p>
            </div>
          )}
        </div>

        {selected && (
          <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">Aantal porties</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setServings((s) => Math.max(0.5, s - 0.5))}
                  className="w-7 h-7 rounded-full bg-white border border-gray-200 hover:border-green-400 flex items-center justify-center text-gray-600 transition-colors"
                >
                  −
                </button>
                <span className="text-sm font-semibold w-8 text-center">{servings}</span>
                <button
                  onClick={() => setServings((s) => s + 0.5)}
                  className="w-7 h-7 rounded-full bg-white border border-gray-200 hover:border-green-400 flex items-center justify-center text-gray-600 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {selected.calories && (
              <div className="flex gap-3 mb-3 text-center">
                <div className="flex-1 bg-white rounded-lg p-2">
                  <p className="text-xs font-bold text-orange-500">{Math.round((selected.calories ?? 0) * servings)} kcal</p>
                </div>
                <div className="flex-1 bg-white rounded-lg p-2">
                  <p className="text-xs font-bold text-blue-500">{Math.round((selected.protein_g ?? 0) * servings)}g eiw</p>
                </div>
                <div className="flex-1 bg-white rounded-lg p-2">
                  <p className="text-xs font-bold text-yellow-500">{Math.round((selected.carbs_g ?? 0) * servings)}g koolh</p>
                </div>
                <div className="flex-1 bg-white rounded-lg p-2">
                  <p className="text-xs font-bold text-red-500">{Math.round((selected.fat_g ?? 0) * servings)}g vet</p>
                </div>
              </div>
            )}

            <button
              onClick={handleConfirm}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
            >
              Toevoegen aan {MEAL_TYPE_LABELS[mealType].toLowerCase()}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
