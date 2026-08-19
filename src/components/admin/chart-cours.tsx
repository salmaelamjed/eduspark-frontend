"use client"

import { CSSProperties, useEffect, useMemo } from "react"
import { Label, Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useAdminDashboard } from "@/hooks/admin/useAdminDashboard"
import { Skeleton } from "@/components/ui/skeleton"

const chartConfig = {
  count: { label: "Cours" },
  published: { label: "Publiés", color: "var(--chart-1)" },
  draft: { label: "Brouillons", color: "var(--chart-2)" },
  archived: { label: "Archivés", color: "var(--chart-3)" },
} satisfies ChartConfig

export function TotalCours() {
  const { stats, isLoading, fetchStats } = useAdminDashboard()
  const courses = stats?.courses

    useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const chartData = useMemo(() => {
    if (!courses) return []

    return [
      {
        status: "published",
        count: courses.published ?? 0,
        fill: "var(--color-published)",
      },
      {
        status: "draft",
        count: courses.draft ?? 0,
        fill: "var(--color-draft)",
      },
      {
        status: "archived",
        count: courses.archived ?? 0,
        fill: "var(--color-archived)",
      },
    ].filter((item) => item.count > 0) // optionnel : cache les segments à 0
  }, [courses])

  const totalCourses = courses?.total ?? 0

  const publishedRate = useMemo(() => {
    if (totalCourses === 0) return 0
    return Math.round(((courses?.published ?? 0) / totalCourses) * 100)
  }, [courses, totalCourses])

  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="items-center pb-0">
          <CardTitle>Cours Status</CardTitle>
          <CardDescription>Répartition des cours</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center pb-6 pt-8">
          <Skeleton className="h-48 w-48 rounded-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Cours Status</CardTitle>
        <CardDescription>
          {totalCourses} cours au total
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        {totalCourses === 0 ? (
          <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
            Aucun cours pour le moment
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[280px]"
          >
            <PieChart accessibilityLayer>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="min-w-40 gap-2.5"
                    formatter={(value, name) => (
                      <div className="flex w-full items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <div
                            className="h-2.5 w-2.5 shrink-0 rounded-xs"
                            style={
                              {
                                backgroundColor: `var(--color-${name})`,
                              } as CSSProperties
                            }
                          />
                          <span className="text-muted-foreground">
                            {chartConfig[name as keyof typeof chartConfig]?.label || name}
                          </span>
                        </div>
                        <span className="text-foreground font-semibold tabular-nums">
                          {Number(value).toLocaleString()}
                        </span>
                      </div>
                    )}
                  />
                }
              />

              <ChartLegend
                content={<ChartLegendContent nameKey="status" />}
                className="-translate-y-2"
              />

              <Pie
                data={chartData}
                dataKey="count"
                nameKey="status"
                innerRadius={60}
                cornerRadius={5}
                paddingAngle={3}
                stroke="var(--background)"
                strokeWidth={3}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold tabular-nums"
                          >
                            {publishedRate}%
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 22}
                            className="fill-muted-foreground text-xs"
                          >
                            Publiés
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}