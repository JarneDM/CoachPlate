import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const PRICE_IDS = {
  starter: process.env.STRIPE_PRICE_STARTER ?? "price_starter_xxx",
  pro: process.env.STRIPE_PRICE_PRO ?? "price_pro_xxx",
  studio: process.env.STRIPE_PRICE_STUDIO ?? "price_studio_xxx",
};

export type PlanKey = keyof typeof PRICE_IDS;

export const PLAN_LIMITS = {
  free: {
    maxClients: 5,
    aiRecipeGenerations: 0,
    aiMealPlanGeneration: false,
    aiTrainingPlanGeneration: false,
    pdfExport: false,
    publicRecipeDatabase: true,
    aiAccess: false,
  },
  starter: {
    maxClients: 10,
    aiRecipeGenerations: 5,
    aiMealPlanGeneration: false,
    aiTrainingPlanGeneration: false,
    pdfExport: true,
    publicRecipeDatabase: true,
    aiAccess: true,
  },
  pro: {
    maxClients: Infinity,
    aiRecipeGenerations: Infinity,
    aiMealPlanGeneration: true,
    aiTrainingPlanGeneration: true,
    pdfExport: true,
    publicRecipeDatabase: true,
    aiAccess: true,
  },
  studio: {
    maxClients: Infinity,
    aiRecipeGenerations: Infinity,
    aiMealPlanGeneration: true,
    aiTrainingPlanGeneration: true,
    pdfExport: true,
    publicRecipeDatabase: true,
    aiAccess: true,
  },
};

export type PlanLimits = (typeof PLAN_LIMITS)["starter"];

export function getPlanFromPriceId(priceId?: string | null): PlanKey {
  if (!priceId) {
    return "starter";
  }

  if (priceId === PRICE_IDS.pro) {
    return "pro";
  }

  if (priceId === PRICE_IDS.studio) {
    return "studio";
  }

  return "starter";
}
