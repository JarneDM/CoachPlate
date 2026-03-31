import NavBar from "@/components/landing/NavBar";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "€19",
    period: "/month",
    description: "For solo coaches getting started with digital planning.",
    features: [
      "Up to 20 active clients",
      "Meal plan builder",
      "Recipe library",
      // "Basic progress tracking",
    ],
    cta: "Start Starter",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "€49",
    period: "/month",
    description: "For growing coaching businesses that need speed and scale.",
    features: [
      "Unlimited active clients",
      "AI meal + training plan generation",
      "Priority PDF exports",
      // "Client analytics dashboard",
    ],
    cta: "Start Pro",
    highlighted: true,
  },
  {
    name: "Team",
    price: "Custom",
    period: "",
    description: "For multi-coach teams with shared workflows and support.",
    features: [
      "Multi-coach workspace",
      "Role-based permissions",
      "Team reporting",
      "Dedicated onboarding",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default async function PricingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const primaryCtaHref = user ? "/settings#pricing" : "/register";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_5%,#cffafe_0%,#ecfeff_25%,#f8fafc_50%,#ffffff_70%)]">
      <NavBar user={user} />

      <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-14 sm:px-6 md:pt-20">
        <section className="mx-auto max-w-3xl text-center">
          <p className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-800">
            Simple Pricing
          </p>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Pick a plan that fits your coaching flow.
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Every plan includes the core CoachPlate workflow: meal planning, client management, and export-ready coaching docs.
          </p>
        </section>

        <section className="mt-12 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={[
                "rounded-3xl border p-6 shadow-sm transition duration-200 hover:-translate-y-1",
                plan.highlighted
                  ? "border-cyan-300 bg-white shadow-cyan-100"
                  : "border-slate-200 bg-white/90 backdrop-blur",
              ].join(" ")}
            >
              {plan.highlighted ? (
                <p className="mb-4 inline-flex rounded-full bg-linear-to-r from-cyan-600 to-emerald-600 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">
                  Most Popular
                </p>
              ) : null}

              <h2 className="text-xl font-bold text-slate-900">{plan.name}</h2>
              <p className="mt-2 text-sm text-slate-600">{plan.description}</p>

              <div className="mt-5 flex items-end gap-1">
                <span className="text-4xl font-black tracking-tight text-slate-900">{plan.price}</span>
                {plan.period ? <span className="pb-1 text-sm text-slate-500">{plan.period}</span> : null}
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-7">
                <Link
                  href={plan.name === "Team" ? "/services/coaches" : primaryCtaHref}
                  className={[
                    "inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition",
                    plan.highlighted
                      ? "bg-linear-to-r from-cyan-600 to-emerald-600 text-white hover:from-cyan-700 hover:to-emerald-700"
                      : "bg-slate-900 text-white hover:bg-slate-700",
                  ].join(" ")}
                >
                  {plan.cta}
                </Link>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-14 rounded-3xl border border-slate-200 bg-white/90 p-6 text-center shadow-sm">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Need a custom setup?</h2>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            We can tailor onboarding, imports, and coaching workflows for your practice.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href={primaryCtaHref}
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              {user ? "Go to Dashboard" : "Create Account"}
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Log in
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
