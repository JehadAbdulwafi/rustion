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
import { Label } from "@/components/ui/label"
import { ImagePicker } from "@/components/ui/image-picker"
import { useToast } from "@/hooks/use-toast"

const tvShowSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  genre: z.string().min(1, "Genre is required"),
  image: z.string().min(1, "Image is required"),
})

type FormData = z.infer<typeof tvShowSchema>

function EditTvShowPage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(tvShowSchema),
    defaultValues: {
      title: "",
      description: "",
      genre: "",
      image: undefined,
    }
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getTvShow(params.id as string)
        form.reset({
          title: data.title,
          description: data.description,
          genre: data.genre,
          image: data.image || "",
        })
      } catch (error) {
        console.error("Failed to load TV show data:", error)
        toast({
          variant: "destructive",
          description: "Failed to load TV show data.",
        })
      }
    }

    loadData()
  }, [params.id, form, router, toast])

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true)
      await updateTvShow(params.id as string, data.title, data.description, data.image, data.genre)
      toast({
        variant: "default",
        title: "Success",
        description: "TV show updated successfully",
      })
      router.push("/dashboard/app/tv-shows")
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        description: "Something went wrong.",
      })
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
            <CardContent className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input className="w-full" placeholder="Enter title" {...field} />
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
                          placeholder="Enter description"
                          className="resize-none w-full h-24"
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
                        <Input className="w-full" placeholder="Enter genre" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col">
                <Label className="mb-4">Image</Label>
                <div className="w-full">
                  <ImagePicker
                    onImageChange={(url) => {
                      form.setValue("image", url!)
                    }}
                    ratio={9 / 16}
                    placeholder="Drop your article cover image here"
                    defaultImage={form.watch("image")}
                  />
                </div>
              </div>
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
