import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { sanitizeFilename } from "@/lib/utils";
import {
  Category,
  Desc,
  Record,
  RecordImage,
  RecordImagePost,
} from "@/types/allrecords.types";

interface GetRecordsParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: string;
  category?: Category[];
}

export async function getRecords(
  supabase: SupabaseClient,
  params: GetRecordsParams
) {
  const {
    page = 1,
    limit = 40,
    search = "",
    sort = "created_at",
    order = "desc",
    category = [],
  } = params;
  const offset = (page - 1) * limit;
  const to = offset + limit - 1; // Supabase range는 inclusive이므로 -1
  const query = supabase.from("allrecords").select("*").range(offset, to);
  if (search) {
    query.textSearch("title", search);
  }
  if (sort) {
    query.order(sort, { ascending: order === "asc" });
  }
  if (category.length > 0) {
    query.in("category", category as Category[]);
  }

  const {
    data,
    error,
  }: { data: Record[] | null; error: PostgrestError | null } = await query;

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("No records found");
  }

  return data;
}

export async function getAbout(supabase: SupabaseClient) {
  const { data, error } = await supabase.from("descs").select("*");

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("No about data found");
  }

  const about = data.filter((desc) => desc.is_select);

  if (about.length === 0) {
    throw new Error("No selected about data found");
  }

  return about[0];
}

export async function getRecord(supabase: SupabaseClient, slug: string) {
  const { data, error } = await supabase
    .from("allrecords")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("No record found");
  }

  return data;
}

export async function uploadImage(
  supabase: SupabaseClient,
  file: File
): Promise<string> {
  const imageBuffer = await file.arrayBuffer();
  const processedImageBuffer = await sharp(imageBuffer)
    .webp({ quality: 80 })
    .toBuffer();

  const originalFileName = sanitizeFilename(file.name);
  const fileName = `${crypto.randomUUID()}-${originalFileName}.webp`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("images")
    .upload(fileName, processedImageBuffer, {
      contentType: "image/webp",
    });

  if (uploadError) {
    throw new Error(`Failed to upload image: ${uploadError.message}`);
  }

  const { data: urlData } = supabase.storage
    .from("images")
    .getPublicUrl(uploadData.path);

  return urlData.publicUrl;
}

export async function uploadThumbnail(
  supabase: SupabaseClient,
  file: File
): Promise<string> {
  const thumbnailBuffer = await file.arrayBuffer();
  const processedThumbnailBuffer = await sharp(thumbnailBuffer)
    .webp({ quality: 30 })
    .toBuffer();

  const originalFileName = sanitizeFilename(file.name);
  const fileName = `${crypto.randomUUID()}-${originalFileName || "file"}.webp`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("images")
    .upload(fileName, processedThumbnailBuffer, {
      contentType: "image/webp",
    });

  if (uploadError) {
    throw new Error(`Failed to upload thumbnail: ${uploadError.message}`);
  }

  const { data: urlData } = supabase.storage
    .from("images")
    .getPublicUrl(uploadData.path);

  return urlData.publicUrl;
}

export async function processImages(
  supabase: SupabaseClient,
  imagesInfo: Partial<RecordImagePost>[],
  imageFiles: File[]
): Promise<RecordImage[]> {
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
    if (!file) {
      throw new Error("Not enough image files provided");
    }

    uploadedImage.url = await uploadImage(supabase, file);
    fileIdx++;
  }

  return uploadedImages;
}

export async function processImagesForPost(
  supabase: SupabaseClient,
  imagesInfo: Omit<RecordImagePost, "file">[],
  imageFiles: File[]
): Promise<RecordImage[]> {
  try {
    const uploadedImages: RecordImage[] = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const info = imagesInfo[i];

      if (!info) {
        throw new Error("Image info not provided for all files");
      }

      const url = await uploadImage(supabase, file);

      uploadedImages.push({
        id: info.id,
        url,
        desc: info.desc,
      });
    }

    return uploadedImages;
  } catch (error) {
    console.error("Error processing images:", error);
    throw new Error("Failed to process images");
  }
}

export async function createRecord(supabase: SupabaseClient, record: Record) {
  const { data, error } = await supabase
    .from("allrecords")
    .insert(record)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Failed to create record");
  }

  return data;
}

export async function updateRecord(
  supabase: SupabaseClient,
  id: string,
  record: Record
) {
  const { data, error } = await supabase
    .from("allrecords")
    .update(record)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Failed to update record");
  }

  return data;
}

export async function deleteRecords(supabase: SupabaseClient, ids: string[]) {
  const { data, error } = await supabase
    .from("allrecords")
    .delete()
    .in("id", ids)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    throw new Error("No records deleted");
  }

  return data;
}

export async function getLastNumber(
  supabase: SupabaseClient,
  category: Category
) {
  const { data, error } = await supabase
    .from("allrecords")
    .select("number")
    .eq("category", category)
    .order("number", { ascending: false })
    .limit(1);

  if (error) {
    throw new Error(error.message);
  }

  const lastNumber = data && data.length > 0 ? data[0].number : 0;
  const nextNumber = lastNumber + 1;

  return {
    lastNumber,
    nextNumber,
    category,
  };
}

interface PartialRecord {
  id: string;
  number: number;
}

export async function reorderRecords(
  supabase: SupabaseClient,
  activeId: string,
  overId: string,
  category: Category
) {
  // 같은 카테고리의 모든 레코드를 가져오기
  const { data: records, error: fetchError } = await supabase
    .from("allrecords")
    .select("id, number")
    .eq("category", category)
    .order("number", { ascending: true });

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  if (!records || records.length === 0) {
    throw new Error("No records found");
  }

  // 전체 레코드 배열에서 순서 재계산
  const updatedRecords = [...records];

  // activeId와 overId로 레코드 찾기
  const activeRecord = updatedRecords.find(
    (record: PartialRecord) => record.id === activeId
  );
  const overRecord = updatedRecords.find(
    (record: PartialRecord) => record.id === overId
  );

  if (!activeRecord || !overRecord) {
    throw new Error("Records not found");
  }

  // 현재 위치에서 제거
  const currentIndex = updatedRecords.findIndex(
    (record: PartialRecord) => record.id === activeId
  );
  const targetIndex = updatedRecords.findIndex(
    (record: PartialRecord) => record.id === overId
  );

  if (currentIndex === -1 || targetIndex === -1) {
    throw new Error("Invalid indices");
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
  const hasError = updateResults.some((result) => result.error);
  if (hasError) {
    const errors = updateResults
      .filter((result) => result.error)
      .map((result) => result.error?.message)
      .join(", ");
    throw new Error(`Failed to update records: ${errors}`);
  }

  return {
    message: "Records reordered successfully",
    category,
  };
}

interface GetDescsParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: string;
  category?: string[];
}

export async function getDescs(
  supabase: SupabaseClient,
  params: GetDescsParams
) {
  const {
    page = 1,
    limit = 40,
    search = "",
    sort = "created_at",
    order = "desc",
    category = [],
  } = params;
  const offset = (page - 1) * limit;
  const to = offset + limit;
  const query = supabase.from("descs").select("*").range(offset, to);
  if (search) {
    query.textSearch("content", search);
  }
  if (sort) {
    query.order(sort, { ascending: order === "asc" });
  }
  if (category.length > 0) {
    query.in("category", category);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function createDesc(supabase: SupabaseClient, desc: Desc) {
  const descToInsert = {
    ...desc,
    id: desc.id || crypto.randomUUID(),
  };

  const { data, error } = await supabase
    .from("descs")
    .insert(descToInsert)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Failed to create desc");
  }

  return data;
}

export async function getDesc(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("descs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("No desc found");
  }

  return data;
}

export async function updateDesc(
  supabase: SupabaseClient,
  id: string,
  desc: Desc
) {
  const { data, error } = await supabase
    .from("descs")
    .update(desc)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Failed to update desc");
  }

  return data;
}

export async function deleteDescs(supabase: SupabaseClient, ids: string[]) {
  const { data, error } = await supabase
    .from("descs")
    .delete()
    .in("id", ids)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    throw new Error("No descs deleted");
  }

  return data;
}
