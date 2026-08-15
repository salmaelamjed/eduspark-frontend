"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
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

interface EnrollmentTrendPoint {
  date: string
  count: number
}

interface ChartEnrollmentTrendProps {
  data: EnrollmentTrendPoint[]
  growthPct: number | null
  periodLabel: string
}

const chartConfig = {
  count: {
    label: "Inscriptions",
    color: "#f97316", // orange-500 (principale)
  },
} satisfies ChartConfig

export function ChartEnrollmentTrend({
  data,
  growthPct,
  periodLabel,
}: ChartEnrollmentTrendProps) {
  const hasGrowth = growthPct !== null
  const isPositive = (growthPct ?? 0) >= 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution des inscriptions</CardTitle>
        <CardDescription>{periodLabel}</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-62.5 w-full">
            <BarChart accessibilityLayer data={data}>
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
                    indicator="dashed"
                    labelFormatter={(value) =>
                      format(new Date(value), "dd MMMM yyyy", { locale: fr })
                    }
                  />
                }
              />
              <Bar dataKey="count" fill="var(--color-count)" radius={4} />
            </BarChart>
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