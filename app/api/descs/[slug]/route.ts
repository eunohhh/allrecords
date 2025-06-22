import { createClient } from "@/lib/supabase/server";
import type { Desc } from "@/types/allrecords.types";
import { type NextRequest, NextResponse } from "next/server";

interface GetRecordParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: GetRecordParams) {
  const supabase = await createClient();
  const { slug } = await params;
  const { data, error } = await supabase
    .from("descs")
    .select("*")
    .eq("id", slug)
    .single();

  if (error) {
    console.error("Error getting desc:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function PUT(request: NextRequest, { params }: GetRecordParams) {
  const { slug: id } = await params;
  const supabase = await createClient();
  const body: Desc = await request.json();

  const { data, error } = await supabase
    .from("descs")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating desc:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
