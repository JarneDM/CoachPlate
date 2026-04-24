import NavBar from "@/components/landing/NavBar";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const comparisonRows = [
  {
    feature: "Klanten",
    gratis: "Tot 5",
    starter: "Tot 20",
    pro: "Onbeperkt",
    team: "Onbeperkt + teampool",
  },
  {
    feature: "Maaltijdschema-bouwer",
    gratis: "✓",
    starter: "✓",
    pro: "✓",
    team: "✓",
  },
  {
    feature: "Trainingsschema-bouwer",
    gratis: "✓",
    starter: "✓",
    pro: "✓",
    team: "✓",
  },
  // {
  //   feature: "Deelbare links",
  //   gratis: "✓",
  //   starter: "✓",
  //   pro: "✓",
  //   team: "✓",
  // },
  {
    feature: "AI recepten generatie",
    gratis: "5 per maand",
    starter: "15 per maand",
    pro: "Onbeperkt",
    team: "Onbeperkt",
  },
  {
    feature: "AI maaltijdplan generatie",
    gratis: "—",
    starter: "5 per maand",
    pro: "Onbeperkt",
    team: "Onbeperkt",
  },
  {
    feature: "AI trainingsschema generatie",
    gratis: "—",
    starter: "5 per maand",
    pro: "Onbeperkt",
    team: "Onbeperkt",
  },
  {
    feature: "PDF export",
    gratis: "—",
    starter: "✓",
    pro: "✓ + eigen logo",
    team: "✓ + eigen branding",
  },
  {
    feature: "Meerdere coaches",
    gratis: "—",
    starter: "—",
    pro: "—",
    team: "✓",
  },
];
const faqItems = [
  {
    question: "Kan ik op elk moment van pakket wisselen?",
    answer: "Ja. Je kunt altijd upgraden of downgraden en we verrekenen je facturatie automatisch naar rato.",
  },
  {
    question: "Zitten maaltijd- en trainingsmodules in alle pakketten?",
    answer: "Ja. De kernmodules voor planning zitten in elk pakket inbegrepen.",
  },
  {
    question: "Is er een proefperiode?",
    answer: "Ja, nieuwe accounts krijgen 7 dagen gratis toegang tot de Pro-functies. Geen creditcard vereist.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "€11.99",
    period: "/maand",
    description: "Voor solo coaches die starten met digitale planning.",
    features: [
      "Tot 20 actieve clienten",
      "Maaltijdschema-bouwer",
      "Trainingsschema-bouwer",
      "Receptenbibliotheek",
      // "Basic progress tracking",
    ],
    cta: "Start Starter",
    highlighted: false,
    working: true,
  },
  {
    name: "Pro",
    price: "€34.99",
    period: "/maand",
    description: "Voor groeiende coachpraktijken die snelheid en schaal nodig hebben.",
    features: [
      "Onbeperkt actieve clienten",
      "AI-generatie van maaltijd- en trainingsschema",
      "Prioritaire PDF-exports",
      "Inclusief alle Starter-functies",
      // "Client analytics dashboard",
    ],
    cta: "Start Pro",
    highlighted: true,
    working: true,
  },
  {
    name: "Studio",
    price: "Op maat",
    period: "",
    description: "Voor teams met meerdere coaches en gedeelde workflows met ondersteuning.",
    features: ["Werkruimte voor meerdere coaches", "Rolgebaseerde rechten", "Teamrapportages", "Persoonlijke onboarding"],
    cta: "Neem contact op",
    highlighted: false,
    working: false,
  },
];

export default async function PricingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const primaryCtaHref = user ? "/settings#pricing" : "/register";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_5%,#dcfce7_0%,#f0fdf4_25%,#f8fafc_50%,#ffffff_70%)]">
      <NavBar user={user} />

      <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-14 sm:px-6 md:pt-20">
        <section className="mx-auto max-w-3xl text-center">
          <p className="inline-flex rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-green-800">
            Eenvoudige prijzen
          </p>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Kies een pakket dat past bij jouw coachingflow.
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Elk pakket bevat de kernworkflow van CoachPlate: maaltijdplanning, clientbeheer en coachingdocumenten die klaar zijn voor
            export.
          </p>
        </section>

        <section className="mt-8 grid gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4 text-center shadow-sm sm:grid-cols-3 sm:p-5">
          <p className="text-sm font-semibold text-slate-700">Geen opstartkosten</p>
          <p className="text-sm font-semibold text-slate-700">Opzegbaar wanneer je wil</p>
          <p className="text-sm font-semibold text-slate-700">Data gehost in de EU</p>
        </section>

        <section className="mt-12 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={[
                "rounded-3xl border p-6 shadow-sm transition duration-200 hover:-translate-y-1 relative",
                plan.highlighted ? "border-green-300 bg-white shadow-green-100" : "border-slate-200 bg-white/90 backdrop-blur",
              ].join(" ")}
            >
              {plan.highlighted ? (
                <p className=" absolute top-[-11] mb-4 inline-flex rounded-full bg-linear-to-r from-green-600 to-green-500 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">
                  Meest gekozen
                </p>
              ) : null}
              {plan.working === false && (
                <p className="absolute top-[-11] mb-4 inline-flex rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">
                  Binnenkort beschikbaar
                </p>
              )}

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

              <div className="mt-10">
                <Link
                  href={plan.name === "Studio" ? "mailto:info@coachplate.com" : primaryCtaHref}
                  className={[
                    "inline-flex w-[90%] items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition absolute bottom-2 left-1/2 -translate-x-1/2",
                    plan.highlighted
                      ? "bg-linear-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600"
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
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Nood aan een setup op maat?</h2>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            We kunnen onboarding, imports en coachingworkflows afstemmen op jouw praktijk.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {user ? (
              <Link
                href={primaryCtaHref}
                className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                {user ? "Ga naar dashboard" : "Account aanmaken"}
              </Link>
            ) : (
              <Link
                href="/login"
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Inloggen
              </Link>
            )}
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Vergelijking van functies</h2>
          <p className="mt-2 text-sm text-slate-600">Alles wat je nodig hebt om pakketten snel te vergelijken.</p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-170 border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Functie
                  </th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Gratis
                  </th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Starter
                  </th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-green-700">
                    Pro
                  </th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Studio
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.feature}>
                    <td className="border-b border-slate-100 px-4 py-3 text-sm font-medium text-slate-900">{row.feature}</td>
                    <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-700">{row.gratis}</td>
                    <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-700">{row.starter}</td>
                    <td className="border-b border-slate-100 px-4 py-3 text-sm font-semibold text-green-800">{row.pro}</td>
                    <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-700">{row.team}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-14 grid gap-4 md:grid-cols-3">
          {faqItems.map((item) => (
            <article key={item.question} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-bold text-slate-900">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.answer}</p>
            </article>
          ))}
        </section>

        <section className="mt-14 rounded-3xl border border-green-200 bg-green-50/70 p-7 text-center sm:p-10">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Klaar om je wekelijkse coachingwerk te vereenvoudigen?
          </h2>
          <p className="mt-3 text-sm text-slate-700 sm:text-base">
            Maak je account aan, importeer je eerste client en lever vandaag nog je eerste plan op.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href={primaryCtaHref}
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              {user ? "Beheer pakket" : "Start gratis"}
            </Link>
            <Link
              href="/"
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Terug naar home
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
