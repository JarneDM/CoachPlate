import { PLAN_LIMITS, type PlanKey } from "@/lib/stripe";
import { createAdminClient } from "./admin";

export interface SubscriptionInfo {
  plan: PlanKey | "free";
  limits: typeof PLAN_LIMITS[keyof typeof PLAN_LIMITS];
}

/**
 * Get the user's subscription info and feature limits
 */
export async function getSubscriptionInfo(coachId: string): Promise<SubscriptionInfo> {
  const supabase = await createAdminClient();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("coach_id", coachId)
    .in("status", ["active", "trialing"])
    .maybeSingle();

  const plan = (subscription?.plan as PlanKey) || "free";
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

  return { plan, limits };
}

/**
 * Check if user can add more clients
 */
export async function canAddClient(coachId: string): Promise<boolean> {
  const { limits } = await getSubscriptionInfo(coachId);

  if (limits.maxClients === Infinity) {
    return true;
  }

  const supabase = await createAdminClient();
  const { count } = await supabase
    .from("clients")
    .select("id", { count: "exact" })
    .eq("coach_id", coachId)
    .eq("deleted_at", null);

  return (count || 0) < limits.maxClients;
}

/**
 * Get monthly AI recipe generation usage and check if within limit
 */
export async function canGenerateRecipe(coachId: string): Promise<{
  canGenerate: boolean;
  used: number;
  limit: number;
}> {
  const { limits } = await getSubscriptionInfo(coachId);

  if (!limits.aiAccess) {
    return { canGenerate: false, used: 0, limit: 0 };
  }

  if (limits.aiRecipeGenerations === Infinity) {
    return { canGenerate: true, used: 0, limit: Infinity };
  }

  // Count AI recipe generation attempts this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const supabase = await createAdminClient();
  const { count } = await supabase
    .from("ai_recipe_generations")
    .select("id", { count: "exact" })
    .eq("coach_id", coachId)
    .gte("created_at", startOfMonth.toISOString());

  const used = count || 0;
  const canGenerate = used < limits.aiRecipeGenerations;

  return { canGenerate, used, limit: limits.aiRecipeGenerations };
}

/**
 * Check if user can generate meal plans with AI
 */
export async function canGenerateMealPlan(coachId: string): Promise<boolean> {
  const { limits } = await getSubscriptionInfo(coachId);
  return limits.aiMealPlanGeneration;
}

/**
 * Check if user can generate training plans with AI
 */
export async function canGenerateTrainingPlan(coachId: string): Promise<boolean> {
  const { limits } = await getSubscriptionInfo(coachId);
  return limits.aiTrainingPlanGeneration;
}

/**
 * Check if user can export PDFs
 */
export async function canExportPdf(coachId: string): Promise<boolean> {
  const { limits } = await getSubscriptionInfo(coachId);
  return limits.pdfExport;
}
