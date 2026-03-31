import { getRecipesPaginated } from "@/app/services/recipes/recipes";
import Link from "next/link";
import DeleteRecipeButton from "@/components/recipes/DeleteRecipeButton";
import { Timer, ChefHat, Plus } from "lucide-react";
import { MacroBadge } from "@/components/recipes/MacroBadge";
import Button from "@/components/CTA/Button";

const mealTypeLabels: Record<string, string> = {
  ontbijt: "Ontbijt",
  lunch: "Lunch",
  avondeten: "Avondeten",
  snack: "Snack",
};

const PAGE_SIZE = 12;

type SearchParams = {
  page?: string;
};

function getVisiblePageItems(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: Array<number | "ellipsis"> = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) {
    items.push("ellipsis");
  }

  for (let page = start; page <= end; page += 1) {
    items.push(page);
  }

  if (end < totalPages - 1) {
    items.push("ellipsis");
  }

  items.push(totalPages);
  return items;
}

export default async function RecipesPage({ searchParams }: { searchParams?: SearchParams | Promise<SearchParams> }) {
  const params = (await Promise.resolve(searchParams)) ?? {};
  const rawPage = Number(params.page);
  const currentPage = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;

  const { data: recipes, totalCount } = await getRecipesPaginated(currentPage, PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;
  const pageItems = getVisiblePageItems(currentPage, totalPages);

  const getPageHref = (page: number) => (page <= 1 ? "/recipes" : `/recipes?page=${page}`);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recepten</h1>
          <p className="text-gray-400 text-sm mt-1">
            {totalCount} {totalCount === 1 ? "recept" : "recepten"} in je bibliotheek
          </p>
        </div>
        <Button href="/recipes/new" label="Nieuw recept" icon={<Plus size={14} />} />
      </div>

      {recipes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:border-green-200 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{recipe.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {recipe.meal_type && (
                        <span className="text-xs text-gray-400">{mealTypeLabels[recipe.meal_type] ?? recipe.meal_type}</span>
                      )}
                      {recipe.prep_time_min && (
                        <span className="text-xs text-gray-400 flex gap-1">
                          <Timer className="w-4 h-4" /> {recipe.prep_time_min} min
                        </span>
                      )}
                    </div>
                  </div>
                  <DeleteRecipeButton id={recipe.id} />
                </div>

                {recipe.calories && (
                  <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <MacroBadge label="kcal" value={recipe.calories} color="orange" />
                    <MacroBadge label="eiwit" value={recipe.protein_g} color="blue" />
                    <MacroBadge label="koolh" value={recipe.carbs_g} color="yellow" />
                    <MacroBadge label="vet" value={recipe.fat_g} color="red" />
                  </div>
                )}

                {recipe.description && <p className="text-xs text-gray-400 mb-4 line-clamp-2">{recipe.description}</p>}

                <Link href={`/recipes/${recipe.id}`} className="text-xs text-green-600 font-medium hover:underline">
                  Bekijk recept →
                </Link>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white p-4">
              <Link
                href={getPageHref(currentPage - 1)}
                aria-disabled={!hasPrevious}
                className={`text-sm font-medium ${hasPrevious ? "text-green-600 hover:underline" : "pointer-events-none text-gray-300"}`}
              >
                ← Vorige
              </Link>

              <div className="flex items-center gap-1">
                {pageItems.map((item, index) => {
                  if (item === "ellipsis") {
                    return (
                      <span key={`ellipsis-${index}`} className="px-2 text-sm text-gray-400">
                        ...
                      </span>
                    );
                  }

                  const isActive = item === currentPage;

                  return (
                    <Link
                      key={item}
                      href={getPageHref(item)}
                      aria-current={isActive ? "page" : undefined}
                      className={`inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium transition-colors ${
                        isActive ? "bg-green-600 text-white" : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {item}
                    </Link>
                  );
                })}
              </div>

              <Link
                href={getPageHref(currentPage + 1)}
                aria-disabled={!hasNext}
                className={`text-sm font-medium ${hasNext ? "text-green-600 hover:underline" : "pointer-events-none text-gray-300"}`}
              >
                Volgende →
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-24 bg-white rounded-xl border border-gray-100">
          <div className="text-5xl mb-4 flex justify-center items-center">
            <ChefHat className="w-12 h-12 text-gray-300" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Nog geen recepten</h3>
          <p className="text-gray-400 text-sm mb-6">Maak je eerste recept aan om te gebruiken in weekplannen.</p>
          <div className="items-center justify-center flex">
            <Button href="/recipes/new" label="Eerste recept aanmaken" icon={<Plus size={14} />} width="max-w-[300px] w-auto" />
          </div>
        </div>
      )}
    </div>
  );
}
