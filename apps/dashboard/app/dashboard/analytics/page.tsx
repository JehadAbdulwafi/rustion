'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts'
import { Progress } from "@/components/ui/progress"

// Sample data - Replace with actual data from your API
const last30DaysData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
  streamingMinutes: Math.floor(Math.random() * 300),
  storageUsed: Math.floor(Math.random() * 1024 * 1024 * 1024), // Random GB in bytes
  platforms: Math.floor(Math.random() * 5)
}))

// Sample user plan - Replace with actual user's plan
const userPlan = {
  name: "Pro",
  limits: {
    MaxStreamingMinutesPerDay: 720,
    MaxStorageBytes: -1, // Unlimited
    MaxPlatformConnections: 5
  }
}

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
  const todayUsage = last30DaysData[last30DaysData.length - 1]
  
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Subscription Usage Analytics</h2>
        <div className="text-sm text-muted-foreground">
          {userPlan.name} Plan
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
              limit={userPlan.limits.MaxStreamingMinutesPerDay}
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
              {formatBytes(todayUsage.storageUsed)}
            </div>
            <UsageProgress 
              used={todayUsage.storageUsed}
              limit={userPlan.limits.MaxStorageBytes}
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
              {todayUsage.platforms}
            </div>
            <UsageProgress 
              used={todayUsage.platforms}
              limit={userPlan.limits.MaxPlatformConnections}
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
              <CardDescription>Daily streaming usage over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={last30DaysData}>
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(value) => formatMinutes(value)} />
                    <Tooltip formatter={(value) => formatMinutes(value as number)} />
                    <Area 
                      type="monotone" 
                      dataKey="streamingMinutes"
                      stroke="#2563eb"
                      fill="#3b82f6"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
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
                  <LineChart data={last30DaysData}>
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(value) => formatBytes(value)} />
                    <Tooltip formatter={(value) => formatBytes(value as number)} />
                    <Line 
                      type="monotone" 
                      dataKey="storageUsed"
                      stroke="#2563eb"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}