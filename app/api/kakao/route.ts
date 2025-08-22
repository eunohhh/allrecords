import { PUBLIC_URL } from "@/constants/allrecords.consts";
import { createClient } from "@/lib/supabase/server";
import type {
  HealthCheckResponse,
  KakaoFriendListResponse,
  MessageRequest,
  MessageResponse,
  RefreshTokenResponse,
  TemplateObject,
} from "@/types/allrecords.types";
import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import { type NextRequest, NextResponse } from "next/server";

const misunUUId = process.env.MISUN_UUID;

const url =
  PUBLIC_URL ?? // Set this to your site URL in production env.
  process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
  "http://localhost:3000/";

const sendMessage = async (
  kakaoKapi: AxiosInstance,
  accessToken: string,
  uuid: string,
  templateObject: TemplateObject
) => {
  const body = new URLSearchParams({
    template_object: JSON.stringify(templateObject),
    receiver_uuids: JSON.stringify([uuid]),
  });

  //친구에게 카카오 메시지 전송
  const messageResponse: AxiosResponse<MessageResponse> = await kakaoKapi.post(
    "/v1/api/talk/friends/message/default/send",
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    }
  );

  return messageResponse;
};

const getKakaoFriendList = async (
  kakaoKapi: AxiosInstance,
  accessToken: string
) => {
  // 카카오 친구목록 조회하여 즐겨찾기 첫번째 대상 찾기
  const kakaoFriendListResponse: AxiosResponse<KakaoFriendListResponse> =
    await kakaoKapi.get("/v1/api/talk/friends", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

  return kakaoFriendListResponse;
};

const getUUId = (
  kakaoFriendListResponse: AxiosResponse<KakaoFriendListResponse>
) => {
  if (kakaoFriendListResponse.status !== 200) return null;
  if (!kakaoFriendListResponse.data) return null;

  const { elements } = kakaoFriendListResponse.data;
  if (!elements) return null;

  return elements[0].uuid;
};

const retrySendMessage = async (
  kakaoKapi: AxiosInstance,
  accessToken: string,
  templateObject: MessageRequest["template_object"]
) => {
  // 만약 misunUUId 가 없으면 즐겨찾기 첫번째 대상 찾기
  const kakaoFriendListResponse = await getKakaoFriendList(
    kakaoKapi,
    accessToken
  );
  const uuid = getUUId(kakaoFriendListResponse);
  if (!uuid) return null;

  const messageResponse = await sendMessage(
    kakaoKapi,
    accessToken,
    uuid,
    templateObject
  );

  return messageResponse;
};

const retrySendMessageAndReturnException = async (
  kakaoKapi: AxiosInstance,
  accessToken: string,
  templateObject: MessageRequest["template_object"]
) => {
  const retryMessageResponse = await retrySendMessage(
    kakaoKapi,
    accessToken,
    templateObject
  );

  if (retryMessageResponse === null) {
    return NextResponse.json(
      { error: "Failed to get kakao friend list" },
      { status: 500 }
    );
  }

  if (retryMessageResponse.status !== 200) {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Message sent successfully" },
    { status: 200 }
  );
};

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

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const kakaoKapi = axios.create({
    baseURL: "https://kapi.kakao.com",
  });

  const kakaoAuthApi = axios.create({
    baseURL: "https://kauth.kakao.com",
  });

  const templateObject: MessageRequest["template_object"] = {
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

    // 사용할 액세스 토큰 결정
    let accessToken = token;
    let shouldRefreshToken = false;

    // 토큰 헬스체크 시도
    try {
      const tokenHealthCheckResponse: AxiosResponse<HealthCheckResponse> =
        await kakaoKapi.get("/v1/user/access_token_info", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      if (
        tokenHealthCheckResponse.status === 200 &&
        tokenHealthCheckResponse.data
      ) {
        // expires_in 이 1분 이하인 경우 토큰 갱신 필요
        if (tokenHealthCheckResponse.data.expires_in < 60) {
          shouldRefreshToken = true;
        }
      } else {
        shouldRefreshToken = true;
      }
    } catch (error: any) {
      // 401 에러 (토큰 만료) 또는 기타 에러 발생 시 토큰 갱신 시도
      console.log(
        "Token health check failed, attempting refresh:",
        error.response?.status
      );
      shouldRefreshToken = true;
    }

    // 토큰 갱신이 필요한 경우
    if (shouldRefreshToken) {
      const refreshRequestData = new URLSearchParams({
        grant_type: "refresh_token",
        client_id: kakaoClientId,
        refresh_token: refresh_token,
      });

      const refreshTokenResponse: AxiosResponse<RefreshTokenResponse> =
        await kakaoAuthApi.post("/oauth/token", refreshRequestData, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        });

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
        .select()
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

    // env 에 misunUUId 가 없으면 예외 발생
    if (!misunUUId) {
      return NextResponse.json(
        { message: "Misun UUID is not set" },
        { status: 400 }
      );
    }

    // env 에 있는 misunUUId 가 있으면 우선 메시지 전송 시도
    const messageResponse = await sendMessage(
      kakaoKapi,
      accessToken,
      misunUUId,
      templateObject
    );

    // console.log("messageResponse ===>", messageResponse);

    // 실패시 재시도
    if (messageResponse.status !== 200) {
      return retrySendMessageAndReturnException(
        kakaoKapi,
        accessToken,
        templateObject
      );
    }

    // 실패시 재시도
    if (!messageResponse.data) {
      return retrySendMessageAndReturnException(
        kakaoKapi,
        accessToken,
        templateObject
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
