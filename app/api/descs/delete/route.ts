import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { deleteDescs } from "@/lib/supabase/crud";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { ids }: { ids: string[] } = await request.json();
    const supabase = await createClient();

    const data = await deleteDescs(supabase, ids);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error deleting descs:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const statusCode =
      errorMessage.includes("No") || errorMessage.includes("not found")
        ? 404
        : 500;
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
