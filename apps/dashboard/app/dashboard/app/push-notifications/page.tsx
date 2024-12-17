"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { withHydration } from "@/components/hoc/with-hydration"
import { Plus, Send } from "lucide-react"
import { useEffect, useState } from "react"
import {
  type PushNotification,
  getPushNotifications,
  sendPushNotification,
  deletePushNotification,
  createPushNotification,
} from "@/api/PushNotificationApi"
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"
import { toast } from "sonner"
import { format } from "date-fns"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  body: z
    .string()
    .min(1, "Body is required")
    .max(500, "Body must be less than 500 characters"),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
})

function PushNotificationCard({
  notification,
  onSend,
  onDelete,
  onReuse,
}: {
  notification: PushNotification
  onSend: () => void
  onDelete: () => void
  onReuse: () => void
}) {
  const [sendDialogOpen, setSendDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{notification.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{notification.body}</p>
              {notification.image && (
                <img
                  src={notification.image}
                  alt={notification.title}
                  className="mt-2 h-32 w-auto rounded-md object-cover"
                />
              )}
            </div>
            <div className="flex items-center gap-2">
              {notification.status === "draft" && (
                <>
                  <ConfirmDialog
                    open={sendDialogOpen}
                    onOpenChange={setSendDialogOpen}
                    title="Send Push Notification"
                    description="Are you sure you want to send this notification to all users?"
                    // @ts-ignore
                    onConfirm={onSend}
                  />
                  <Button
                    variant="outline"
                    onClick={() => setSendDialogOpen(true)}
                  >
                    Send
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                onClick={onReuse}
              >
                Reuse
              </Button>
              <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete Push Notification"
                description="Are you sure you want to delete this notification? This action cannot be undone."
                // @ts-ignore
                onConfirm={onDelete}
              />
              <Button
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div>
              Created: {format(new Date(notification.created_at), "MMM d, yyyy")}
            </div>
            {notification.sent_at && (
              <div>
                Sent: {format(new Date(notification.sent_at), "MMM d, yyyy")}
              </div>
            )}
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${notification.status === "sent"
                  ? "bg-green-500"
                  : notification.status === "failed"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                  }`}
              />
              <span className="capitalize">{notification.status}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PushNotificationsPage() {
  const [notifications, setNotifications] = useState<PushNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [sendLoading, setSendLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      body: "",
      image: "",
    },
  })

  const loadNotifications = async () => {
    try {
      const data = await getPushNotifications()
      setNotifications(data)
    } catch (error) {
      console.error("Failed to load notifications:", error)
      toast.error("Failed to load notifications")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setSendLoading(true)
      const notification = await createPushNotification(values)
      await sendPushNotification(notification.id)
      toast.success("Push notification sent successfully")
      form.reset()
      loadNotifications()
    } catch (error) {
      console.error("Failed to send push notification:", error)
      toast.error("Failed to send push notification")
    } finally {
      setSendLoading(false)
    }
  }

  const handleSend = async (notification: PushNotification) => {
    try {
      await sendPushNotification(notification.id)
      toast.success("Notification sent successfully")
      loadNotifications()
    } catch (error) {
      console.error("Failed to send notification:", error)
      toast.error("Failed to send notification")
    }
  }

  const handleDelete = async (notification: PushNotification) => {
    try {
      await deletePushNotification(notification.id)
      toast.success("Notification deleted successfully")
      loadNotifications()
    } catch (error) {
      console.error("Failed to delete notification:", error)
      toast.error("Failed to delete notification")
    }
  }

  const handleReuse = (notification: PushNotification) => {
    form.setValue("title", notification.title)
    form.setValue("body", notification.body)
    if (notification.image) {
      form.setValue("image", notification.image)
    }
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Push Notifications</h1>
        <p className="text-sm text-muted-foreground">
          Send push notifications to your users
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Send New Notification</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Notification title"
                          {...field}
                          disabled={sendLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          {...field}
                          disabled={sendLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What would you like to say?"
                        {...field}
                        disabled={sendLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={sendLoading}>
                  <Send className="mr-2 h-4 w-4" />
                  {sendLoading ? "Sending..." : "Send Notification"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* <div>
        <h2 className="text-lg font-semibold mb-4">Notification History</h2>
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-muted-foreground">Loading notifications...</div>
          </div>
        ) : notifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-8">
              <h3 className="text-lg font-semibold">No notifications yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Send your first push notification using the form above
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {notifications.map((notification) => (
              <PushNotificationCard
                key={notification.id}
                notification={notification}
                onSend={() => handleSend(notification)}
                onDelete={() => handleDelete(notification)}
                onReuse={() => handleReuse(notification)}
              />
            ))}
          </div>
        )}
      </div>
      */}
    </div>
  )
}

export default withHydration(PushNotificationsPage)
