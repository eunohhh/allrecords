import { PUBLIC_URL } from "@/constants/allrecords.consts";
import { createClient } from "@/lib/supabase/server";
import axios, { type AxiosResponse } from "axios";
import { type NextRequest, NextResponse } from "next/server";

interface HealthCheckResponse {
  id: string;
  expires_in: number;
  app_id: number;
}

interface RefreshTokenResponse {
  token_type: string;
  access_token: string;
  id_token?: string;
  expires_in: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
}

interface MessageResponse {
  result_code: number;
}

const url =
  PUBLIC_URL ?? // Set this to your site URL in production env.
  process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
  "http://localhost:3000/";

export async function POST(req: NextRequest) {
  const kakaoClientId = process.env.KAKAO_REST_API_KEY;

  if (!kakaoClientId) {
    return NextResponse.json(
      { error: "KAKAO_REST_API_KEY is not set" },
      { status: 500 }
    );
  }

  const formData = await req.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  const kakaoKapi = axios.create({
    baseURL: "https://kapi.kakao.com",
  });

  const kakaoAuthApi = axios.create({
    baseURL: "https://kauth.kakao.com",
  });

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const templateObject = {
    object_type: "text",
    text: `🔔 새로운 문의가 도착했습니다!

👤 이름: ${name}
📧 이메일: ${email}
💬 메시지:
${message}

⏰ ${new Date().toLocaleString("ko-KR")}`,
    link: {
      web_url: url,
    },
  };

  const requestTemplateObject = new URLSearchParams({
    template_object: JSON.stringify(templateObject),
  });

  const supabase = await createClient();

  // 테이블의 첫번째 데이터만 가져오기
  try {
    const { data: tokens, error } = await supabase
      .from("token")
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { token, refresh_token } = tokens;

    const tokenHealthCheckResponse: AxiosResponse<HealthCheckResponse> =
      await kakaoKapi.get("/v1/user/access_token_info", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    if (tokenHealthCheckResponse.status !== 200) {
      return NextResponse.json(
        { error: "Failed to check token health" },
        { status: 500 }
      );
    }
    if (!tokenHealthCheckResponse.data) {
      return NextResponse.json(
        { error: "Failed to check token health" },
        { status: 500 }
      );
    }

    // 사용할 액세스 토큰 결정
    let accessToken = token;

    // expires_in 이 1분 이하인 경우 토큰 갱신
    if (tokenHealthCheckResponse.data.expires_in < 60) {
      const refreshRequestData = {
        grant_type: "refresh_token",
        client_id: kakaoClientId,
        refresh_token: refresh_token,
      };

      const refreshTokenResponse: AxiosResponse<RefreshTokenResponse> =
        await kakaoAuthApi.post("/oauth/token", refreshRequestData);

      if (refreshTokenResponse.status !== 200) {
        return NextResponse.json(
          { error: "Failed to refresh token" },
          { status: 500 }
        );
      }

      if (!refreshTokenResponse.data) {
        return NextResponse.json(
          { error: "Failed to refresh token" },
          { status: 500 }
        );
      }

      const { access_token, refresh_token: newRefreshToken } =
        refreshTokenResponse.data;

      // created_at 이 가장 빠른 데이터 찾기
      const { data: oldestToken, error: oldestTokenError } = await supabase
        .from("token")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(1);

      if (oldestTokenError) {
        return NextResponse.json(
          { error: oldestTokenError.message },
          { status: 500 }
        );
      }

      if (!oldestToken) {
        return NextResponse.json({ error: "No token found" }, { status: 500 });
      }

      const { data: updatedToken, error: updateTokenError } = await supabase
        .from("token")
        .update({ token: access_token, refresh_token: newRefreshToken })
        .eq("id", oldestToken[0].id)
        .single();

      if (updateTokenError) {
        return NextResponse.json(
          { error: updateTokenError.message },
          { status: 500 }
        );
      }

      if (!updatedToken) {
        return NextResponse.json(
          { error: "Failed to update token" },
          { status: 500 }
        );
      }

      accessToken = access_token;
    }

    // 카카오 메시지 전송
    const messageResponse: AxiosResponse<MessageResponse> =
      await kakaoKapi.post(
        "/v2/api/talk/memo/default/send",
        requestTemplateObject,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        }
      );

    if (messageResponse.status !== 200) {
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }

    if (!messageResponse.data) {
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }

    if (messageResponse.data.result_code !== 0) {
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("error ===>", error);
    console.error("error.message ===>", (error as any).response);
    return NextResponse.json(
      { message: "Failed to send message" },
      { status: 500 }
    );
  }
}
