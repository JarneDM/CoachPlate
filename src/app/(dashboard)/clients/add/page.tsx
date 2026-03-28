"use client";

import Link from "next/link";
import { createClientAction } from "./actions";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import Button from "@/components/CTA/Button";

type Inputs = {
  full_name: string;
  email?: string;
  birth_date?: string;
  gender: string;
  goal?: string;
  weight_kg?: number;
  height_cm?: number;
  active?: string;
  calories_goal?: number;
  protein_goal?: number;
  carbs_goal?: number;
  fat_goal?: number;
  allergies?: string;
  preferences?: string;
  notes?: string;
};

function AddClientPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const [page, setPage] = useState(1);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    setPage(1);
    await createClientAction(formData);
  };

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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {page === 1 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">Basisgegevens</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Volledige naam *</label>
                  <input
                    {...register("full_name", { required: true })}
                    required
                    placeholder="Bijv. Emma Janssens"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="emma@email.com"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Geboortedatum</label>
                  <input
                    {...register("birth_date")}
                    type="date"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Geslacht</label>
                  <select
                    {...register("gender")}
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
                    {...register("goal")}
                    placeholder="Bijv. Vetverlies"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <Button label="Volgende" action={() => setPage(page + 1)} width="w-[40%] justify-center items-center mx-auto mt-4" />
            </section>
          )}

          {page === 2 && (
            <div>
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">Lichaamswaarden</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gewicht (kg)</label>
                    <input
                      {...register("weight_kg", { valueAsNumber: true })}
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
                      {...register("height_cm", { valueAsNumber: true })}
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
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">Activiteit</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Activiteitsniveau</label>
                  <select
                    {...register("active")}
                    defaultValue=""
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Kies...</option>
                    <option value="SEDENTARY">Weinig tot geen beweging</option>
                    <option value="LIGHT">Licht actief (1-3 dagen per week)</option>
                    <option value="MODERATE">Matig actief (3-5 dagen per week)</option>
                    <option value="ACTIVE">Actief (6-7 dagen per week)</option>
                    <option value="VERY_ACTIVE">Zeer actief (dagelijks intensief)</option>
                  </select>
                </div>
              </section>
              <Button label="Volgende" action={() => setPage(page + 1)} width="w-[40%] justify-center items-center mx-auto mt-4" />
            </div>
          )}

          {page === 3 && (
            <div>
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">Macrodoelen</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Calorieen (kcal)</label>
                    <input
                      {...register("calories_goal", { valueAsNumber: true })}
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
                      {...register("protein_goal", { valueAsNumber: true })}
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
                      {...register("carbs_goal", { valueAsNumber: true })}
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
                      {...register("fat_goal", { valueAsNumber: true })}
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
                      {...register("allergies")}
                      placeholder="Gluten, Lactose"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Voorkeuren</label>
                    <textarea
                      {...register("preferences")}
                      rows={3}
                      placeholder="Bijv. vegetarisch, snelle maaltijden"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notities</label>
                    <textarea
                      {...register("notes")}
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
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default AddClientPage;
