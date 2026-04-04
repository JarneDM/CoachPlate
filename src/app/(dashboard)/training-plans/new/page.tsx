import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Sparkles, PenLine } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { canGenerateTrainingPlan } from "@/lib/supabase/subscriptionHelpers";

export default async function NewTrainingPlanPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const canUseAiTrainingPlan = await canGenerateTrainingPlan(user.id);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/training-plans" className="flex items-center gap-1.5 hover:text-gray-600 transition-colors">
          <ArrowLeft size={14} />
          Trainingsschema{"'"}s
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">Nieuw schema</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Nieuw trainingsschema</h1>
        <p className="text-gray-400 text-sm mt-1">Kies hoe je het schema wil aanmaken.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {canUseAiTrainingPlan ? (
          <Link
            href="/training-plans/new/ai"
            className="group bg-white rounded-xl border border-gray-100 hover:border-green-300 hover:shadow-sm p-6 transition-all flex flex-col items-center text-center gap-3"
          >
            <div className="w-14 h-14 bg-green-50 group-hover:bg-green-100 rounded-2xl flex items-center justify-center transition-colors">
              <Sparkles size={24} className="text-green-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Genereren met AI</h2>
              <p className="text-xs text-gray-400 mt-1">AI maakt automatisch een schema op basis van klantdoelen</p>
            </div>
            <span className="bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">Aanbevolen</span>
          </Link>
        ) : (
          <div className="group bg-white rounded-xl border border-gray-100 p-6 transition-all flex flex-col items-center text-center gap-3 opacity-70 cursor-not-allowed">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center">
              <Sparkles size={24} className="text-green-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Genereren met AI</h2>
              <p className="text-xs text-gray-400 mt-1">Beschikbaar vanaf een geldig plan voor AI trainingsschema’s.</p>
            </div>
            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">Niet beschikbaar</span>
          </div>
        )}

        <Link
          href="/training-plans/new/manual"
          className="group bg-white rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-sm p-6 transition-all flex flex-col items-center text-center gap-3"
        >
          <div className="w-14 h-14 bg-gray-50 group-hover:bg-gray-100 rounded-2xl flex items-center justify-center transition-colors">
            <PenLine size={24} className="text-gray-500" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Manueel aanmaken</h2>
            <p className="text-xs text-gray-400 mt-1">Zelf oefeningen kiezen en toevoegen per dag</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
