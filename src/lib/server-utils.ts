import axios, { AxiosError, AxiosResponse } from "axios";
import { PUBLIC_URL } from "@/constants/allrecords.consts";
import { createClient } from "./supabase/server";

export async function getUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return data.user;
}

const serverApi = axios.create({
  baseURL: PUBLIC_URL ?? process?.env?.NEXT_PUBLIC_VERCEL_URL ?? "/",
});

serverApi.interceptors.response.use(
  <T>(response: AxiosResponse<T>): T => response.data,
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default serverApi;
