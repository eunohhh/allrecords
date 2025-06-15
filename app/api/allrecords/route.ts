import { createClient } from "@/lib/supabase/server";
import type {
  Record,
  RecordImage,
  RecordImagePost,
} from "@/types/allrecords.types";
import type { Json } from "@/types/supabase";
import { type NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 40;
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "created_at";
  const order = searchParams.get("order") || "desc";
  const category = searchParams.get("category")?.split(",") || [];

  const offset = (Number(page) - 1) * Number(limit);
  const to = offset + Number(limit);

  const query = supabase.from("allrecords").select("*").range(offset, to);

  if (search) {
    query.textSearch("title", search);
  }

  if (sort) {
    query.order(sort, { ascending: order === "asc" });
  }

  if (category.length > 0) {
    query.in("category", category);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const formData = await request.formData();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const slug = formData.get("slug") as string;
  const created_at = formData.get("created_at") as string;
  const updated_at = formData.get("updated_at") as string;
  const imagesInfoString = formData.get("imagesInfo") as string;
  const imagesInfo: Omit<RecordImagePost, "file">[] =
    JSON.parse(imagesInfoString);
  const imageFiles = formData.getAll("images") as File[];

  const uploadedImages: RecordImage[] = [];

  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i];
    const info = imagesInfo[i];

    const imageBuffer = await file.arrayBuffer();

    const processedImageBuffer = await sharp(imageBuffer)
      .webp({ quality: 80 })
      .toBuffer();

    const originalFileName = file.name.split(".").slice(0, -1).join(".");
    const fileName = `${crypto.randomUUID()}-${originalFileName}.webp`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, processedImageBuffer, {
        contentType: "image/webp",
      });

    if (uploadError) {
      console.error("Image upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload image." },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage
      .from("images")
      .getPublicUrl(uploadData.path);

    uploadedImages.push({
      id: info.id,
      url: urlData.publicUrl,
      desc: info.desc,
    });
  }

  const recordToInsert: Record = {
    id: crypto.randomUUID(),
    title,
    description,
    category,
    slug,
    created_at,
    updated_at,
    images: uploadedImages as unknown as Json[],
  };

  const { data: newRecord, error } = await supabase
    .from("allrecords")
    .insert(recordToInsert)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(newRecord, { status: 201 });
}
