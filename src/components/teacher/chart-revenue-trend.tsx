"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

interface RevenueTrendPoint {
  date: string
  amount: number
}

interface ChartRevenueTrendProps {
  data: RevenueTrendPoint[]
  growthPct: number | null
  periodLabel: string
}

const chartConfig = {
  amount: {
    label: "Revenus",
    color: "#f97316", // orange-500 (principale)
  },
} satisfies ChartConfig

export function ChartRevenueTrend({
  data,
  growthPct,
  periodLabel,
}: ChartRevenueTrendProps) {
  const hasGrowth = growthPct !== null
  const isPositive = (growthPct ?? 0) >= 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution des revenus</CardTitle>
        <CardDescription>{periodLabel}</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-62.5 w-full">
            <AreaChart accessibilityLayer data={data}>
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-amount)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-amount)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#fed7aa" /* orange-200, secondaire */ />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => format(new Date(value), "dd MMM", { locale: fr })}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    labelFormatter={(value) =>
                      format(new Date(value), "dd MMMM yyyy", { locale: fr })
                    }
                    formatter={(value) =>
                      `${Number(value).toLocaleString("fr-FR")} MAD`
                    }
                  />
                }
              />
              <Area
                dataKey="amount"
                type="natural"
                fill="url(#fillRevenue)"
                stroke="var(--color-amount)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex h-62.5 items-center justify-center text-muted-foreground">
            Aucune donnée disponible
          </div>
        )}
      </CardContent>
      {hasGrowth && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            {isPositive ? (
              <>
                En hausse de {growthPct}% <TrendingUp className="h-4 w-4 text-orange-500" />
              </>
            ) : (
              <>
                En baisse de {Math.abs(growthPct!)}% <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </>
            )}
          </div>
          <div className="leading-none text-muted-foreground">
            Par rapport à la période précédente
          </div>
        </CardFooter>
      )}
    </Card>
  )
}