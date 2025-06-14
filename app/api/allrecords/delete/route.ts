import { createClient } from "@/lib/supabase/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { ids }: { ids: string[] } = await request.json();

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("allrecords")
    .delete()
    .in("id", ids)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (data.length === 0) {
    return NextResponse.json(
      { message: "No records deleted" },
      { status: 404 }
    );
  }

  return NextResponse.json(data, { status: 200 });
}
