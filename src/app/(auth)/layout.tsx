import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_15%_10%,#dcfce7_0%,#f0fdf4_30%,#f8fafc_55%,#ffffff_75%)] px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-green-300/30 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-green-200/40 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.7)_0%,rgba(255,255,255,0)_55%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/">
            <p className="mb-3 inline-flex rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold tracking-wide text-green-800">
              CoachPlate
            </p>
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Werk slimmer als coach</h1>
          <p className="mt-2 text-sm text-slate-600">Plan voeding en training in minuten, niet in uren.</p>
        </div>

        <div className="rounded-3xl border border-green-100 bg-white/90 p-6 shadow-xl shadow-green-100/70 backdrop-blur-md sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
