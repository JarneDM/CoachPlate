export function MacroCard({
  icon,
  label,
  value,
  unit,
  colorClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  colorClass: string;
}) {
  return (
    <div className={`${colorClass} rounded-xl p-4`}>
      <div className="flex items-center gap-1.5 mb-2 opacity-70">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold">
        {value}
        <span className="text-sm font-normal ml-1">{unit}</span>
      </p>
    </div>
  );
}
