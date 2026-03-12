export function MacroBadge({ label, value, color }: { label: string; value: number | null; color: "orange" | "blue" | "yellow" | "red" }) {
  const colors = {
    orange: "bg-orange-50 text-orange-600",
    blue: "bg-blue-50 text-blue-600",
    yellow: "bg-yellow-50 text-yellow-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className={`${colors[color]} rounded-lg p-2 text-center`}>
      <p className="text-sm font-bold">{value ?? "—"}</p>
      <p className="text-xs opacity-70">{label}</p>
    </div>
  );
}
