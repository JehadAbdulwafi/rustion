"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { withHydration } from "@/components/hoc/with-hydration"
import { useEffect, useState } from "react"
import { getAppSettings, updateAppSettings } from "@/api/SettingsApi"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  app_icon_url: z.string().nullish().refine(
    (val) => !val || z.string().url().safeParse(val).success,
    "Must be a valid URL"
  ),
  splash_screen_url: z.string().nullish().refine(
    (val) => !val || z.string().url().safeParse(val).success,
    "Must be a valid URL"
  ),
  privacy_policy_url: z.string().nullish().refine(
    (val) => !val || z.string().url().safeParse(val).success,
    "Must be a valid URL"
  ),
  terms_url: z.string().nullish().refine(
    (val) => !val || z.string().url().safeParse(val).success,
    "Must be a valid URL"
  ),
  faqs_url: z.string().nullish().refine(
    (val) => !val || z.string().url().safeParse(val).success,
    "Must be a valid URL"
  ),
  forum_url: z.string().nullish().refine(
    (val) => !val || z.string().url().safeParse(val).success,
    "Must be a valid URL"
  ),
  contact_url: z.string().nullish().refine(
    (val) => !val || z.string().url().safeParse(val).success,
    "Must be a valid URL"
  ),
  support_url: z.string().nullish().refine(
    (val) => !val || z.string().url().safeParse(val).success,
    "Must be a valid URL"
  ),
  app_store_url: z.string().nullish().refine(
    (val) => !val || z.string().url().safeParse(val).success,
    "Must be a valid URL"
  ),
  play_store_url: z.string().nullish().refine(
    (val) => !val || z.string().url().safeParse(val).success,
    "Must be a valid URL"
  ),
  app_version: z.string().min(1, "Version is required").nullish(),
  force_update: z.boolean().default(false),
  maintenance_mode: z.boolean().default(false),
  maintenance_message: z.string().optional().nullish(),
})

function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      app_icon_url: "",
      splash_screen_url: "",
      privacy_policy_url: "",
      terms_url: "",
      support_url: "",
      app_store_url: "",
      play_store_url: "",
      app_version: "",
      force_update: false,
      maintenance_mode: false,
      maintenance_message: "",
    },
  })

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const app = await getAppSettings()
        console.log("Settings:", app)
        const appConfig = JSON.parse(app.config)

        form.reset(appConfig)
      } catch (error) {
        console.error("Failed to load settings:", error)
        toast({
          variant: "destructive",
          description: "Failed to load settings.",
        })
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setSaving(true)
      await updateAppSettings(values)
      toast({
        variant: "default",
        description: "saved successfully",
      })
    } catch (error) {
      console.error("Failed to save settings:", error)
      toast({
        variant: "destructive",
        description: "Failed to save",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">App Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure your mobile app settings
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="general">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="urls">URLs</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>App Assets</CardTitle>
                  <CardDescription>
                    Configure your app icon and splash screen
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="app_icon_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>App Icon URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://" {...field} />
                          </FormControl>
                          <FormDescription>
                            URL to your app icon (1024x1024 recommended)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="splash_screen_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Splash Screen URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://" {...field} />
                          </FormControl>
                          <FormDescription>
                            URL to your splash screen image
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="app_version"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>App Version</FormLabel>
                        <FormControl>
                          <Input placeholder="1.0.0" {...field} />
                        </FormControl>
                        <FormDescription>
                          Current version of your app
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="force_update"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Force Update
                          </FormLabel>
                          <FormDescription>
                            Force users to update to the latest version
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="urls" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>App URLs</CardTitle>
                  <CardDescription>
                    Configure various URLs for your app
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="privacy_policy_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Privacy Policy URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="terms_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Terms of Service URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="support_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Support URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="faqs_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>FAQs URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="forum_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Forum URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contact_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="app_store_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>App Store URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="play_store_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Play Store URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance Mode</CardTitle>
                  <CardDescription>
                    Configure maintenance mode settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="maintenance_mode"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Maintenance Mode
                          </FormLabel>
                          <FormDescription>
                            Enable maintenance mode for your app
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maintenance_message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maintenance Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="We're currently performing maintenance..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Message to display during maintenance
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default withHydration(SettingsPage)
