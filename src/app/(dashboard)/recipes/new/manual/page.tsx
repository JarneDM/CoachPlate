import RecipeForm from "@/components/recipes/RecipeForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ManualRecipePage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link
          href="/dashboard/recipes/new"
          className="flex items-center gap-1.5 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft size={14} />
          Terug
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">Manueel invoeren</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manueel recept</h1>
        <p className="text-gray-400 text-sm mt-1">
          Zoek ingrediënten op via Open Food Facts en voer macro{"'"}s in.
        </p>
      </div>

      <RecipeForm />
    </div>
  );
}
