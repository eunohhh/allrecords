import type { User } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  QUERY_KEY_ADMIN_DESCS,
  QUERY_KEY_ADMIN_RECORDS,
  QUERY_KEY_USER,
} from "@/constants/allrecords.consts";
import { formatDateToTZ } from "@/lib/utils";
import type {
  Desc,
  DescsParams,
  Record,
  RecordPost,
  RecordsParams,
} from "@/types/allrecords.types";
import {
  deleteAdminDescs,
  deleteAdminRecords,
  getAdminDescs,
  getAdminRecords,
  getLastNumber,
  getUser,
  postAdminDescs,
  postAdminRecords,
  postAdminToken,
  putAdminDescs,
  putAdminRecords,
  updateRecordsOrder,
} from "../apis/admin.apis";

export const useAdminRecordsQuery = (params: RecordsParams) => {
  return useQuery<Record[], Error>({
    queryKey: [QUERY_KEY_ADMIN_RECORDS, params.category],
    queryFn: () => getAdminRecords(params),
  });
};

export const useAdminRecordsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Record, Error, RecordPost>({
    mutationFn: (data) => {
      if (!data.category || !data.slug) {
        throw new Error("Invalid data");
      }

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("slug", data.slug);
      formData.append("created_at", data.created_at);
      formData.append("updated_at", data.updated_at);
      formData.append("number", data.number.toString());

      // thumbnail은 File인 경우에만 FormData에 추가 (새로 업로드하는 경우)
      if (data.thumbnail && data.thumbnail instanceof File) {
        formData.append("thumbnail", data.thumbnail);
      }

      const imagesInfo = data.images.map((image) => ({
        id: image.id,
        desc: image.desc,
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
    mutationFn: ({ id, data }) => {
      if (!data.category || !data.slug) {
        throw new Error("Invalid data");
      }

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("slug", data.slug);
      formData.append("created_at", data.created_at);
      formData.append("updated_at", formatDateToTZ(new Date()));
      formData.append("number", data.number.toString());

      // thumbnail 처리: File인 경우만 FormData에 추가, string인 경우 기존 URL 유지
      if (data.thumbnail && data.thumbnail instanceof File) {
        formData.append("thumbnail", data.thumbnail);
      } else if (typeof data.thumbnail === "string") {
        formData.append("thumbnailUrl", data.thumbnail);
      }

      const imagesInfo = data.images.map((image) => ({
        id: image.id,
        desc: image.desc,
        url: image.url ?? null,
        file: null,
      }));

      formData.append("imagesInfo", JSON.stringify(imagesInfo));

      data.images.forEach((image) => {
        if (image.file) {
          formData.append("images", image.file);
        }
      });

      return putAdminRecords(id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_ADMIN_RECORDS] });
    },
  });
};

export const useAdminRecordsReorderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    { message: string },
    Error,
    {
      activeId: string;
      overId: string;
      activeCategory: string;
      oldIndex: number;
      newIndex: number;
    }
  >({
    mutationFn: (params) => updateRecordsOrder(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_ADMIN_RECORDS] });
    },
  });
};

export const useLastNumberQuery = (category: string) => {
  return useQuery<
    { lastNumber: number; nextNumber: number; category: string },
    Error
  >({
    queryKey: [QUERY_KEY_ADMIN_RECORDS, "lastNumber", category],
    queryFn: () => getLastNumber(category),
    enabled: !!category,
  });
};

export const useAdminUserQuery = () => {
  return useQuery<User, Error>({
    queryKey: [QUERY_KEY_USER],
    queryFn: () => getUser(),
  });
};

export const useAdminDescsQuery = (params: DescsParams) => {
  return useQuery<Desc[], Error>({
    queryKey: [QUERY_KEY_ADMIN_DESCS],
    queryFn: () => getAdminDescs(params),
  });
};

export const useAdminDescMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Desc, Error, Desc>({
    mutationFn: (data) => postAdminDescs(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_ADMIN_DESCS] });
    },
  });
};

export const useAdminDescsDeleteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Desc[], Error, string[]>({
    mutationFn: (ids) => deleteAdminDescs({ ids }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_ADMIN_DESCS] });
    },
  });
};

export const useAdminDescsPutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Desc[], Error, { id: string; data: Desc }>({
    mutationFn: ({ id, data }) => putAdminDescs(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_ADMIN_DESCS] });
    },
  });
};

export const useAdminTokenMutation = () => {
  return useMutation<{ message: string }, Error, User>({
    mutationFn: (user) => postAdminToken(user),
  });
};
