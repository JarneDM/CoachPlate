import { getTrainingPlansPaginated } from "@/app/services/training-plans/training-plans";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Dumbbell, Plus, User, CalendarDays, ArrowRight, Layers, FileDown } from "lucide-react";
import DeleteTrainingPlanButton from "@/components/training-plans/DeleteTrainingPlanButton";
import { getClients } from "@/app/services/clients/clients";
import Filter from "@/components/clients/Filter";
import Button from "@/components/CTA/Button";
import { createClient } from "@/lib/supabase/server";
import { canExportPdf } from "@/lib/supabase/subscriptionHelpers";

const PAGE_SIZE = 10;

type SearchParams = {
  page?: string;
  client?: string;
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

export default async function TrainingPlansPage({ searchParams }: { searchParams?: SearchParams | Promise<SearchParams> }) {
  const params = (await Promise.resolve(searchParams)) ?? {};
  const rawPage = Number(params.page);
  const currentPage = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const canUsePdfExport = await canExportPdf(user.id);

  const { data: plans, totalCount } = await getTrainingPlansPaginated(currentPage, PAGE_SIZE, params.client);
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;
  const pageItems = getVisiblePageItems(currentPage, totalPages);

  const getPageHref = (page: number) => (page <= 1 ? "/training-plans" : `/training-plans?page=${page}`);

  const clients = await getClients();

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trainingsschema{"'"}s</h1>
          <p className="text-gray-400 text-sm mt-1">
            {totalCount} {totalCount === 1 ? "schema" : "schema's"} aangemaakt
          </p>
        </div>
        <div className="items-center flex gap-4 justify-end">
          <Filter clients={clients} />
          <Button href="/training-plans/new" label="Nieuw schema" icon={<Plus size={14} />} width="w-40 h-8" />
        </div>
      </div>

      {plans.length > 0 ? (
        <>
          <div className="flex flex-col gap-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="group flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-green-200 hover:shadow-md md:flex-row md:items-center md:justify-between"
              >
                <Link href={`/training-plans/${plan.id}`} className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 group-hover:bg-green-100 rounded-xl flex items-center justify-center transition-colors shrink-0">
                    <Dumbbell size={20} className="text-green-600" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors truncate">{plan.name}</h2>
                    <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                      {plan.clients && (
                        <span className="flex items-center gap-1.5 text-sm text-gray-400">
                          <User size={12} />
                          {plan.clients.full_name}
                        </span>
                      )}
                      {plan.training_plan_days?.length > 0 && (
                        <span className="flex items-center gap-1.5 text-sm text-gray-400">
                          <Layers size={12} />
                          {plan.training_plan_days.length} {plan.training_plan_days.length === 1 ? "dag" : "dagen"}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5 text-sm text-gray-400">
                        <CalendarDays size={12} />
                        {new Date(plan.created_at).toLocaleDateString("nl-BE", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="flex w-full flex-wrap items-center gap-2 md:ml-4 md:w-auto md:shrink-0 md:justify-end">
                  {canUsePdfExport ? (
                    <Link
                      href={`/api/export-pdf/training-plan/${plan.id}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-green-100 bg-green-50 px-3 py-2 text-sm text-green-700 transition-colors hover:bg-green-100"
                    >
                      <FileDown size={14} />
                      PDF
                    </Link>
                  ) : (
                    <div className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-400">
                      <FileDown size={14} />
                      PDF
                    </div>
                  )}
                  <Link
                    href={`/training-plans/${plan.id}`}
                    className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                  >
                    Openen
                    <ArrowRight size={14} />
                  </Link>
                  <DeleteTrainingPlanButton id={plan.id} />
                </div>
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
          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Dumbbell size={28} className="text-green-500" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Nog geen trainingsschema{"'"}s</h3>
          <p className="text-gray-400 text-sm mb-6">Maak je eerste schema aan voor een klant.</p>
          <Link
            href="/training-plans/new"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            <Plus size={14} />
            Eerste schema aanmaken
          </Link>
        </div>
      )}
    </div>
  );
}
