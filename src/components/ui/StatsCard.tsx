import Link from "next/link";
export function StatCard({
  label,
  value,
  icon,
  href,
  capitalize = false,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  href: string;
  capitalize?: boolean;
}) {
  return (
    <Link href={href}>
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex rounded-xl bg-green-50 p-2 text-green-700">{icon}</span>
        </div>
        <p className={`text-2xl font-bold text-gray-900 ${capitalize ? "capitalize" : ""}`}>{value}</p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
      </div>
    </Link>
  );
}
