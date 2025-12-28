import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/env/t3-env";
import type { Database } from "@/types/supabase";

export function createClient() {
  // Database 타입을 명시적으로 지정 [[memory:6952077]]
  return createBrowserClient<Database, "public">(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

const supabase = createClient();

export default supabase;
