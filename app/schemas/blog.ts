import z from "zod";

export const postSchema = z.object({
  title: z.string().min(5).max(30),
  content: z.string().min(10).max(500),
  image: z.instanceof(File),
})
