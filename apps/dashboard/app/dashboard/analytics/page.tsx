'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from 'recharts'
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"
import { API } from "@/api/axios"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface AnalyticsData {
  currentPlan: {
    name: string
    limits: {
      maxStreamingMinutesPerDay: number
      maxStorageBytes: number
      maxPlatformConnections: number
    }
  }
  usageData: Array<{
    date: string
    streamingMinutes: number
    storageUsedBytes: number
    platformsConnected: number
  }>
}

const chartConfig = {
  streamingMinutes: {
    label: "Minutes",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const formatBytes = (bytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
}

const formatMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${minutes}m`
}

const calculateUsagePercentage = (used: number, limit: number) => {
  if (limit === -1) return -1 // Unlimited
  return Math.min((used / limit) * 100, 100)
}

const UsageProgress = ({ used, limit, type }: { used: number, limit: number, type: 'minutes' | 'storage' | 'platforms' }) => {
  const percentage = calculateUsagePercentage(used, limit)
  const formatValue = (value: number) => {
    switch (type) {
      case 'minutes':
        return formatMinutes(value)
      case 'storage':
        return formatBytes(value)
      case 'platforms':
        return value.toString()
    }
  }

  return (
    <div className="space-y-2">
      <Progress value={percentage === -1 ? 100 : percentage} className={percentage === -1 ? "bg-green-200" : ""} />
      <p className="text-xs text-muted-foreground">
        {percentage === -1
          ? "Unlimited"
          : `${formatValue(used)} / ${formatValue(limit)}`}
      </p>
    </div>
  )
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await API.get('subscriptions/analytics')
        console.log("Analytics data:", res.data)
        setAnalyticsData(res.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return <div className="flex-1 p-8">Loading analytics data...</div>
  }

  if (error) {
    return <div className="flex-1 p-8 text-red-500">Error: {error}</div>
  }

  if (!analyticsData) {
    return <div className="flex-1 p-8">No analytics data available</div>
  }

  const todayUsage = analyticsData.usageData[0]

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Subscription Usage Analytics</h2>
        <div className="text-sm text-muted-foreground">
          {analyticsData.currentPlan.name} Plan
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Streaming Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatMinutes(todayUsage.streamingMinutes)}
            </div>
            <UsageProgress
              used={todayUsage.streamingMinutes}
              limit={analyticsData.currentPlan.limits.maxStreamingMinutesPerDay}
              type="minutes"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Storage Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatBytes(todayUsage.storageUsedBytes)}
            </div>
            <UsageProgress
              used={todayUsage.storageUsedBytes}
              limit={analyticsData.currentPlan.limits.maxStorageBytes}
              type="storage"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Connected Platforms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todayUsage.platformsConnected}
            </div>
            <UsageProgress
              used={todayUsage.platformsConnected}
              limit={analyticsData.currentPlan.limits.maxPlatformConnections}
              type="platforms"
            />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="streaming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="streaming">Streaming Usage</TabsTrigger>
          <TabsTrigger value="storage">Storage Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="streaming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Streaming Minutes Usage</CardTitle>
              <CardDescription>Daily streaming usage over the last {analyticsData.usageData.length || 0} days</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ChartContainer config={chartConfig}>
                    <AreaChart data={analyticsData.usageData}>
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => formatMinutes(value as number)}
                      />

                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Area
                        type="monotone"
                        dataKey="streamingMinutes"
                        stroke="#2563eb"
                        fill="#3b82f6"
                        fillOpacity={0.2}
                      />

                      <Line
                        dataKey="desktop"
                        type="natural"
                        stroke="var(--color-desktop)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </AreaChart>
                  </ChartContainer>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Storage Usage Trend</CardTitle>
              <CardDescription>Storage usage over time</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ChartContainer config={chartConfig}>
                    <LineChart data={analyticsData.usageData}>
                      <XAxis dataKey="date" tickLine={false} axisLine={false} />
                      <YAxis tickFormatter={(value) => formatBytes(value)} tickLine={false} />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Line
                        type="monotone"
                        dataKey="storageUsedBytes"
                        stroke="#2563eb"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ChartContainer>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
