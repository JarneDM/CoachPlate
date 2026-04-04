import Link from "next/link";
import { redirect } from "next/navigation";
import { Sparkles, PenLine } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { canGenerateRecipe } from "@/lib/supabase/subscriptionHelpers";

export default async function NewRecipePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { canGenerate } = await canGenerateRecipe(user.id);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Nieuw recept</h1>
        <p className="text-gray-400 text-sm mt-1">Kies hoe je je recept wil aanmaken.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {canGenerate ? (
          <Link
            href="/recipes/new/ai"
            className="group bg-white rounded-xl border border-gray-100 hover:border-green-300 hover:shadow-sm p-6 transition-all flex flex-col items-center text-center gap-3"
          >
            <div className="w-14 h-14 bg-green-50 group-hover:bg-green-100 rounded-2xl flex items-center justify-center transition-colors">
              <Sparkles size={24} className="text-green-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Genereren met AI</h2>
              <p className="text-xs text-gray-400 mt-1">Beschrijf wat je wil en AI maakt het recept aan met macro{"'"}s</p>
            </div>
            <span className="bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">Aanbevolen</span>
          </Link>
        ) : (
          <div className="group bg-white rounded-xl border border-gray-100 p-6 transition-all flex flex-col items-center text-center gap-3 opacity-70 cursor-not-allowed">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center">
              <Sparkles size={24} className="text-green-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Genereren met AI</h2>
              <p className="text-xs text-gray-400 mt-1">Beschikbaar vanaf een geldig plan voor AI recepten.</p>
            </div>
            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">Niet beschikbaar</span>
          </div>
        )}

        <Link
          href="/recipes/new/manual"
          className="group bg-white rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-sm p-6 transition-all flex flex-col items-center text-center gap-3"
        >
          <div className="w-14 h-14 bg-gray-50 group-hover:bg-gray-100 rounded-2xl flex items-center justify-center transition-colors">
            <PenLine size={24} className="text-gray-500" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Manueel invoeren</h2>
            <p className="text-xs text-gray-400 mt-1">Zoek ingrediënten op via Open Food Facts en voer macro{"'"}s in</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
