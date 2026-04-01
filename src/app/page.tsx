import NavBar from "@/components/landing/NavBar";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const currentCapabilities = [
  { label: "Maaltijdschema's", value: "Beschikbaar" },
  { label: "Trainingsschema's", value: "Beschikbaar" },
  { label: "Receptgeneratie", value: "Beschikbaar" },
  { label: "PDF-export", value: "Beschikbaar" },
];

const steps = [
  {
    title: "Bepaal doelen per client",
    description: "Leg voedingsdoelen, trainingsintensiteit en planningsbeperkingen vast in een enkele flow.",
  },
  {
    title: "Genereer en pas aan",
    description: "Gebruik AI-concepten voor maaltijd- en trainingsschema's en verfijn ze per clientprofiel.",
  },
  {
    title: "Exporteer en deel",
    description: "Exporteer plandocumenten en deel snel bestanden die klaar zijn voor je client.",
  },
];

export default async function RootPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_15%_10%,#dcfce7_0%,#f0fdf4_30%,#f8fafc_55%,#ffffff_75%)]">
      <NavBar user={user} />

      <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-14 sm:px-6 md:pt-20">
        <section className="grid items-start gap-12 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <p className="inline-flex rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-green-800">
              Voeding + Trainingsplatform
            </p>
            <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              Maak coachingplannen van topniveau in de helft van de tijd.
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Met CoachPlate maak je in minuten maaltijd- en trainingsschema&apos;s en beheer je al je clienten op een centrale,
              overzichtelijke plek.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href={user ? "/dashboard" : "/register"}
                className="rounded-full bg-linear-to-r from-green-600 to-green-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-200 transition hover:from-green-700 hover:to-green-600"
              >
                {user ? "Open dashboard" : "Start gratis"}
              </Link>
              <Link
                href="/pricing"
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-green-300 hover:bg-green-50"
              >
                Bekijk prijzen
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">In een oogopslag</h2>
            <ul className="mt-6 space-y-4">
              <li className="rounded-2xl border border-green-100 bg-green-50/80 p-4">
                <p className="text-sm font-semibold text-green-900">Maaltijdschema&apos;s in minuten gegenereerd</p>
              </li>
              <li className="rounded-2xl border border-green-100 bg-green-50/80 p-4">
                <p className="text-sm font-semibold text-green-900">Receptsuggesties afgestemd op doelen van je client</p>
              </li>
              <li className="rounded-2xl border border-amber-100 bg-amber-50/85 p-4">
                <p className="text-sm font-semibold text-amber-900">Snelle export van maaltijd- en trainingsschema&apos;s</p>
              </li>
            </ul>
          </div>
        </section>

        <section className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Gepersonaliseerde maaltijdschema's",
            "Gepersonaliseerde trainingsschema's",
            "Receptsuggesties",
            "Workflow met client centraal",
          ].map((feature) => (
            <article
              key={feature}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-md"
            >
              <h3 className="text-sm font-semibold text-slate-900">{feature}</h3>
            </article>
          ))}
        </section>

        <section className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {currentCapabilities.map((item) => (
            <article key={item.label} className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
              <p className="text-2xl font-black tracking-tight text-slate-900">{item.value}</p>
              <p className="mt-1 text-sm text-slate-600">{item.label}</p>
            </article>
          ))}
        </section>

        <section className="mt-14 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-green-700">Hoe het werkt</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Van idee naar plan in een snelle flow</h2>
            </div>
            <Link
              href="/pricing"
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-green-300 hover:bg-green-50"
            >
              Bekijk prijzen
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <article key={step.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Stap {index + 1}</p>
                <h3 className="mt-2 text-lg font-bold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-green-200 bg-green-50/70 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-green-800">Huidige focus</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">Eerst de basis perfect neerzetten</h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">
            We focussen momenteel op stabiele planopbouw, snelle bewerking en betrouwbare exports. Voortgangstracking en diepere analyses
            staan op de planning, maar zijn nog niet live.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-green-200 bg-white px-3 py-1 text-xs font-semibold text-green-800">
              Kernplanning live
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              Voortgangstracking gepland
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              Analysefuncties gepland
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}
