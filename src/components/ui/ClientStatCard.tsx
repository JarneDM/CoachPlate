export function ClientStatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-3 inline-flex rounded-xl bg-green-50 p-2 text-green-700">{icon}</div>
      <p className="text-xl font-bold tracking-tight text-gray-900">{value}</p>
      <p className="mt-1 text-xs text-gray-500">{label}</p>
    </div>
  );
}
