import Link from "next/link";
import { Sparkles, PenLine } from "lucide-react";

export default function NewRecipePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Nieuw weekmenu</h1>
        <p className="text-gray-400 text-sm mt-1">Kies hoe je je weekmenu wil aanmaken.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/meal-plans/new/ai"
          className="group bg-white rounded-xl border border-gray-100 hover:border-green-300 hover:shadow-sm p-6 transition-all flex flex-col items-center text-center gap-3"
        >
          <div className="w-14 h-14 bg-green-50 group-hover:bg-green-100 rounded-2xl flex items-center justify-center transition-colors">
            <Sparkles size={24} className="text-green-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Genereren met AI</h2>
            <p className="text-xs text-gray-400 mt-1">Beschrijf wat je wil en AI maakt de weekmenu aan.</p>
          </div>
          <span className="bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">Aanbevolen</span>
        </Link>

        <Link
          href="/meal-plans/new/manual"
          className="group bg-white rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-sm p-6 transition-all flex flex-col items-center text-center gap-3"
        >
          <div className="w-14 h-14 bg-gray-50 group-hover:bg-gray-100 rounded-2xl flex items-center justify-center transition-colors">
            <PenLine size={24} className="text-gray-500" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Manueel invoeren</h2>
            <p className="text-xs text-gray-400 mt-1">Maak je weekmenu handmatig aan.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
