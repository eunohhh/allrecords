import { SupabaseClient } from "@supabase/supabase-js";
import { QueryClient } from "@tanstack/react-query";
import {
  DEFAULT_RECORDS_PARAMS,
  QUERY_KEY_ALL,
  QUERY_KEY_RECORDS,
} from "@/constants/allrecords.consts";
import { getRecordsSupabase } from "./crud";

export async function prefetchRecords(
  queryClient: QueryClient,
  supabase: SupabaseClient
) {
  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEY_RECORDS, QUERY_KEY_ALL],
    queryFn: async () => {
      const data = await getRecordsSupabase(supabase, DEFAULT_RECORDS_PARAMS);
      return data;
    },
  });
}
