import JoinForm from "@/components/join/JoinForm";
import Link from "next/link";

export const metadata = {
  title: "Lid worden | CoachPlate",
};

export default async function JoinPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const { code } = await searchParams;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600">
            <Link href="/">CoachPlate</Link>
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Maak een account aan en bekijk je plannen</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <JoinForm initialCode={code ?? ""} />
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Ben je een coach?{" "}
          <Link href="/register" className="text-green-600 hover:underline">
            Registreer hier
          </Link>
        </p>
      </div>
    </div>
  );
}
