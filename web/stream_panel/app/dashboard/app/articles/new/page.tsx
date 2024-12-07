"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { withHydration } from "@/components/hoc/with-hydration"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getTags } from "@/api/TagApi"
import { useEffect, useState } from "react"
import TagSelector from "../components/tag-selector"
import Editor from "../components/editor"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { articleSchema } from "../schemas"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { createArticle } from "@/api/ArticleApi"
import { useRouter } from "next/navigation"
import { ImagePicker } from "@/components/ui/image-picker"
import { Label } from "@/components/ui/label"

type FormData = z.infer<typeof articleSchema>

function NewArticlePage() {
  const router = useRouter()
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      image: "",
      description: "",
      content: "",
      tags: []
    }
  })

  useEffect(() => {
    const loadTags = async () => {
      const fetchedTags = await getTags()
      setTags(fetchedTags)
    }
    loadTags()
  }, [])

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true)

      const tagsString = data.tags.join(',')
      await createArticle(data.title, data.description, data.image, data.content, tagsString)
      // TODO: Implement article creation
      router.push("/dashboard/app/articles")
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/app/articles">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Article</h1>
          <p className="text-sm text-muted-foreground">
            Create a new article for your blog
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Article Details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
            <Label>Image</Label>
              <div className="max-w-[400px]">
                <ImagePicker
                  onImageChange={(url) => {
                    form.setValue("image", url!)
                  }}
                  ratio={16 / 9}
                  placeholder="Drop your article cover image here"
                  defaultImage={form.watch("image")}
                />
              </div>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter article title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter article description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Editor
                        content={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <TagSelector
                        tags={tags}
                        selectedTags={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Link href="/dashboard/app/articles">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Article"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  )
}

export default withHydration(NewArticlePage)
