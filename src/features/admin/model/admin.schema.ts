import { z } from "zod";
import type { Category } from "@/types/allrecords.types";

export const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.array(z.enum(["poolsoop", "ilsang", "grim"])),
  slug: z.string().min(1),
  images: z.array(
    z.object({
      id: z.number(),
      file: z.instanceof(File).optional().nullable(),
      url: z.string().optional(),
      desc: z.string(),
    })
  ),
  number: z.number().min(1),
});
