import { type NextRequest, NextResponse } from "next/server";
import { EUN_MAIL } from "@/constants/allrecords.consts";
import { createClient } from "@/lib/supabase/server";

interface TokenRequest {
  token: string;
  refresh_token: string;
  user_email: string;
}

export async function POST(request: NextRequest) {
  const tokenDataUuid = process.env.TOKEN_DATA_UUID;

  if (!tokenDataUuid) {
    return NextResponse.json(
      { error: "TOKEN_DATA_UUID is not set" },
      { status: 500 }
    );
  }

  const { token, refresh_token, user_email } =
    (await request.json()) as TokenRequest;

  if (user_email !== EUN_MAIL) {
    return NextResponse.json(
      { error: "토큰 요청 권한이 없는 사용자 입니다" },
      { status: 401 }
    );
  }

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

  return NextResponse.json({ message: "success" }, { status: 200 });
}
