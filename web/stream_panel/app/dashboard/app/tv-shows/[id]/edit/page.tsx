"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { withHydration } from "@/components/hoc/with-hydration"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getTvShow, updateTvShow } from "@/api/TvShowApi"

const tvShowSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  genre: z.string().min(1, "Genre is required"),
})

type FormData = z.infer<typeof tvShowSchema>

function EditTvShowPage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(tvShowSchema),
    defaultValues: {
      title: "",
      description: "",
      genre: "",
    }
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getTvShow(params.id as string)
        form.reset({
          title: data.tv_show.title,
          description: data.tv_show.description,
          genre: data.tv_show.genre,
        })
      } catch (error) {
        console.error("Failed to load TV show data:", error)
        // router.push("/dashboard/app/tv-shows")
      }
    }

    loadData()
  }, [params.id, form, router])

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true)
      const imageUrl = "https://picsum.photos/350/200"
      await updateTvShow(params.id as string, data.title, data.description, imageUrl, data.genre)
      router.push("/dashboard/app/tv-shows")
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/app/tv-shows">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit TV Show</h1>
          <p className="text-sm text-muted-foreground">
            Update your TV show details
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>TV Show Details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter TV show title" {...field} />
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
                        placeholder="Enter TV show description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genre</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter TV show genre"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Link href="/dashboard/app/tv-shows">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update TV Show"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  )
}

export default withHydration(EditTvShowPage)
