import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }

  // return NextResponse.json({ message: "Logout successful" }, { status: 200 });
  return redirect("/signin");
}
