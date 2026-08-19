"use client"

import Link from "next/link"
import { ExternalLink } from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

type TopCourse = {
  id: number
  title: string
  status: string
  domain: string
  teacher: string
  enrollments: number
  revenue: number
}

interface TopCoursesCardProps {
  courses: TopCourse[] | null
  isLoading?: boolean
}

export function TopCoursesCard({ courses, isLoading }: TopCoursesCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Top Cours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Top Cours</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {courses && courses.length > 0 ? (
          <>
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between gap-3"
              >
                {/* Left side */}
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="bg-orange-500/10 text-orange-500 text-sm font-medium">
                      {course.title
                        .split(" ")
                        .slice(0, 2)
                        .map((w) => w[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {course.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {course.teacher} · {course.domain}
                    </p>
                  </div>
                </div>

                {/* Right side */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-sm font-semibold text-emerald-600 tabular-nums">
                    {course.revenue.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </span>
                  <Badge
                    variant="secondary"
                    className="text-[11px] font-normal bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
                  >
                    {course.enrollments} inscrit{course.enrollments > 1 ? "s" : ""}
                  </Badge>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              className="w-full mt-2"
              asChild
            >
              <Link href="/dashboard/admin/courses">
                <ExternalLink className="mr-2 h-4 w-4" />
                Voir tout
              </Link>
            </Button>
          </>
        ) : (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Aucun cours pour le moment
          </div>
        )}
      </CardContent>
    </Card>
  )
}