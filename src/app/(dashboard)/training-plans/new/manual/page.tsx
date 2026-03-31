import { getClients } from "@/app/services/clients/clients";
import NewTrainingPlanForm from "@/components/training-plans/NewTrainingPlanForm";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";

export default async function ManualTrainingPlanPage() {
  const clients = await getClients();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/training-plans/new" className="flex items-center gap-1.5 hover:text-gray-600 transition-colors">
          <ArrowLeft size={14} />
          Terug
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">Manueel aanmaken</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Nieuw trainingsschema</h1>
        <p className="text-gray-400 text-sm mt-1">Geef het schema een naam, kies een klant en voeg trainingsdagen toe.</p>
      </div>

      {clients.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="h-7 w-7 text-gray-500" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Geen klanten gevonden</h3>
          <p className="text-gray-400 text-sm mb-6">Voeg eerst een klant toe voor je een schema aanmaakt.</p>
          <Link
            href="/clients/add"
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            Klant toevoegen
          </Link>
        </div>
      ) : (
        <NewTrainingPlanForm clients={clients} />
      )}
    </div>
  );
}
