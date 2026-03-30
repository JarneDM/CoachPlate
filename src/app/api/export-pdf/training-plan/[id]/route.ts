import React from "react";
import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { getTrainingPlanById } from "@/app/services/training-plans/training-plans";
import TrainingPlanPdfDocument from "@/components/pdf/TrainingPlanPdfDocument";
import { createClient } from "@/lib/supabase/server";
import { canExportPdf } from "@/lib/supabase/subscriptionHelpers";

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
  // Check authentication
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Niet geauthenticeerd" }, { status: 401 });
  }

  // Check PDF export permission
  const canExport = await canExportPdf(user.id);
  if (!canExport) {
    return NextResponse.json({ error: "PDF export is alleen beschikbaar bij het Starter plan of hoger" }, { status: 403 });
  }

  const { id } = await params;
  const plan = await getTrainingPlanById(id);

  if (!plan) {
    return NextResponse.json({ error: "Trainingsschema niet gevonden" }, { status: 404 });
  }

  // Verify ownership
  if (plan.coach_id !== user.id) {
    return NextResponse.json({ error: "Geen toegang tot dit plan" }, { status: 403 });
  }

  const sortedDays = [...(plan.training_plan_days ?? [])].sort((a, b) => a.day_number - b.day_number);
  const document = React.createElement(TrainingPlanPdfDocument, { plan, days: sortedDays }) as Parameters<typeof renderToBuffer>[0];
  const pdfBuffer = await renderToBuffer(document);

  const planName = sanitizeFileName(plan.name || "trainingsschema");
  const fileName = `${planName}.pdf`;

  return new NextResponse(pdfBuffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}