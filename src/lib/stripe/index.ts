import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const PRICE_IDS = {
  starter: "price_starter_xxx",
  pro: "price_pro_xxx",
  studio: "price_studio_xxx",
};

export const PLAN_LIMITS = {
  starter: { maxClients: 10, aiAccess: false },
  pro: { maxClients: Infinity, aiAccess: true },
  studio: { maxClients: Infinity, aiAccess: true },
};
