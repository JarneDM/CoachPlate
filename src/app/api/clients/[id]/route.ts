import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Niet geauthenticeerd" }, { status: 401 });
  }

  const { error } = await supabase.from("clients").delete().eq("id", id).eq("coach_id", user.id);

  if (error) {
    console.error("Error deleting client:", error);
    return NextResponse.json({ error: "Client verwijderen mislukt" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
