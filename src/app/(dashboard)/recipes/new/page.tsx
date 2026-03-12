import RecipeForm from "@/components/recipes/RecipeForm";

export default function NewRecipePage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Nieuw recept</h1>
        <p className="text-gray-400 text-sm mt-1">Zoek ingrediënten op en de macro{"'"}s worden automatisch berekend.</p>
      </div>
      <RecipeForm />
    </div>
  );
}
