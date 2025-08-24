import axios, { type AxiosError, type AxiosResponse } from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const api = axios.create({
  baseURL: "/",
});

// api.interceptors.request.use((config) => {
//   if (typeof window !== 'undefined') {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.set('Authorization', `Bearer ${token}`);
//     }
//   }
//   return config;
// });

api.interceptors.response.use(
  <T>(response: AxiosResponse<T>): T => response.data,
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export function formatDateToTZ(date: Date) {
  return date.toISOString().replace("T", " ").replace("Z", "+00");
}

export function sanitizeFilename(filename: string) {
  return filename
    .split(".")
    .slice(0, -1)
    .join(".")
    .replace(/[^\w\s-.]/g, "") // 영문/숫자/공백/하이픈/마침표 외 문자 제거
    .replace(/\s+/g, "-") // 공백을 하이픈으로
    .replace(/-+/g, "-") // 연속 하이픈을 하나로
    .replace(/^-+|-+$/g, "") // 앞/뒤 하이픈 제거
    .substring(0, 200); // 길이 제한
}

export default api;
