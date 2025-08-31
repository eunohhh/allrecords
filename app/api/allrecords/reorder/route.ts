import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ReorderParams } from "@/types/allrecords.types";

interface PartialRecord {
  id: string;
  number: number;
}

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

    // 같은 카테고리의 모든 레코드를 가져와서 순서 업데이트
    const { data: records, error: fetchError } = await supabase
      .from("allrecords")
      .select("id, number")
      .eq("category", activeCategory)
      .order("number", { ascending: true });

    if (fetchError) {
      console.error("Error fetching records:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch records" },
        { status: 500 }
      );
    }

    if (!records || records.length === 0) {
      return NextResponse.json({ error: "No records found" }, { status: 404 });
    }
    // 전체 레코드 배열에서 순서 재계산
    const updatedRecords = [...records];

    // oldIndex와 newIndex를 실제 데이터베이스 인덱스로 변환
    const activeRecord = updatedRecords.find(
      (record: PartialRecord) => record.id === activeId
    );
    const overRecord = updatedRecords.find(
      (record: PartialRecord) => record.id === overId
    );

    if (!activeRecord || !overRecord) {
      return NextResponse.json({ error: "Records not found" }, { status: 404 });
    }

    // 현재 위치에서 제거
    const currentIndex = updatedRecords.findIndex(
      (record: PartialRecord) => record.id === activeId
    );
    const targetIndex = updatedRecords.findIndex(
      (record: PartialRecord) => record.id === overId
    );

    if (currentIndex === -1 || targetIndex === -1) {
      return NextResponse.json({ error: "Invalid indices" }, { status: 400 });
    }

    // 순서 재배치
    const [movedRecord] = updatedRecords.splice(currentIndex, 1);
    updatedRecords.splice(targetIndex, 0, movedRecord);

    // number 필드 업데이트
    const updatePromises = updatedRecords.map((record, index) =>
      supabase
        .from("allrecords")
        .update({ number: index + 1 })
        .eq("id", record.id)
    );

    const updateResults = await Promise.all(updatePromises);

    // 에러 확인
    const hasError = updateResults.some(
      (result: PostgrestSingleResponse<null>) => result.error
    );
    if (hasError) {
      console.error("Error updating records:", updateResults);
      return NextResponse.json(
        { error: "Failed to update records" },
        { status: 500 }
      );
    }

    revalidatePath(`/`, "page");
    return NextResponse.json({
      message: "Records reordered successfully",
      oldIndex,
      newIndex,
      category: activeCategory,
    });
  } catch (error) {
    console.error("Error in reorder endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
