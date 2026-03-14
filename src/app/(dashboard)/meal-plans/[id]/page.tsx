import { getMealPlanById } from "@/app/services/coaches/mealplans/meal-plans";
import { getRecipes } from "@/app/services/recipes/recipes";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import WeekBuilder from "@/components/meal-plans/WeekBuilder";

export default async function MealPlanBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [plan, recipes] = await Promise.all([getMealPlanById(id), getRecipes()]);

  if (!plan) notFound();

  const sortedDays = [...(plan.meal_plan_days ?? [])].sort((a, b) => a.day_number - b.day_number);

  return (
    <div className="max-w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/meal-plans" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft size={14} />
            Weekplannen
          </Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-lg font-bold text-gray-900">{plan.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">👤 {plan.clients?.full_name}</span>
          {plan.start_date && (
            <span className="text-sm text-gray-400">
              ·{" "}
              {new Date(plan.start_date).toLocaleDateString("nl-BE", {
                day: "numeric",
                month: "short",
              })}
              {plan.end_date &&
                ` → ${new Date(plan.end_date).toLocaleDateString("nl-BE", {
                  day: "numeric",
                  month: "short",
                })}`}
            </span>
          )}
        </div>
      </div>

      <WeekBuilder plan={plan} days={sortedDays} recipes={recipes} client={plan.clients} />
    </div>
  );
}
