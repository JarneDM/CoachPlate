import { getRecipeById } from "@/app/services/recipes/recipes";
import { notFound } from "next/navigation";
import Link from "next/link";
import RecipeForm from "@/components/recipes/RecipeForm";
import { ArrowLeft } from "lucide-react";

async function EditRecipePage({ params }: { params: { id: string } }) {
  const { id } = await params;

  let recipe = null;

  try {
    recipe = await getRecipeById(id);
  } catch {
    notFound();
  }

  if (!recipe) notFound();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/recipes" className="flex items-center gap-1.5 hover:text-gray-600 transition-colors">
          <ArrowLeft size={14} />
          Recepten
        </Link>
        <span>/</span>
        <Link href={`/recipes/${id}`} className="hover:text-gray-600 transition-colors">
          {recipe.name}
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">Bewerken</span>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Recept bewerken</h1>

      <RecipeForm initialRecipe={recipe} />
    </div>
  );
}

export default EditRecipePage;
