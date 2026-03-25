import React from "react";
import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { getMealPlanById } from "@/app/services/coaches/mealplans/meal-plans";
import MealPlanPdfDocument from "@/components/pdf/MealPlanPdfDocument";

export const runtime = "nodejs";

function sanitizeFileName(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plan = await getMealPlanById(id);

  if (!plan) {
    return NextResponse.json({ error: "Weekplan niet gevonden" }, { status: 404 });
  }

  const sortedDays = [...(plan.meal_plan_days ?? [])].sort((a, b) => a.day_number - b.day_number);
  const document = React.createElement(MealPlanPdfDocument, { plan, days: sortedDays }) as Parameters<typeof renderToBuffer>[0];
  const pdfBuffer = await renderToBuffer(document);

  const planName = sanitizeFileName(plan.name || "weekplan");
  // const clientName = sanitizeFileName(plan.clients?.full_name || "klant");
  const fileName = `${planName}.pdf`;

  return new NextResponse(pdfBuffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
