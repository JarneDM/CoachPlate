import { getMealPlans } from "@/app/services/coaches/mealplans/getMealPlans";
import React from "react";
import Link from "next/link";
import { CalendarDays, User, ArrowRight, Plus, Clock, FileDown } from "lucide-react";
import Button from "@/components/CTA/Button";

async function MealPlans() {
  let mealplans: Awaited<ReturnType<typeof getMealPlans>> = [];
  mealplans = await getMealPlans();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Weekplannen</h1>
          <p className="text-gray-400 text-sm mt-1">
            {mealplans.length} {mealplans.length === 1 ? "plan" : "plannen"} aangemaakt
          </p>
        </div>
        <Button href="/meal-plans/new" label="Nieuw weekplan" icon={<Plus size={14} />} />
      </div>

      {mealplans.length > 0 ? (
        <div className="flex flex-col gap-3">
          {mealplans.map((plan) => (
            <div
              key={plan.id}
              className="group bg-white rounded-xl border border-gray-100 p-5 hover:border-green-200 hover:shadow-sm transition-all flex items-center justify-between"
            >
              <Link
                key={plan.id}
                href={`/meal-plans/${plan.id}`}
                className="flex items-center justify-between flex-1 min-w-0 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 group-hover:bg-green-100 rounded-xl flex items-center justify-center transition-colors shrink-0">
                    <CalendarDays size={20} className="text-green-600" />
                  </div>

                  <div>
                    <h2 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">{plan.name}</h2>
                    <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                      <span className="flex items-center gap-1.5 text-sm text-gray-400">
                        <User size={12} />
                        {plan.clients.full_name}
                      </span>
                      {plan.start_date && (
                        <span className="flex items-center gap-1.5 text-sm text-gray-400">
                          <Clock size={12} />
                          {new Date(plan.start_date).toLocaleDateString("nl-BE", {
                            day: "numeric",
                            month: "short",
                          })}
                          {plan.end_date && (
                            <>
                              {" → "}
                              {new Date(plan.end_date).toLocaleDateString("nl-BE", {
                                day: "numeric",
                                month: "short",
                              })}
                            </>
                          )}
                        </span>
                      )}
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          plan.is_active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {plan.is_active ? "Actief" : "Inactief"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
              <Link
                href={`/api/export-pdf/meal-plan/${plan.id}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-sm text-green-700 bg-green-50 hover:bg-green-100 border border-green-100 rounded-lg px-3 py-2 transition-colors shrink-0"
              >
                <FileDown size={14} />
                PDF
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-xl border border-gray-100">
          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CalendarDays size={28} className="text-green-500" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Nog geen weekplannen</h3>
          <p className="text-gray-400 text-sm mb-6">Maak je eerste weekplan aan voor een klant.</p>
          <Link
            href="/meal-plans/new"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            <Plus size={14} />
            Eerste weekplan aanmaken
          </Link>
        </div>
      )}
    </div>
  );
}

export default MealPlans;
