import { getClients } from "@/app/services/clients/clients";
import NewMealPlanForm from "@/components/meal-plans/NewMealPlanForm";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";

export default async function NewMealPlanPage() {
  const clients = await getClients();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/meal-plans" className="flex items-center gap-1.5 hover:text-gray-600 transition-colors">
          <ArrowLeft size={14} />
          Weekplannen
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">Nieuw weekplan</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Nieuw weekplan</h1>
        <p className="text-gray-400 text-sm mt-1">Kies een klant en geef het plan een naam. Je voegt recepten toe in de builder.</p>
      </div>

      {clients.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Users className="h-7 w-7 text-gray-500" />
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Geen klanten gevonden</h3>
          <p className="text-gray-400 text-sm mb-6">Voeg eerst een klant toe voor je een weekplan aanmaakt.</p>
          <Link
            href="/dashboard/clients/add"
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            Klant toevoegen
          </Link>
        </div>
      ) : (
        <NewMealPlanForm clients={clients} />
      )}
    </div>
  );
}
