import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { prefetchRecords } from "@/lib/supabase/prefetch";
import { createClient } from "@/lib/supabase/server";
import HomeTemplate from "@/templates/home-template";

export const dynamic = "force-static";

async function PublicPage() {
  const queryClient = new QueryClient();
  const supabase = await createClient();
  await prefetchRecords(queryClient, supabase);
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <HomeTemplate />
    </HydrationBoundary>
  );
}

export default PublicPage;
