import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"

import { Input } from '@/components/ui/input'
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
import { ImagePicker } from '@/components/ui/image-picker'

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

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  id: string
  title: string
  description: string
  thumbnail: string
}

export function UpdateInfoDialog({ open, onOpenChange, id, title, description, thumbnail }: ConfirmDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false)

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
    setLoading(true)
    try {
      await updateStream(id, data);
      toast({
        title: "Success",
        description: "Stream info updated successfully",
      });

      onOpenChange(false)
      router.refresh();
    } catch (error) {
      console.log("submitPartnerRequestForm", error);
      toast({
        title: "Error",
        description: "Failed to update stream info",
        variant: "destructive",
      });
    } finally {
      setLoading(false)
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Update Stream Info
          </DialogTitle>
          <DialogDescription>Update stream name and description</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col mt-2 gap-3">
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
            </div>

            <DialogFooter className="mt-4">
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)} disabled={loading}>
                Cancel
              </Button>
              <Button variant="destructive" type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
