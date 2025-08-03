"use client";

import {
  useAdminTokenMutation,
  useAdminUserQuery,
} from "@/features/admin/hooks/admin.queries";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

function AdminTemplate() {
  const [isToken, setIsToken] = useState(false);
  const { data: user } = useAdminUserQuery();
  const { mutate: postAdminToken } = useAdminTokenMutation();
  // console.log("user ===>", user);

  const supabase = createClient();

  useEffect(() => {
    // 인증 상태 변화 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // console.log("event ===>", event);
      // console.log("session ===>", session);
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

  return (
    <div>
      admin-template
      <div>{user?.user_metadata.email}님 안녕하세요!</div>
    </div>
  );
}

export default AdminTemplate;
