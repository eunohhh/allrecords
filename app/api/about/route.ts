import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("descs").select("*");

  if (error) {
    console.error("Error getting about:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const about = data?.filter((desc) => desc.is_select);

  return NextResponse.json(about[0], { status: 200 });
}
