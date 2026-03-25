import { getClientPlans, getClientWorkoutPlans } from "@/app/services/clients/plans/plans";
import { getClientById } from "@/app/services/clients/clients";
import Link from "next/link";
import { CalendarDays, ArrowRight, Plus, Clock } from "lucide-react";
import Button from "@/components/CTA/Button";

type Plan = {
  id: string;
  name: string;
  client_id: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
};

async function ClientPlans({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [plans, client, workoutPlans] = await Promise.all([getClientPlans(id), getClientById(id), getClientWorkoutPlans(id)]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/clients" className="hover:text-gray-600 transition-colors">
          Klanten
        </Link>
        <span>/</span>
        <Link href={`/clients/${id}`} className="hover:text-gray-600 transition-colors">
          {client?.full_name ?? "Klant"}
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">Plannen</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plannen</h1>
          <p className="text-gray-400 text-sm mt-1">
            {plans.length} {plans.length === 1 ? "plan" : "plannen"} voor {client?.full_name ?? "deze klant"}
          </p>
        </div>
        <Button href={`/meal-plans/new?client=${id}`} label="Nieuw weekplan" icon={<Plus size={14} />} />
      </div>

      {plans.length > 0 ? (
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-gray-900">Weekplannen</h2>
          {plans.map((plan: Plan) => (
            <Link
              key={plan.id}
              href={`/meal-plans/${plan.id}`}
              className="group bg-white rounded-xl border border-gray-100 p-5 hover:border-green-200 hover:shadow-sm transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 group-hover:bg-green-100 rounded-xl flex items-center justify-center transition-colors shrink-0">
                  <CalendarDays size={20} className="text-green-600" />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">{plan.name}</h2>
                  <div className="flex items-center gap-4 mt-1.5 flex-wrap">
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
                    <span className="text-xs text-gray-400">
                      Aangemaakt op{" "}
                      {new Date(plan.created_at).toLocaleDateString("nl-BE", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <ArrowRight
                size={16}
                className="text-gray-300 group-hover:text-green-500 group-hover:translate-x-1 transition-all shrink-0"
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-xl border border-gray-100">
          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CalendarDays size={28} className="text-green-500" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Nog geen plannen</h3>
          <p className="text-gray-400 text-sm mb-6">Maak het eerste weekplan aan voor deze klant.</p>
          <div className="items-center justify-center flex">
            <Button
              href={`/meal-plans/new?client=${id}`}
              label="Eerste weekplan aanmaken"
              icon={<Plus size={14} />}
              width="max-w-[300px] w-auto"
            />
          </div>
        </div>
      )}
      {workoutPlans.length > 0 && (
        <div className="flex flex-col gap-3 mt-12">
          <h2 className="text-lg font-semibold text-gray-900">Trainingsplannen</h2>
          {workoutPlans.map((plan: Plan) => (
            <Link
              key={plan.id}
              href={`/training-plans/${plan.id}`}
              className="group bg-white rounded-xl border border-gray-100 p-5 hover:border-green-200 hover:shadow-sm transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 group-hover:bg-green-100 rounded-xl flex items-center justify-center transition-colors shrink-0">
                  <CalendarDays size={20} className="text-green-600" />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">{plan.name}</h2>
                  <div className="flex items-center gap-4 mt-1.5 flex-wrap">
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
                    <span className="text-xs text-gray-400">
                      Aangemaakt op{" "}
                      {new Date(plan.created_at).toLocaleDateString("nl-BE", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <ArrowRight
                size={16}
                className="text-gray-300 group-hover:text-green-500 group-hover:translate-x-1 transition-all shrink-0"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClientPlans;
