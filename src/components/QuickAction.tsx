import Link from "next/link";

export function QuickAction({ href, icon, title, description }: { href: string; icon: React.ReactNode; title: string; description: string }) {
  return (
    <Link href={href}>
      <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 hover:border-green-200 transition-colors">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
      </div>
    </Link>
  );
}

export function ActionButton({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-colors text-sm text-gray-700 hover:text-green-700"
    >
      <span>{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}
