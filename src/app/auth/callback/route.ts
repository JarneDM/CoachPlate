import { createClient } from "@/lib/supabase/server";
import { ensureCoachProfile } from "@/lib/supabase/ensureCoachProfile";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

const FREE_TRIAL_DAYS = 7;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data } = await supabase.auth.exchangeCodeForSession(code);

    if (data.user) {
      await ensureCoachProfile(supabase, data.user);

      const supabaseAdmin = createAdminClient();
      const { data: existingSubscription } = await supabaseAdmin
        .from("subscriptions")
        .select("id")
        .eq("coach_id", data.user.id)
        .maybeSingle();

      if (!existingSubscription?.id) {
        const trialEndsAt = new Date(Date.now() + FREE_TRIAL_DAYS * 24 * 60 * 60 * 1000).toISOString();

        const { error: trialInsertError } = await supabaseAdmin.from("subscriptions").insert({
          coach_id: data.user.id,
          plan: "pro",
          status: "trialing",
          current_period_end: trialEndsAt,
        });

        if (trialInsertError) {
          console.error("Could not create trial subscription on registration:", trialInsertError);
        }
      }

      const hasAcceptedTerms = data.user.user_metadata?.terms_accepted === true;

      if (hasAcceptedTerms) {
        const { data: existingAcceptance } = await supabase
          .from("coach_acceptance")
          .select("id")
          .eq("coach_id", data.user.id)
          .maybeSingle();

        if (existingAcceptance) {
          await supabase.from("coach_acceptance").update({ accepted: true }).eq("coach_id", data.user.id);
        } else {
          await supabase.from("coach_acceptance").insert({
            coach_id: data.user.id,
            accepted: true,
          });
        }
      }
    }
  }

  return NextResponse.redirect(new URL("/dashboard", req.url));
}
