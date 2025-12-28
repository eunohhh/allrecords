import { type NextRequest, NextResponse } from "next/server";
import { getDesc, updateDesc } from "@/lib/supabase/crud";
import { createClient } from "@/lib/supabase/server";
import type { Desc } from "@/types/allrecords.types";

interface GetRecordParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: GetRecordParams) {
  try {
    const supabase = await createClient();
    const { slug } = await params;
    const desc = await getDesc(supabase, slug);

    return NextResponse.json(desc, { status: 200 });
  } catch (error) {
    console.error("Error getting desc:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const statusCode =
      errorMessage.includes("No") || errorMessage.includes("not found")
        ? 404
        : 500;
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}

export async function PUT(request: NextRequest, { params }: GetRecordParams) {
  try {
    const { slug: id } = await params;
    const supabase = await createClient();
    const body: Desc = await request.json();

    const data = await updateDesc(supabase, id, body);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error updating desc:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
