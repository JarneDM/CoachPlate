export function TextInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void; min?: number }) {
  return (
    <div className="bg-white rounded-lg p-2 border border-gray-100">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={value}
          min={0}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-25 flex-1 text-center text-sm font-semibold text-gray-800 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
    </div>
  );
}