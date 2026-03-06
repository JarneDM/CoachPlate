export function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <span>{icon}</span>
        <h2 className="font-semibold text-gray-900 text-sm">{title}</h2>
      </div>
      {children}
    </div>
  );
}