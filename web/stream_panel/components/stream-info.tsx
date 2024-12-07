import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { updateStream } from '@/api/LiveApi'
import { ImagePicker } from './ui/image-picker'

const formSchema = z.object({
  liveTitle: z
    .string()
    .min(1, { message: "fullName_required" }),
  liveDescription: z
    .string().nullish(),
  thumbnail: z
    .string().nullish(),
});

type FormValues = z.infer<typeof formSchema>

export default function StreamInfo({ id, title, description, thumbnail }: { id: string, title?: string, description?: string, thumbnail?: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const defaultValues: Partial<FormValues> = {
    liveTitle: title || "",
    liveDescription: description || "",
    thumbnail: thumbnail || null,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const onSubmit = async (data: FormValues) => {
    try {
      await updateStream(id, data);
      toast({
        title: "Success",
        description: "Stream info updated successfully",
      });
      router.refresh();
    } catch (error) {
      console.log("submitPartnerRequestForm", error);
      toast({
        title: "Error",
        description: "Failed to update stream info",
        variant: "destructive",
      });
    }
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="flex flex-1 flex-col pb-0 mb-0">
          <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
              <CardTitle>Stream Info</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col mt-2 gap-3">
            <ImagePicker
              defaultImage={defaultValues.thumbnail}
              onImageChange={(url) => form.setValue("thumbnail", url)}
              placeholder='Upload a thumbnail'
            />
            <FormField
              control={form.control}
              name="liveTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your stream title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="liveDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your stream description" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <CardFooter className="flex justify-end p-0">
              <Button type="submit">update</Button>
            </CardFooter>
          </CardContent>
        </Card>

      </form>
    </Form>
  )
}

