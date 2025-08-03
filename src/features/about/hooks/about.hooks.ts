import { useMutation } from "@tanstack/react-query";
import { postKakaoMessage } from "../apis/about.apis";

export const useKakaoMessageMutation = () => {
  return useMutation<any, Error, FormData>({
    mutationFn: (formData) => postKakaoMessage(formData),
  });
};
