import { createClient } from "@/lib/supabase/server";
import type { Record } from "@/types/allrecords.types";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 40;
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "created_at";
  const order = searchParams.get("order") || "desc";
  const category = searchParams.get("category")?.split(",") || [];

  const offset = (Number(page) - 1) * Number(limit);
  const to = offset + Number(limit);

  const query = supabase.from("allrecords").select("*").range(offset, to);

  if (search) {
    query.textSearch("title", search);
  }

  if (sort) {
    query.order(sort, { ascending: order === "asc" });
  }

  if (category.length > 0) {
    query.in("category", category);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const records: Record = await request.json();
  const { data, error } = await supabase
    .from("allrecords")
    .insert(records)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
