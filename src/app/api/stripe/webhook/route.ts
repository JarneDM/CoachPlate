import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPlanFromPriceId, stripe } from "@/lib/stripe";

function getSubscriptionData(event: Stripe.Event) {
  if (event.type === "customer.subscription.created") {
    return event.data.object;
  }
  if (event.type === "customer.subscription.updated") {
    return event.data.object;
  }
  if (event.type === "customer.subscription.deleted") {
    return event.data.object;
  }
  return null;
}

type SubscriptionPayload = {
  coach_id: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  plan: string;
  status: string;
  current_period_end?: string;
};

async function saveSubscriptionByCoachId(
  supabaseAdmin: ReturnType<typeof createAdminClient>,
  payload: SubscriptionPayload,
) {
  const { data: existing, error: existingError } = await supabaseAdmin
    .from("subscriptions")
    .select("id")
    .eq("coach_id", payload.coach_id)
    .limit(1)
    .maybeSingle();

  if (existingError) {
    console.error("Error checking existing subscription:", existingError);
    return;
  }

  if (existing?.id) {
    const { error: updateError } = await supabaseAdmin
      .from("subscriptions")
      .update(payload)
      .eq("id", existing.id);

    if (updateError) {
      console.error("Error updating subscription:", updateError);
    }

    return;
  }

  const { error: insertError } = await supabaseAdmin.from("subscriptions").insert(payload);

  if (insertError) {
    console.error("Error inserting subscription:", insertError);
  }
}

async function findCoachIdFromStripeData(
  supabaseAdmin: ReturnType<typeof createAdminClient>,
  subscriptionId: string,
  customerId: string,
) {
  const { data: bySubscription } = await supabaseAdmin
    .from("subscriptions")
    .select("coach_id")
    .eq("stripe_subscription_id", subscriptionId)
    .maybeSingle();

  if (bySubscription?.coach_id) {
    return bySubscription.coach_id;
  }

  const { data: byCustomer } = await supabaseAdmin
    .from("subscriptions")
    .select("coach_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  return byCustomer?.coach_id;
}

async function getCurrentPeriodEndIso(subscriptionId: string) {
  try {
    const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
    const periodEnds = stripeSubscription.items.data
      .map((item) => item.current_period_end)
      .filter((value): value is number => typeof value === "number");

    if (periodEnds.length === 0) {
      console.warn("No current_period_end found on Stripe subscription items", {
        subscriptionId,
      });
      return undefined;
    }

    const maxPeriodEnd = Math.max(...periodEnds);
    return new Date(maxPeriodEnd * 1000).toISOString();
  } catch (error) {
    console.error("Could not retrieve Stripe subscription for current_period_end:", error);
    return undefined;
  }
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error("Stripe webhook missing signature or secret");
    return NextResponse.json({ error: "Webhook secret of signature ontbreekt" }, { status: 400 });
  }

  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature error:", error);
    return NextResponse.json({ error: "Ongeldige webhook signature" }, { status: 400 });
  }

  const supabaseAdmin = createAdminClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const coachId = session.metadata?.coach_id;
    const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
    const subscriptionId =
      typeof session.subscription === "string" ? session.subscription : session.subscription?.id;

    if (coachId && customerId && subscriptionId) {
      const currentPeriodEnd = await getCurrentPeriodEndIso(subscriptionId);

      await saveSubscriptionByCoachId(supabaseAdmin, {
        coach_id: coachId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        plan: session.metadata?.plan ?? "starter",
        status: "active",
        current_period_end: currentPeriodEnd,
      });
    } else {
      console.error("checkout.session.completed missing required metadata", {
        coachId,
        customerId,
        subscriptionId,
      });
    }
  }

  const stripeSubscription = getSubscriptionData(event);

  if (stripeSubscription) {
    const customerId =
      typeof stripeSubscription.customer === "string" ? stripeSubscription.customer : stripeSubscription.customer.id;

    const priceId = stripeSubscription.items.data[0]?.price?.id;
    const plan = getPlanFromPriceId(priceId);
    const coachIdFromMetadata = stripeSubscription.metadata?.coach_id;
    const coachIdFromDb = await findCoachIdFromStripeData(supabaseAdmin, stripeSubscription.id, customerId);
    const coachId = coachIdFromMetadata ?? coachIdFromDb;

    if (!coachId) {
      console.error("Could not resolve coach_id for subscription event", {
        eventType: event.type,
        subscriptionId: stripeSubscription.id,
        customerId,
      });
      return NextResponse.json({ received: true });
    }

    const currentPeriodEnd = await getCurrentPeriodEndIso(stripeSubscription.id);

    await saveSubscriptionByCoachId(supabaseAdmin, {
      coach_id: coachId,
      stripe_subscription_id: stripeSubscription.id,
      stripe_customer_id: customerId,
      status: stripeSubscription.status,
      plan,
      current_period_end: currentPeriodEnd,
    });
  }

  return NextResponse.json({ received: true, eventType: event.type });
}
