import axios, { type AxiosError, type AxiosResponse } from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Record } from "@/types/allrecords.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const api = axios.create({
  baseURL: "/",
});

api.interceptors.response.use(
  <T>(response: AxiosResponse<T>): T => response.data,
  (error: AxiosError<{ error?: string; message?: string }>) => {
    // 서버에서 보낸 에러 메시지 추출
    const serverMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "알 수 없는 오류가 발생했습니다.";

    const customError = new Error(serverMessage);
    return Promise.reject(customError);
  }
);

export default api;

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

export function shuffleArray(array: Record[]) {
  const newArray = array.slice(); // 원본 배열 복제
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // 0부터 i까지의 랜덤 인덱스
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // 요소 교환 (ES6 구조 분해 할당)
  }
  return newArray;
}
