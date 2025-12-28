import { type NextRequest, NextResponse } from "next/server";
import { getLastNumber } from "@/lib/supabase/crud";
import { createClient } from "@/lib/supabase/server";
import { type Category } from "@/types/allrecords.types";
import { Constants } from "@/types/supabase";

// RecordsEnum 타입 가드 함수
function isValidCategory(category: string): category is Category {
  return Constants.public.Enums.records.includes(category as Category);
}

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    if (!category) {
      return NextResponse.json(
        { error: "Category parameter is required" },
        { status: 400 }
      );
    }
    // RecordsEnum에 정의된 카테고리인지 확인
    if (!isValidCategory(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const result = await getLastNumber(supabase, category);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error in last-number endpoint:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
