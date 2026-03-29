import { getTrainingPlans } from "@/app/services/training-plans/training-plans";
import Link from "next/link";
import { Dumbbell, Plus, User, CalendarDays, ArrowRight, Layers, FileDown } from "lucide-react";
import DeleteTrainingPlanButton from "@/components/training-plans/DeleteTrainingPlanButton";

export default async function TrainingPlansPage() {
  const plans = await getTrainingPlans();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trainingsschema{"'"}s</h1>
          <p className="text-gray-400 text-sm mt-1">
            {plans.length} {plans.length === 1 ? "schema" : "schema's"} aangemaakt
          </p>
        </div>
        <Link
          href="/training-plans/new"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={14} />
          Nieuw schema
        </Link>
      </div>

      {plans.length > 0 ? (
        <div className="flex flex-col gap-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="group bg-white rounded-xl border border-gray-100 p-5 hover:border-green-200 hover:shadow-sm transition-all flex items-center justify-between"
            >
              <Link href={`/training-plans/${plan.id}`} className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 bg-green-50 group-hover:bg-green-100 rounded-xl flex items-center justify-center transition-colors shrink-0">
                  <Dumbbell size={20} className="text-green-600" />
                </div>

                <div className="min-w-0">
                  <h2 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors truncate">{plan.name}</h2>
                  <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                    {plan.clients && (
                      <span className="flex items-center gap-1.5 text-sm text-gray-400">
                        <User size={12} />
                        {plan.clients.full_name}
                      </span>
                    )}
                    {plan.training_plan_days?.length > 0 && (
                      <span className="flex items-center gap-1.5 text-sm text-gray-400">
                        <Layers size={12} />
                        {plan.training_plan_days.length} {plan.training_plan_days.length === 1 ? "dag" : "dagen"}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 text-sm text-gray-400">
                      <CalendarDays size={12} />
                      {new Date(plan.created_at).toLocaleDateString("nl-BE", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </Link>

              <div className="flex items-center gap-2 ml-4 shrink-0">
                <Link
                  href={`/api/export-pdf/training-plan/${plan.id}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-sm text-green-700 bg-green-50 hover:bg-green-100 border border-green-100 rounded-lg px-3 py-2 transition-colors"
                >
                  <FileDown size={14} />
                  PDF
                </Link>
                <Link
                  href={`/training-plans/${plan.id}/edit`}
                  className="text-sm text-gray-400 hover:text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Bewerken
                </Link>
                <Link
                  href={`/training-plans/${plan.id}`}
                  className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Openen
                  <ArrowRight size={14} />
                </Link>
                <DeleteTrainingPlanButton id={plan.id} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-xl border border-gray-100">
          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Dumbbell size={28} className="text-green-500" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Nog geen trainingsschema{"'"}s</h3>
          <p className="text-gray-400 text-sm mb-6">Maak je eerste schema aan voor een klant.</p>
          <Link
            href="/training-plans/new"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            <Plus size={14} />
            Eerste schema aanmaken
          </Link>
        </div>
      )}
    </div>
  );
}
