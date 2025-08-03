import api from "@/lib/utils";

export function postKakaoMessage(formData: FormData) {
  return api.post("/api/kakao", formData);
}
