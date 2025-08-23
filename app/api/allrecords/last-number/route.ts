import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Constants, type RecordsEnum } from "@/types/supabase";

// RecordsEnum 타입 가드 함수
function isValidCategory(category: string): category is RecordsEnum {
  return Constants.public.Enums.records.includes(category as RecordsEnum);
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

    // 해당 카테고리의 가장 큰 number 값을 가져오기
    const { data: records, error: fetchError } = await supabase
      .from("allrecords")
      .select("number")
      .eq("category", category)
      .order("number", { ascending: false })
      .limit(1);

    if (fetchError) {
      console.error("Error fetching last number:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch last number" },
        { status: 500 }
      );
    }

    // 마지막 순서 번호 계산 (레코드가 없으면 0, 있으면 최대값 + 1)
    const lastNumber = records && records.length > 0 ? records[0].number : 0;
    const nextNumber = lastNumber + 1;

    return NextResponse.json({
      lastNumber,
      nextNumber,
      category,
    });
  } catch (error) {
    console.error("Error in last-number endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
