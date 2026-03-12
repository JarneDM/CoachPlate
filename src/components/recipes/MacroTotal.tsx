export function MacroTotal({ label, value, unit, color }: {
  label: string;
  value: number;
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
    <div className={`${colors[color]} rounded-lg p-3 text-center`}>
      <p className="text-lg font-bold">{value}{unit}</p>
      <p className="text-xs opacity-70">{label}</p>
    </div>
  );
}