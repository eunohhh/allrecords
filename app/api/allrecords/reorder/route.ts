import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { reorderRecords } from "@/lib/supabase/crud";
import { createClient } from "@/lib/supabase/server";
import { ReorderParams } from "@/types/allrecords.types";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 인증 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as ReorderParams;
    const { activeId, overId, activeCategory, oldIndex, newIndex } = body;

    if (!activeId || !overId || !activeCategory) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const result = await reorderRecords(
      supabase,
      activeId,
      overId,
      activeCategory
    );

    revalidatePath(`/`, "page");
    return NextResponse.json({
      ...result,
      oldIndex,
      newIndex,
    });
  } catch (error) {
    console.error("Error in reorder endpoint:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    const statusCode =
      errorMessage.includes("No") ||
      errorMessage.includes("not found") ||
      errorMessage.includes("Invalid")
        ? 404
        : 500;
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
