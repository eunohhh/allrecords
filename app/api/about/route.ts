import { type NextRequest, NextResponse } from "next/server";
import { getAbout } from "@/lib/supabase/crud";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const about = await getAbout(supabase);

    return NextResponse.json(about, { status: 200 });
  } catch (error) {
    console.error("Error getting about:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const statusCode =
      errorMessage.includes("No") || errorMessage.includes("not found")
        ? 404
        : 500;
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
