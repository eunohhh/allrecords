"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useAdminTokenMutation,
  useAdminUserQuery,
} from "@/features/admin/hooks/admin.queries";
import { createClient } from "@/lib/supabase/client";

function AdminTemplate() {
  const router = useRouter();
  const [isToken, setIsToken] = useState(false);
  const { data: user, error } = useAdminUserQuery();
  const { mutate: postAdminToken } = useAdminTokenMutation();
  // console.log("user ===>", user);

  const supabase = createClient();

  useEffect(() => {
    // 인증 상태 변화 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("event ===>", event);
      console.log("session ===>", session);
      if (
        (event === "SIGNED_IN" ||
          event === "TOKEN_REFRESHED" ||
          event === "INITIAL_SESSION") &&
        session?.provider_token
      ) {
        console.log("카카오 Provider Token:", session.provider_token);
        console.log(
          "카카오 Provider Refresh Token:",
          session.provider_refresh_token
        );

        // 토큰을 로컬스토리지에 저장
        localStorage.setItem("kakao_provider_token", session.provider_token);
        localStorage.setItem(
          "kakao_provider_refresh_token",
          session.provider_refresh_token ?? ""
        );
        setIsToken(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (!user) return;
    if (isToken) postAdminToken(user);
  }, [isToken, postAdminToken, user]);

  useEffect(() => {
    if (error) {
      console.error(error);
      toast.error("로그인 정보가 만료되었습니다. 다시 로그인해주세요.");
      router.push("/signin");
    }
  }, [error, router]);

  return (
    <div>
      admin-template
      <div>{user?.user_metadata.email}님 안녕하세요!</div>
    </div>
  );
}

export default AdminTemplate;
