import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

interface TokenRequest {
  token: string;
  refresh_token: string;
}

export async function POST(request: NextRequest) {
  const tokenDataUuid = process.env.TOKEN_DATA_UUID;

  if (!tokenDataUuid) {
    return NextResponse.json(
      { error: "TOKEN_DATA_UUID is not set" },
      { status: 500 }
    );
  }

  const { token, refresh_token } = (await request.json()) as TokenRequest;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("token")
    .update({
      token,
      refresh_token,
      updated_at: new Date().toISOString(),
    })
    .eq("id", tokenDataUuid)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
