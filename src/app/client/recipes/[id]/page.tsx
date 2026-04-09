import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChefHat, Clock, Flame, Dumbbell, Wheat, Droplets, UtensilsCrossed, Scale, BookOpen } from "lucide-react";
import { MacroCard } from "@/components/recipes/MacroCard";
import BackButton from "@/components/client/BackButton";

type RecipeIngredient = {
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
};

const MEAL_TYPE_LABELS: Record<string, string> = {
  ontbijt: "Ontbijt",
  lunch: "Lunch",
  avondeten: "Avondeten",
  snack: "Snack",
};

export default async function ClientRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/join");

  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Verify client exists
  const { data: client } = await admin
    .from("clients")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!client) redirect("/join");

  const { data: recipe } = await admin
    .from("recipes")
    .select(`
      id, name, description, instructions, prep_time_min, meal_type,
      calories, protein_g, carbs_g, fat_g, servings,
      recipe_ingredients (
        id, amount_g,
        ingredients (
          id, name, calories, protein_g, carbs_g, fat_g
        )
      )
    `)
    .eq("id", id)
    .maybeSingle();

  if (!recipe) notFound();

  const ingredients = (recipe.recipe_ingredients ?? []) as unknown as RecipeIngredient[];
  const hasIngredients = ingredients.length > 0;

  const totals = hasIngredients
    ? ingredients.reduce(
        (acc, ri) => ({
          calories: acc.calories + (ri.amount_g / 100) * ri.ingredients.calories,
          protein: acc.protein + (ri.amount_g / 100) * ri.ingredients.protein_g,
          carbs: acc.carbs + (ri.amount_g / 100) * ri.ingredients.carbs_g,
          fat: acc.fat + (ri.amount_g / 100) * ri.ingredients.fat_g,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      )
    : {
        calories: (recipe.calories ?? 0) * (recipe.servings ?? 1),
        protein: (recipe.protein_g ?? 0) * (recipe.servings ?? 1),
        carbs: (recipe.carbs_g ?? 0) * (recipe.servings ?? 1),
        fat: (recipe.fat_g ?? 0) * (recipe.servings ?? 1),
      };

  const perServing = {
    calories: totals.calories / (recipe.servings ?? 1),
    protein: totals.protein / (recipe.servings ?? 1),
    carbs: totals.carbs / (recipe.servings ?? 1),
    fat: totals.fat / (recipe.servings ?? 1),
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <BackButton />
        <span>/</span>
        <span className="text-gray-700 font-medium">{recipe.name}</span>
      </div>

      <div className="mb-8 flex items-center gap-4">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center shrink-0">
          <ChefHat size={28} className="text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{recipe.name}</h1>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            {recipe.meal_type && (
              <span className="flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
                <UtensilsCrossed size={11} />
                {MEAL_TYPE_LABELS[recipe.meal_type] ?? recipe.meal_type}
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

      {recipe.description && (
        <p className="text-gray-500 text-sm leading-relaxed mb-8 bg-white border border-gray-100 rounded-xl p-5">{recipe.description}</p>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Flame size={16} className="text-green-600" />
              <h2 className="font-semibold text-gray-900 text-sm">Macro&apos;s per portie</h2>
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
            <div className="bg-white rounded-xl border border-gray-100 p-6 pl-8">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={16} className="text-green-600" />
                <h2 className="font-semibold text-gray-900 text-sm">Bereidingswijze</h2>
              </div>
              <ol className="list-decimal space-y-2 text-sm text-gray-600 leading-relaxed p-6">
                {recipe.instructions.split(",").map((step: string, index: number) => (
                  <li key={index}>{step.trim()}</li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <div>
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <UtensilsCrossed size={16} className="text-green-600" />
              <h2 className="font-semibold text-gray-900 text-sm">Ingrediënten</h2>
            </div>

            {ingredients.length > 0 ? (
              <>
                <ul className="space-y-2">
                  {ingredients.map((ri) => (
                    <li key={ri.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-gray-700 truncate flex-1">{ri.ingredients.name}</span>
                      <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full ml-2 shrink-0">
                        {ri.amount_g}g
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Scale size={11} />
                    Totaal gewicht
                  </span>
                  <span className="text-xs font-semibold text-gray-600">{ingredients.reduce((t, ri) => t + ri.amount_g, 0)}g</span>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-400 italic">Geen ingrediënten gevonden</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
