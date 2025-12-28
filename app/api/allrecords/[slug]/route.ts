import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import {
  getRecord,
  processImages,
  updateRecord,
  uploadThumbnail,
} from "@/lib/supabase/crud";
import { createClient } from "@/lib/supabase/server";
import type {
  Category,
  Record,
  RecordImagePost,
} from "@/types/allrecords.types";
import type { Json } from "@/types/supabase";

interface GetRecordParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: GetRecordParams) {
  try {
    const supabase = await createClient();
    const { slug } = await params;
    const record = await getRecord(supabase, slug);

    return NextResponse.json(record, { status: 200 });
  } catch (error) {
    console.error("Error getting record:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const statusCode =
      errorMessage.includes("No") || errorMessage.includes("not found")
        ? 404
        : 500;
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: id } = await params;
    const supabase = await createClient();
    const formData = await request.formData();

    const imagesInfo: Partial<RecordImagePost>[] = JSON.parse(
      formData.get("imagesInfo") as string
    );
    const imageFiles = formData.getAll("images") as File[];
    const thumbnailFile = formData.get("thumbnail") as File | null;
    const thumbnailUrl = formData.get("thumbnailUrl") as string | null;

    const uploadedImages = await processImages(
      supabase,
      imagesInfo,
      imageFiles
    );

    let uploadedThumbnail: string | null = null;
    if (thumbnailFile) {
      uploadedThumbnail = await uploadThumbnail(supabase, thumbnailFile);
    } else if (thumbnailUrl) {
      uploadedThumbnail = thumbnailUrl;
    }

    const keywordsString = formData.get("keywords") as string;
    const keywords: string[] = keywordsString ? JSON.parse(keywordsString) : [];

    const newRecord: Record = {
      id,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as Category,
      slug: formData.get("slug") as string,
      keywords: keywords,
      created_at: formData.get("created_at") as string,
      updated_at: formData.get("updated_at") as string,
      images: uploadedImages as unknown as Json[],
      number: formData.get("number") as unknown as number,
      thumbnail: uploadedThumbnail,
    };

    const updatedRecord = await updateRecord(supabase, id, newRecord);

    revalidatePath(`/`, "page");
    return NextResponse.json(updatedRecord, { status: 200 });
  } catch (error) {
    console.error("Error updating record:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
