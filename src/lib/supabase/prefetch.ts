import { SupabaseClient } from "@supabase/supabase-js";
import { QueryClient } from "@tanstack/react-query";
import {
  QUERY_KEY_ALL,
  QUERY_KEY_RECORDS,
} from "@/constants/allrecords.consts";
import { getRecords } from "./crud";

export async function prefetchRecords(
  queryClient: QueryClient,
  supabase: SupabaseClient
) {
  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEY_RECORDS, QUERY_KEY_ALL],
    queryFn: async () => {
      const data = await getRecords(supabase, {
        page: 1,
        limit: 1000,
        search: "",
        sort: "created_at",
        order: "desc",
        category: [],
      });
      return data;
    },
  });
}
