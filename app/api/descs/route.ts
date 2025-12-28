import { type NextRequest, NextResponse } from "next/server";
import { createDesc, getDescs } from "@/lib/supabase/crud";
import { createClient } from "@/lib/supabase/server";
import type { Desc } from "@/types/allrecords.types";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 40;
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "created_at";
    const order = searchParams.get("order") || "desc";
    const category = searchParams.get("category")?.split(",") || [];

    const data = await getDescs(supabase, {
      page: Number(page),
      limit: Number(limit),
      search,
      sort,
      order,
      category,
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error getting descs:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body: Desc = await request.json();

    const data = await createDesc(supabase, body);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error inserting desc:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
