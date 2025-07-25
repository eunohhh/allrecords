// import type { Database } from "@/types/supabase";
// import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  // const requestHeaders = new Headers(request.headers);

  const supabaseResponse = NextResponse.next({
    request,
  });

  // const supabase = createServerClient<Database>(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  //   {
  //     cookies: {
  //       getAll() {
  //         return request.cookies.getAll();
  //       },
  //       setAll(cookiesToSet) {
  //         cookiesToSet.forEach(({ name, value, options }) =>
  //           request.cookies.set(name, value)
  //         );
  //         supabaseResponse = NextResponse.next({
  //           request,
  //         });
  //         cookiesToSet.forEach(({ name, value, options }) =>
  //           supabaseResponse.cookies.set(name, value, options)
  //         );
  //       },
  //     },
  //   }
  // );

  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();

  // if (!user) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/admin";
  //   return NextResponse.redirect(url);
  // }

  return supabaseResponse;
}
