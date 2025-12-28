import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import {
  createRecord,
  getRecords,
  processImagesForPost,
  uploadThumbnail,
} from "@/lib/supabase/crud";
import { createClient } from "@/lib/supabase/server";
import { shuffleArray } from "@/lib/utils";
import type {
  Category,
  Record,
  RecordImagePost,
} from "@/types/allrecords.types";
import type { Json } from "@/types/supabase";

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

    const data = await getRecords(supabase, {
      page: Number(page),
      limit: Number(limit),
      search,
      sort,
      order,
      category: category as Category[],
    });

    return NextResponse.json(shuffleArray(data), { status: 200 });
  } catch (error) {
    console.error("Error getting records:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const formData = await request.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as Category;
    const slug = formData.get("slug") as string;
    const keywordsString = formData.get("keywords") as string;
    const keywords: string[] = keywordsString ? JSON.parse(keywordsString) : [];
    const created_at = formData.get("created_at") as string;
    const updated_at = formData.get("updated_at") as string;
    const imagesInfoString = formData.get("imagesInfo") as string;
    const imagesInfo: Omit<RecordImagePost, "file">[] =
      JSON.parse(imagesInfoString);
    const imageFiles = formData.getAll("images") as File[];
    const number = Number(formData.get("number")) || 1;
    const thumbnailFile = formData.get("thumbnail") as File | null;

    const uploadedImages = await processImagesForPost(
      supabase,
      imagesInfo,
      imageFiles
    );

    let uploadedThumbnail: string | null = null;
    if (thumbnailFile) {
      uploadedThumbnail = await uploadThumbnail(supabase, thumbnailFile);
    }

    const recordToInsert: Record = {
      id: crypto.randomUUID(),
      title,
      description,
      category,
      slug,
      keywords: keywords,
      created_at,
      updated_at,
      images: uploadedImages as unknown as Json[],
      number,
      thumbnail: uploadedThumbnail,
    };

    const newRecord = await createRecord(supabase, recordToInsert);

    revalidatePath(`/`, "page");
    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    console.error("Error creating record:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
