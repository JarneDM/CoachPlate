import Link from "next/link";

export function QuickAction({ href, icon, title, description }: { href: string; icon: React.ReactNode; title: string; description: string }) {
  return (
    <Link href={href}>
      <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md">
        <span className="inline-flex rounded-xl bg-green-50 p-2 text-green-700">{icon}</span>
        <div>
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
      </div>
    </Link>
  );
}

export function ActionButton({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex w-full items-center gap-3 rounded-xl border border-gray-100 px-3 py-2.5 text-sm text-gray-700 transition-all hover:border-green-200 hover:bg-green-50 hover:text-green-700"
    >
      <span className="text-green-700">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}
