import AIRecipeGenerator from "@/components/recipes/AIRecipeGenerator";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AIRecipePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/recipes/new" className="flex items-center gap-1.5 hover:text-gray-600 transition-colors">
          <ArrowLeft size={14} />
          Terug
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">AI recept generator</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">AI recept generator</h1>
        <p className="text-gray-400 text-sm mt-1">Beschrijf wat je wil en AI genereert een volledig recept met macro{"'"}s.</p>
      </div>

      <AIRecipeGenerator />
    </div>
  );
}
