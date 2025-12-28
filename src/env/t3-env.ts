import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    SUPABASE_URL: z.string().min(1),
    SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
    SUPABASE_PROJECT_ID: z.string().min(1),
    ADMIN_EMAIL_1: z.email(),
    ADMIN_EMAIL_2: z.email(),
    KAKAO_JAVASCRIPT_KEY: z.string().min(1),
    KAKAO_REST_API_KEY: z.string().min(1),
    KAKAO_CLIENT_SECRET_KEY: z.string().min(1),
    TOKEN_DATA_UUID: z.string().min(1),
    MISUN_UUID: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().min(1),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_URL: z.url().optional(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  },
});
