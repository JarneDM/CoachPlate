import NavBar from "@/components/landing/NavBar";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const currentCapabilities = [
  { label: "Meal planning", value: "Available" },
  { label: "Training plans", value: "Available" },
  { label: "Recipe generation", value: "Available" },
  { label: "PDF exports", value: "Available" },
];

const steps = [
  {
    title: "Set Client Goals",
    description: "Capture nutrition targets, training intensity, and schedule constraints in one flow.",
  },
  {
    title: "Generate and Adjust",
    description: "Use AI drafts for meal and training plans, then tailor details to each client profile.",
  },
  {
    title: "Export and Share",
    description: "Export plan documents and share client-ready files quickly.",
  },
];

export default async function RootPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_15%_10%,#ccfbf1_0%,#ecfeff_30%,#f8fafc_55%,#ffffff_75%)]">
      <NavBar user={user} />

      <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-14 sm:px-6 md:pt-20">
        <section className="grid items-start gap-12 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <p className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-800">
              Nutrition + Training Platform
            </p>
            <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              Build world-class coaching plans in half the time.
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              CoachPlate helps you design meal and training plans in minutes and manage clients in one place with a clean, focused workflow.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href={user ? "/dashboard" : "/register"}
                className="rounded-full bg-linear-to-r from-cyan-600 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-200 transition hover:from-cyan-700 hover:to-emerald-700"
              >
                {user ? "Open Dashboard" : "Start for Free"}
              </Link>
              <Link
                href="/pricing"
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50"
              >
                View Pricing
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">At a glance</h2>
            <ul className="mt-6 space-y-4">
              <li className="rounded-2xl border border-cyan-100 bg-cyan-50/80 p-4">
                <p className="text-sm font-semibold text-cyan-900">Meal plans generated in minutes</p>
              </li>
              <li className="rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4">
                <p className="text-sm font-semibold text-emerald-900">Recipe suggestions tuned to client goals</p>
              </li>
              <li className="rounded-2xl border border-amber-100 bg-amber-50/85 p-4">
                <p className="text-sm font-semibold text-amber-900">Quick export of meal plans & training plans</p>
              </li>
            </ul>
          </div>
        </section>

        <section className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {["Personalized meal plans", "Personalized training plans", "Recipe suggestions", "Client-first workflow"].map((feature) => (
            <article
              key={feature}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-md"
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
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">How It Works</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">A fast loop from idea to client-ready plan</h2>
            </div>
            <Link
              href="/pricing"
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50"
            >
              Explore pricing
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <article key={step.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Step {index + 1}</p>
                <h3 className="mt-2 text-lg font-bold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-cyan-200 bg-cyan-50/70 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-800">Current Focus</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">Shipping the fundamentals first</h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">
            We are currently focused on stable plan creation, fast editing, and reliable exports. Progress tracking and deeper analytics are
            planned but not live yet.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-cyan-200 bg-white px-3 py-1 text-xs font-semibold text-cyan-800">
              Core planning live
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              Progress tracking planned
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              Analytics planned
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}
