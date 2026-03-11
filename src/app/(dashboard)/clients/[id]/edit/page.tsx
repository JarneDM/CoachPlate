import Link from "next/link";
import { notFound } from "next/navigation";
import type { Client } from "@/types";
import { getClientById } from "@/app/services/clients/clients";
import { updateClientAction } from "@/app/(dashboard)/clients/[id]/edit/actions";
import type { EditClientPageProps } from "@/types";
import { formatDateForInput, valueOrEmpty } from "@/app/services/input/input";

async function EditClientPage({ params, searchParams }: EditClientPageProps) {
  const { id } = await params;
  const query = await searchParams;

  let client: Client | null = null;

  try {
    client = await getClientById(id);
  } catch {
    notFound();
  }

  if (!client) notFound();

  return (
    <div className="max-w-4xl mx-auto text-black">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/clients" className="hover:text-gray-600 transition-colors">
          Klanten
        </Link>
        <span>/</span>
        <Link href={`/clients/${id}`} className="hover:text-gray-600 transition-colors">
          {client.full_name}
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">Bewerken</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900">Klant bewerken</h1>
        <p className="text-sm text-gray-500 mt-1 mb-6">Werk de gegevens van je klant bij en sla je wijzigingen op.</p>

        {query?.error && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{query.error}</div>}

        <form action={updateClientAction} className="space-y-8">
          <input type="hidden" name="id" value={id} />

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">Basisgegevens</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Volledige naam *</label>
                <input
                  name="full_name"
                  required
                  defaultValue={valueOrEmpty(client.full_name)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input
                  name="email"
                  type="email"
                  defaultValue={valueOrEmpty(client.email)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Geboortedatum</label>
                <input
                  name="birth_date"
                  type="date"
                  defaultValue={formatDateForInput(client.birth_date)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Geslacht</label>
                <select
                  name="gender"
                  defaultValue={valueOrEmpty(client.gender)}
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
                  defaultValue={valueOrEmpty(client.goal)}
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
                  defaultValue={valueOrEmpty(client.weight_kg)}
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
                  defaultValue={valueOrEmpty(client.height_cm)}
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
                  defaultValue={valueOrEmpty(client.calories_goal)}
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
                  defaultValue={valueOrEmpty(client.protein_goal)}
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
                  defaultValue={valueOrEmpty(client.carbs_goal)}
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
                  defaultValue={valueOrEmpty(client.fat_goal)}
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
                  defaultValue={client.allergies?.join(", ") ?? ""}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Voorkeuren</label>
                <textarea
                  name="preferences"
                  rows={3}
                  defaultValue={valueOrEmpty(client.preferences)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notities</label>
                <textarea
                  name="notes"
                  rows={4}
                  defaultValue={valueOrEmpty(client.notes)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </section>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href={`/clients/${id}`}
              className="inline-flex items-center rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Annuleren
            </Link>
            <button
              type="submit"
              className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700"
            >
              Wijzigingen opslaan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditClientPage;
