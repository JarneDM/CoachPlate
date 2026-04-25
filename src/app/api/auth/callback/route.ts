import { createClient } from "@/lib/supabase/server";
import { ensureCoachProfile } from "@/lib/supabase/ensureCoachProfile";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data } = await supabase.auth.exchangeCodeForSession(code);

    if (data.user) {
      await ensureCoachProfile(supabase, data.user);

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
