"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type StreamViewers = {
  date: string
  viewers: number
}

const chartConfig = {
  views: {
    label: "Viewers",
  },
  last30Days: {
    label: "Last 30 Days",
    color: "hsl(var(--chart-1))",
  },
  last3Months: {
    label: "Last 3 Months",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function OverviewBar({ data }: { data: StreamViewers[] }) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("last30Days")

  // Aggregate monthly data from the raw data
  const aggregateMonthlyData = (data: StreamViewers[]) => {
    const monthlyMap = data.reduce((acc, curr) => {
      const date = new Date(curr.date)
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`
      acc.set(monthKey, (acc.get(monthKey) || 0) + curr.viewers)
      return acc
    }, new Map<string, number>())

    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

    return Array.from(monthlyMap).map(([key, value]) => ({
      date: `${key}-01`,
      viewers: value,
    })).filter(entry => {
      const entryDate = new Date(entry.date)
      return entryDate >= threeMonthsAgo
    })
  }

  // Get display data based on active chart
  const displayData = React.useMemo(() => {
    if (activeChart === "last30Days") {
      return data.slice(-30)
    }
    return aggregateMonthlyData(data)
  }, [data, activeChart])

  // Use latest data for last 30 days total
  const totals = React.useMemo(() => ({
    last30Days: data.slice(-30).reduce((acc, curr) => acc + curr.viewers, 0),
    last3Months: aggregateMonthlyData(data).reduce((acc, curr) => acc + curr.viewers, 0),
  }), [data])

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Viewers Overview</CardTitle>
          <CardDescription>
            Showing viewers for the selected time range
          </CardDescription>
        </div>
        <div className="flex">
          {(["last30Days", "last3Months"] as const).map((chart) => (
            <button
              key={chart}
              data-active={activeChart === chart}
              className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
              onClick={() => setActiveChart(chart)}
            >
              <span className="text-xs text-muted-foreground">
                {chartConfig[chart].label}
              </span>
              <span className="text-lg font-bold leading-none sm:text-3xl">
                {totals[chart].toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={displayData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return activeChart === "last30Days"
                  ? date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  : date.toLocaleDateString("en-US", { month: "short" })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    const date = new Date(value)
                    return activeChart === "last30Days"
                      ? date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                      : date.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })
                  }}
                />
              }
            />
            <Bar
              dataKey="viewers"
              fill={chartConfig[activeChart].color}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
