import { createClient } from "@/lib/supabase/server";
import type { Desc } from "@/types/allrecords.types";
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

  const query = supabase.from("descs").select("*").range(offset, to);

  if (search) {
    query.textSearch("content", search);
  }

  if (sort) {
    query.order(sort, { ascending: order === "asc" });
  }

  if (category.length > 0) {
    query.in("category", category);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error getting descs:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const body: Desc = await request.json();

  body.id = crypto.randomUUID();

  const { data, error } = await supabase
    .from("descs")
    .insert(body)
    .select()
    .single();

  if (error) {
    console.error("Error inserting desc:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
