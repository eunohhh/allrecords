import { createClient } from "@/lib/supabase/server";
import type {
  Category,
  Record,
  RecordImage,
  RecordImagePost,
} from "@/types/allrecords.types";
import type { Json } from "@/types/supabase";
import { type NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

interface GetRecordParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: GetRecordParams) {
  const supabase = await createClient();
  const { slug } = await params;
  const { data, error } = await supabase
    .from("allrecords")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug: id } = await params;

  const supabase = await createClient();
  const formData = await request.formData();

  const imagesInfo: Partial<RecordImagePost>[] = JSON.parse(
    formData.get("imagesInfo") as string
  );
  const imageFiles = formData.getAll("images") as File[];
  const uploadedImages: RecordImage[] = [];

  for (const info of imagesInfo) {
    uploadedImages.push({
      id: info.id ?? 0,
      url: info.url ?? "",
      desc: info.desc ?? "",
    });
  }

  let fileIdx = 0;

  for (const uploadedImage of uploadedImages) {
    if (uploadedImage.url.length > 0) {
      continue;
    }
    const file = imageFiles[fileIdx];
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

    uploadedImage.url = urlData.publicUrl;
    fileIdx++;
  }

  const newRecord: Record = {
    id,
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as Category,
    slug: formData.get("slug") as string,
    created_at: formData.get("created_at") as string,
    updated_at: formData.get("updated_at") as string,
    images: uploadedImages as unknown as Json[],
  };

  // console.log("put new record ===>", newRecord);

  const { data: updatedRecord, error } = await supabase
    .from("allrecords")
    .update(newRecord)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating record:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(updatedRecord, { status: 200 });
}
