import { getTrainingPlanById } from "@/app/services/training-plans/training-plans";
import { getExercises } from "@/app/services/training-plans/exercises";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileDown, User } from "lucide-react";
import TrainingPlanBuilder from "@/components/training-plans/TrainingPlanBuilder";

export default async function TrainingPlanBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [plan, exercises] = await Promise.all([getTrainingPlanById(id), getExercises()]);

  if (!plan) notFound();

  const sortedDays = [...(plan.training_plan_days ?? [])].sort((a, b) => a.day_number - b.day_number);

  return (
    <div className="max-w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/training-plans" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft size={14} />
            Schema{"'"}s
          </Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-lg font-bold text-gray-900">{plan.name}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/api/export-pdf/training-plan/${plan.id}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm text-green-700 bg-green-50 hover:bg-green-100 border border-green-100 rounded-lg px-3 py-2 transition-colors"
          >
            <FileDown size={14} />
            PDF
          </Link>
          {plan.clients && (
            <span className="flex items-center gap-1.5 text-sm text-gray-400">
              <User size={13} />
              {plan.clients.full_name}
            </span>
          )}
        </div>
      </div>

      <TrainingPlanBuilder plan={plan} days={sortedDays} exercises={exercises} />
    </div>
  );
}
