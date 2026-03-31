import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PRICE_IDS, type PlanKey, stripe } from "@/lib/stripe";

function isPlanKey(value: string): value is PlanKey {
  return value === "starter" || value === "pro" || value === "studio";
}

function isValidPriceId(value?: string) {
  return Boolean(value && value.startsWith("price_"));
}

const FREE_TRIAL_DAYS = 7;

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const rawPlan = String(formData.get("plan") ?? "").toLowerCase();

  if (!isPlanKey(rawPlan)) {
    return NextResponse.redirect(new URL("/settings?error=Ongeldig%20plan", request.url));
  }

  const priceId = PRICE_IDS[rawPlan];

  if (!isValidPriceId(priceId)) {
    return NextResponse.redirect(new URL("/settings?error=Gebruik%20een%20geldig%20Stripe%20price_id%20(bv.%20price_xxx)", request.url));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { data: existingSubscription } = await supabase
    .from("subscriptions")
    .select("id, stripe_customer_id")
    .eq("coach_id", user.id)
    .maybeSingle();

  const customerEmail = user.email ?? undefined;

  let session;
  const isFirstCheckout = !existingSubscription?.id;

  try {
    if (existingSubscription?.stripe_customer_id) {
      const subscriptions = await stripe.subscriptions.list({
        customer: existingSubscription.stripe_customer_id,
        status: "all",
        limit: 20,
      });

      const activeSubscription = subscriptions.data.find(
        (subscription) => subscription.status !== "canceled" && subscription.status !== "incomplete_expired",
      );

      if (activeSubscription) {
        // Upgrade/downgrade existing subscription instead of creating new checkout
        const subscriptionItem = activeSubscription.items.data[0];
        
        if (!subscriptionItem) {
          console.error("No subscription item found for upgrade/downgrade");
          return NextResponse.redirect(
            new URL("/settings?error=Kon%20abonnement%20niet%20bijwerken", request.url),
            { status: 303 }
          );
        }

        console.log(`Upgrading/downgrading subscription ${activeSubscription.id} to price ${priceId}`);
        
        await stripe.subscriptions.update(activeSubscription.id, {
          items: [
            {
              id: subscriptionItem.id,
              price: priceId,
            },
          ],
          metadata: {
            coach_id: user.id,
            plan: rawPlan,
          },
        });

        // Update the plan in Supabase
        await supabase
          .from("subscriptions")
          .update({ plan: rawPlan })
          .eq("stripe_subscription_id", activeSubscription.id);

        console.log(`Successfully updated subscription to ${rawPlan}`);
        return NextResponse.redirect(
          new URL("/settings?billing=success", request.url),
          { status: 303 }
        );
      }
    }

    session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: existingSubscription?.stripe_customer_id ?? undefined,
      customer_email: existingSubscription?.stripe_customer_id ? undefined : customerEmail,
      client_reference_id: user.id,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${request.nextUrl.origin}/settings?billing=success`,
      cancel_url: `${request.nextUrl.origin}/settings?billing=cancelled`,
      metadata: {
        coach_id: user.id,
        plan: rawPlan,
      },
      subscription_data: {
        metadata: {
          coach_id: user.id,
          plan: rawPlan,
        },
        ...(isFirstCheckout ? { trial_period_days: FREE_TRIAL_DAYS } : {}),
      },
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.redirect(new URL("/settings?error=Plan%20wijziging%20mislukt.%20Probeer%20het%20opnieuw", request.url));
  }

  if (!session.url) {
    return NextResponse.redirect(new URL("/settings?error=Kon%20geen%20checkout%20starten", request.url));
  }

  return NextResponse.redirect(session.url, { status: 303 });
}
