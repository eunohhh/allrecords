import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

interface GetRecordParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: GetRecordParams) {
  const supabase = await createClient();
  const { slug } = await params;
  const { data, error } = await supabase
    .from("allrecords")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
