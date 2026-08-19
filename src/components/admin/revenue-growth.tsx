"use client"

import { useEffect, useMemo } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Badge } from "../ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useAdminRevenue } from "@/hooks/admin/useAdminRevenue"

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const currency = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
})

export function RevenueGrowth() {
  const { data, isLoading, fetchRevenue } = useAdminRevenue()

  useEffect(() => {
    fetchRevenue(12)
  }, [fetchRevenue])
  console.log("data:", data, "isLoading:", isLoading)

  const spansMultipleYears = useMemo(() => {
    const years = new Set((data?.months ?? []).map((m) => m.year))
    return years.size > 1
  }, [data])

  const chartData = useMemo(() => {
    return (data?.months ?? []).map((m) => ({
      label: spansMultipleYears ? `${m.month} '${String(m.year).slice(2)}` : m.month,
      revenue: m.revenue,
    }))
  }, [data, spansMultipleYears])

  const hasAnyRevenue = chartData.some((m) => m.revenue > 0)
  const growthPercent = data?.growth_percent
  const isPositive = (growthPercent ?? 0) >= 0

  if (isLoading) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Revenue Growth</CardTitle>
          <CardDescription>Monthly revenue performance tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-50 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Revenue Growth</CardTitle>
            <CardDescription>Monthly revenue performance tracking</CardDescription>
          </div>
          {growthPercent !== null && growthPercent !== undefined && (
            <Badge >
              {isPositive ? (
                <TrendingUpIcon className="size-3.5" aria-hidden="true" />
              ) : (
                <TrendingDownIcon className="size-3.5" aria-hidden="true" />
              )}
              {isPositive ? "+" : ""}
              {growthPercent}%
            </Badge>
          )}
        </div>

        {data && (
          <p className="text-2xl font-bold tabular-nums pt-1">
            {currency.format(data.total)}
            <span className="text-sm font-normal text-muted-foreground ml-1.5">
              sur {chartData.length} mois
            </span>
          </p>
        )}
      </CardHeader>

      <CardContent>
        {!data || chartData.length === 0 ? (
          <div className="flex h-50 items-center justify-center text-sm text-muted-foreground">
            Aucune donnée de revenu disponible
          </div>
        ) : !hasAnyRevenue ? (
          <div className="flex h-50 flex-col items-center justify-center gap-1 text-sm text-muted-foreground">
            <span>Aucun revenu sur cette période</span>
            <span className="text-xs">Les ventes apparaîtront ici dès le premier achat</span>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-50 w-full">
            <AreaChart accessibilityLayer data={chartData} margin={{ left: 0, right: 0 }}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval="preserveStartEnd"
              />
              <YAxis hide domain={[0, (max: number) => max * 1.15]} />
              <ChartTooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    className="min-w-40 gap-2.5"
                    formatter={(value) => (
                      <div className="flex w-full items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <div className="bg-chart-1 h-2.5 w-2.5 shrink-0 rounded-xs" />
                          <span className="text-muted-foreground">Revenue</span>
                        </div>
                        <span className="text-foreground font-semibold">
                          {currency.format(Number(value))}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Area
                dataKey="revenue"
                type="monotone"
                fill="url(#revenueFill)"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}