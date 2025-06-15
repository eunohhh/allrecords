import {
  QUERY_KEY_ADMIN_RECORDS,
  QUERY_KEY_USER,
} from "@/constants/allrecords.consts";
import type {
  Record,
  RecordPost,
  RecordsParams,
} from "@/types/allrecords.types";
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
  return useMutation<Record, Error, RecordPost>({
    mutationFn: (data) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("slug", data.slug);
      formData.append("created_at", data.created_at);
      formData.append("updated_at", data.updated_at);

      const imagesInfo = data.images.map((image) => ({
        id: image.id,
        description: image.description,
      }));
      formData.append("imagesInfo", JSON.stringify(imagesInfo));

      data.images.forEach((image) => {
        if (image.file) {
          formData.append("images", image.file);
        }
      });

      return postAdminRecords(formData);
    },
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
  return useMutation<Record[], Error, { id: string; data: RecordPost }>({
    mutationFn: ({ id, data }) => putAdminRecords(id, data),
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
