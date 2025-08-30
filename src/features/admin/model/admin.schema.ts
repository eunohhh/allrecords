import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  category: z.array(z.enum(["poolsoop", "ilsang", "grim"])),
  slug: z.string().min(1),
  keywords: z
    .array(z.string().max(5, "키워드는 최대 5자까지 입력할 수 있습니다"))
    .max(3, "키워드는 최대 3개까지 추가할 수 있습니다"),
  images: z.array(
    z.object({
      id: z.number(),
      file: z.instanceof(File).optional().nullable(),
      url: z.string().optional(),
      desc: z.string(),
    })
  ),
  number: z.number().min(1),
  thumbnail: z
    .union([z.string(), z.instanceof(File)])
    .optional()
    .nullable(),
});
