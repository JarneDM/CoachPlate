import Link from "next/link";
import { createClientAction } from "./actions";
import type { AddClientPageProps } from "@/types";

async function AddClientPage({ searchParams }: AddClientPageProps) {
  const params = await searchParams;
  const errorMessage = params?.error;

  return (
    <div className="max-w-4xl mx-auto text-black">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/clients" className="hover:text-gray-600 transition-colors">
          Klanten
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">Nieuwe klant</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900">Nieuwe klant toevoegen</h1>
        <p className="text-sm text-gray-500 mt-1 mb-6">Vul de basisgegevens in. Extra velden kun je nu of later aanvullen.</p>

        {errorMessage && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{errorMessage}</div>}

        <form action={createClientAction} className="space-y-8">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">Basisgegevens</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Volledige naam *</label>
                <input
                  name="full_name"
                  required
                  placeholder="Bijv. Emma Janssens"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input
                  name="email"
                  type="email"
                  placeholder="emma@email.com"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Geboortedatum</label>
                <input
                  name="birth_date"
                  type="date"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Geslacht</label>
                <select
                  name="gender"
                  defaultValue=""
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Kies...</option>
                  <option value="FEMALE">Vrouw</option>
                  <option value="MALE">Man</option>
                  <option value="OTHER">Anders</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doel</label>
                <input
                  name="goal"
                  placeholder="Bijv. Vetverlies"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">Lichaamswaarden</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gewicht (kg)</label>
                <input
                  name="weight_kg"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="72.5"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lengte (cm)</label>
                <input
                  name="height_cm"
                  type="number"
                  step="1"
                  min="0"
                  placeholder="178"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">Macrodoelen</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Calorieen (kcal)</label>
                <input
                  name="calories_goal"
                  type="number"
                  step="1"
                  min="0"
                  placeholder="2200"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proteine (g)</label>
                <input
                  name="protein_goal"
                  type="number"
                  step="1"
                  min="0"
                  placeholder="150"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Koolhydraten (g)</label>
                <input
                  name="carbs_goal"
                  type="number"
                  step="1"
                  min="0"
                  placeholder="220"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vetten (g)</label>
                <input
                  name="fat_goal"
                  type="number"
                  step="1"
                  min="0"
                  placeholder="70"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">Voeding & notities</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Allergieen (komma gescheiden)</label>
                <input
                  name="allergies"
                  placeholder="Gluten, Lactose"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Voorkeuren</label>
                <textarea
                  name="preferences"
                  rows={3}
                  placeholder="Bijv. vegetarisch, snelle maaltijden"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notities</label>
                <textarea
                  name="notes"
                  rows={4}
                  placeholder="Extra context over leefstijl, training, medische info..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </section>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/clients"
              className="inline-flex items-center rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Annuleren
            </Link>
            <button
              type="submit"
              className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700"
            >
              Klant opslaan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddClientPage;
