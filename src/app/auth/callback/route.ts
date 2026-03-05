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
    }
  }

  return NextResponse.redirect(new URL("/dashboard", req.url));
}
