import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const MEAL_TYPES = ["ontbijt", "lunch", "avondeten", "snack"];

const MEAL_TYPE_LABELS: Record<string, string> = {
  ontbijt: "Ontbijt",
  lunch: "Lunch",
  avondeten: "Avondeten",
  snack: "Snack",
};

const MEAL_COLORS: Record<string, string> = {
  ontbijt: "text-orange-500",
  lunch: "text-yellow-500",
  avondeten: "text-blue-500",
  snack: "text-green-500",
};

const DAY_NAMES = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"];

type Recipe = { id: string; name: string; calories?: number; protein_g?: number; carbs_g?: number; fat_g?: number };
type MealRecipe = { id: string; servings: number; recipes: unknown };
type Meal = { id: string; meal_type: string; order_index: number; meal_recipes: MealRecipe[] };
type Day = { id: string; day_number: number; date: string | null; meals: Meal[] };

export default async function ClientMealPlanPage({ params }: { params: Promise<{ id: string }> }) {
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

  const { data: client } = await admin
    .from("clients")
    .select("id, calories_goal, protein_goal, carbs_goal, fat_goal")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!client) redirect("/join");

  const { data: plan } = await admin
    .from("meal_plans")
    .select(`
      id, name, start_date, end_date, notes,
      meal_plan_days (
        id, day_number, date,
        meals (
          id, meal_type, order_index,
          meal_recipes (
            id, servings,
            recipes (
              id, name, calories, protein_g, carbs_g, fat_g
            )
          )
        )
      )
    `)
    .eq("id", id)
    .eq("client_id", client.id)
    .maybeSingle();

  if (!plan) notFound();

  const sortedDays: Day[] = [...(plan.meal_plan_days ?? [])].sort((a, b) => a.day_number - b.day_number);

  return (
    <div>
      <div className="mb-6 flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <div className="flex flex-wrap items-center gap-2 text-sm md:gap-3">
          <Link
            href="/client/dashboard"
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft size={14} />
            Dashboard
          </Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-base font-bold text-gray-900 md:text-lg">{plan.name}</h1>
        </div>
        {plan.start_date && (
          <span className="text-sm text-gray-400">
            {new Date(plan.start_date).toLocaleDateString("nl-BE", { day: "numeric", month: "short" })}
            {plan.end_date &&
              ` → ${new Date(plan.end_date).toLocaleDateString("nl-BE", { day: "numeric", month: "short" })}`}
          </span>
        )}
      </div>

      {plan.notes && (
        <div className="mb-4 bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-sm text-green-800">
          {plan.notes}
        </div>
      )}

      {sortedDays.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-8 text-center text-sm text-gray-400">
          Dit plan heeft nog geen dagen.
        </div>
      ) : (
        <div className="grid grid-flow-col auto-cols-[minmax(16rem,1fr)] gap-3 overflow-x-auto pb-4 snap-x snap-mandatory xl:grid-flow-row xl:auto-cols-auto xl:grid-cols-7 xl:overflow-visible">
          {sortedDays.map((day) => {
            const dayLabel = DAY_NAMES[(day.day_number - 1) % 7];
            const allMealRecipes = day.meals.flatMap((m) => m.meal_recipes);
            const totals = allMealRecipes.reduce(
              (acc, mr) => {
                const r = mr.recipes as Recipe | null;
                return {
                  calories: acc.calories + (r?.calories ?? 0) * mr.servings,
                  protein_g: acc.protein_g + (r?.protein_g ?? 0) * mr.servings,
                  carbs_g: acc.carbs_g + (r?.carbs_g ?? 0) * mr.servings,
                  fat_g: acc.fat_g + (r?.fat_g ?? 0) * mr.servings,
                };
              },
              { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }
            );
            const calorieProgress = client.calories_goal
              ? Math.min((totals.calories / client.calories_goal) * 100, 100)
              : null;

            return (
              <div key={day.id} className="flex min-w-[16rem] snap-start flex-col gap-2 xl:min-w-0">
                {/* Dag header */}
                <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
                  <p className="font-semibold text-gray-900 text-sm">{dayLabel}</p>
                  {day.date && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(day.date).toLocaleDateString("nl-BE", { day: "numeric", month: "short" })}
                    </p>
                  )}
                </div>

                {/* Maaltijden */}
                {MEAL_TYPES.map((mealType) => {
                  const meal = day.meals.find((m) => m.meal_type === mealType);
                  const mealRecipes = meal?.meal_recipes ?? [];

                  return (
                    <div key={mealType} className="bg-white rounded-xl border border-gray-100 p-2.5 min-h-[80px]">
                      <div className="mb-2">
                        <span className={`text-xs font-semibold ${MEAL_COLORS[mealType]}`}>
                          {MEAL_TYPE_LABELS[mealType]}
                        </span>
                      </div>

                      {mealRecipes.length > 0 ? (
                        <div className="space-y-1.5">
                          {mealRecipes.map((mr) => {
                            const recipe = mr.recipes as Recipe | null;
                            if (!recipe) return null;
                            return (
                              <Link
                                href={`/client/recipes/${recipe.id}`}
                                key={mr.id}
                                className="flex items-start gap-1 bg-gray-50 rounded-lg p-1.5"
                              >
                                <div className="flex-1 min-w-0">
                                  <h2
                                    
                                    className="text-xs font-medium text-gray-700 hover:text-green-600 truncate leading-tight transition-colors"
                                  >
                                    {recipe.name.length > 20 ? recipe.name.slice(0, 17) + "..." : recipe.name}
                                  </h2>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    {mr.servings !== 1 && <span className="text-xs text-gray-400">×{mr.servings}</span>}
                                    {recipe.calories && (
                                      <span className="text-xs text-orange-500">{Math.round(recipe.calories * mr.servings)} kcal</span>
                                    )}
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-300 text-center py-2">—</p>
                      )}
                    </div>
                  );
                })}

                {/* Totalen */}
                <div className="bg-white rounded-xl border border-gray-100 p-3 space-y-2">
                  <p className="text-xs font-medium text-gray-400 text-center">Totaal</p>

                  {calorieProgress !== null && (
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">{Math.round(totals.calories)} kcal</span>
                        <span className="text-gray-400">{client.calories_goal}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${
                            calorieProgress >= 90
                              ? "bg-green-500"
                              : calorieProgress >= 60
                              ? "bg-yellow-400"
                              : "bg-red-400"
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
          })}
        </div>
      )}
    </div>
  );
}
