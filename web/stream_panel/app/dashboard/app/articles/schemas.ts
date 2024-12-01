import * as z from "zod"

const baseArticleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  image: z.string().min(1, "Image is required"),
  description: z.string().min(1, "Description is required"),
  content: z.string().min(1, "Content is required"),
  tags: z.array(z.string())
})

export const createArticleSchema = baseArticleSchema

export const updateArticleSchema = baseArticleSchema.extend({
  id: z.string()
})

export type CreateArticle = z.infer<typeof createArticleSchema>
export type UpdateArticle = z.infer<typeof updateArticleSchema>

// For backward compatibility
export const articleSchema = baseArticleSchema
