export function MacroCard({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: number | null | undefined;
  unit: string;
  color: "orange" | "blue" | "yellow" | "red";
}) {
  const colors = {
    orange: "bg-orange-50 text-orange-600",
    blue: "bg-blue-50 text-blue-600",
    yellow: "bg-yellow-50 text-yellow-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className={`${colors[color]} rounded-xl p-4`}>
      <p className="text-2xl font-bold">{value ?? "—"}</p>
      <p className="text-xs font-medium opacity-70 mt-0.5">
        {unit} {label}
      </p>
    </div>
  );
}