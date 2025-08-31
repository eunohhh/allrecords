import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import {
  QUERY_KEY_ALL,
  QUERY_KEY_RECORDS,
} from "@/constants/allrecords.consts";
import { getAllRecordsServer } from "@/features/home/apis/home.server-apis";
import HomeTemplate from "@/templates/home-template";

export const dynamic = "force-static";

async function PublicPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEY_RECORDS, QUERY_KEY_ALL],
    queryFn: () => getAllRecordsServer(),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <HomeTemplate />
    </HydrationBoundary>
  );
}

export default PublicPage;
