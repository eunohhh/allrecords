import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  slug: z.string().min(1),
  images: z.array(
    z.object({
      id: z.number(),
      file: z.instanceof(File).optional().nullable(),
      url: z.string().optional(),
      desc: z.string(),
    })
  ),
});
