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

const formSchema = z.object({
  title: z
    .string()
    .min(1, { message: "fullName_required" }),
  description: z
    .string()
    .min(1, { message: "message_required" }),
});

type FormValues = z.infer<typeof formSchema>

export default function StreamInfo({ title, description }: { title?: string, description?: string }) {

  const defaultValues: Partial<FormValues> = {
    title: title || "",
    description: description || "",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const onSubmit = async (data: FormValues) => {
    try {
      // await submitContactForm(data);
    } catch (error) {
      console.log("submitPartnerRequestForm", error);
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
            <FormField
              control={form.control}
              name="title"
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your stream description" {...field} />
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

