export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600">CoachPlate</h1>
          <p className="text-gray-500 mt-1">Voor voedingscoaches die slim willen werken</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">{children}</div>
      </div>
    </div>
  );
}
