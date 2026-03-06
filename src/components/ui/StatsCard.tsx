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
      <div className="bg-white rounded-xl border border-gray-100 p-6 hover:border-green-200 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl">{icon}</span>
        </div>
        <p className={`text-2xl font-bold text-gray-900 ${capitalize ? "capitalize" : ""}`}>{value}</p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
      </div>
    </Link>
  );
}
