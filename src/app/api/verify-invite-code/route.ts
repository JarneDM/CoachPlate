import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: coach, error } = await supabase.from("coaches").select("id, full_name").eq("invite_code", code).maybeSingle();

  if (error || !coach) {
    return NextResponse.json({ error: "Ongeldige code" }, { status: 404 });
  }

  return NextResponse.json({ coachName: coach.full_name });
}
