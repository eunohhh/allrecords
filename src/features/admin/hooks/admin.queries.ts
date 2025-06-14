import {
  QUERY_KEY_ADMIN_RECORDS,
  QUERY_KEY_USER,
} from "@/constants/allrecords.consts";
import type { Record, RecordsParams } from "@/types/allrecords.types";
import type { User } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteAdminRecords,
  getAdminRecords,
  getAdminUser,
  postAdminRecords,
  putAdminRecords,
} from "../apis/admin.apis";

export const useAdminRecordsQuery = (params: RecordsParams) => {
  return useQuery<Record[], Error>({
    queryKey: [QUERY_KEY_ADMIN_RECORDS],
    queryFn: () => getAdminRecords(params),
  });
};

export const useAdminRecordsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Record, Error, RecordsParams>({
    mutationFn: (params) => postAdminRecords(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_ADMIN_RECORDS] });
    },
  });
};

export const useAdminRecordsDeleteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Record[], Error, string[]>({
    mutationFn: (ids) => deleteAdminRecords({ ids }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_ADMIN_RECORDS] });
    },
  });
};

export const useAdminRecordsPutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Record[], Error, { id: string; params: RecordsParams }>({
    mutationFn: ({ id, params }) => putAdminRecords(id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_ADMIN_RECORDS] });
    },
  });
};

export const useAdminUserQuery = () => {
  return useQuery<User, Error>({
    queryKey: [QUERY_KEY_USER],
    queryFn: () => getAdminUser(),
  });
};
