import type { Provider } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/env/t3-env";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get("provider");
  const next = searchParams.get("next");

  const supabase = await createClient();

  const getURL = () => {
    let url =
      env.NEXT_PUBLIC_URL ?? // Set this to your site URL in production env.
      process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
      "http://localhost:3000/";
    // Make sure to include `https://` when not localhost.
    url = url.startsWith("http") ? url : `https://${url}`;
    // Make sure to include a trailing `/`.
    url = url.endsWith("/") ? url : `${url}/`;
    return url;
  };

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as Provider,
    options: {
      redirectTo: `${getURL()}/api/auth/callback?next=${next}`,
      queryParams: {
        scope:
          "account_email profile_image profile_nickname talk_message friends",
      },
    },
  });

  if (error) {
    return NextResponse.json({ error: error?.message }, { status: 401 });
  }

  if (data.url) {
    return NextResponse.redirect(data.url);
  }

  return NextResponse.json({ error: "Login failed" }, { status: 401 });
}
