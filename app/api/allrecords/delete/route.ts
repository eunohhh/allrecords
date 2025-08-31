import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const { ids }: { ids: string[] } = await request.json();

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("allrecords")
    .delete()
    .in("id", ids)
    .select();

  if (error) {
    console.error("Error deleting records:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (data.length === 0) {
    return NextResponse.json(
      { message: "No records deleted" },
      { status: 404 }
    );
  }

  revalidatePath(`/`, "page");
  return NextResponse.json(data, { status: 200 });
}
