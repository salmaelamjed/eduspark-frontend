"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  BookOpen,
  Users,
  DollarSign,
  GraduationCap,
  Star,
  RefreshCcw,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { useTeacherDashboard } from "@/hooks/teacher/use-dashboard";
import { ChartRevenueTrend } from "@/components/teacher/chart-revenue-trend"
import { ChartEnrollmentTrend } from "@/components/teacher/chart-enrollment-trend"
import DashboardSkeleton from "../skeletonDash";

type Period = 7 | 30 | 90 | 365;



const formatNumber = (value: number | undefined | null): string => {
  if (value === undefined || value === null) return "0";
  return value.toLocaleString("fr-FR");
};

const formatChange = (value: number | undefined | null): string => {
  if (value === undefined || value === null) return "0%";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value}%`;
};

export default function TeacherDashboardPage() {
  const [period, setPeriod] = useState<Period>(30);
  const { data, isLoading, error, refetch } = useTeacherDashboard({ period });

  const periodOptions = [
    { value: 7, label: "7 derniers jours" },
    { value: 30, label: "30 derniers jours" },
    { value: 90, label: "3 derniers mois" },
    { value: 365, label: "Cette année" },
  ];

  const periodLabel = periodOptions.find((o) => o.value === period)?.label ?? "";


  if (error) {
    return (
      <Alert variant="destructive" className="m-6">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Utiliser directement les données du backend
  const overview = data?.overview;
  const bestSellingCourses = data?.best_selling_courses || [];
  const mostPopularCourses = data?.most_popular_courses || [];
  const enrollmentTrend = data?.enrollment_trend || [];
  const revenueTrend = data?.revenue_trend || [];
  const recentEnrollments = data?.recent_enrollments || [];
  const recentSales = data?.recent_sales || [];
  const topStudents = data?.top_students || [];

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Tableau de bord
          </h1>
          <p className="text-muted-foreground mt-2">
            {"Vue d'ensemble de vos cours et performances"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select
            value={String(period)}
            onValueChange={(value) => setPeriod(Number(value) as Period)}
          >
            <SelectTrigger className="w-45">
              <SelectValue placeholder="Sélectionner une période" />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* KPIs Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <DashboardSkeleton/>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Revenus totaux
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {overview?.total_earnings} EURO
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatChange(overview?.earnings_growth_pct)} vs période précédente
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total inscriptions
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(overview?.total_enrollments)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatChange(overview?.enrollments_growth_pct)} vs période précédente
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Étudiants
                </CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(overview?.total_students)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatNumber(overview?.period_enrollments)} nouveaux inscrits
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Cours publiés
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(overview?.published_courses)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Sur {formatNumber(overview?.total_courses)} cours
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
       <ChartRevenueTrend
          data={revenueTrend}
          growthPct={overview?.earnings_growth_pct ?? null}
          periodLabel={periodLabel}
        />
        <ChartEnrollmentTrend
          data={enrollmentTrend}
          growthPct={overview?.enrollments_growth_pct ?? null}
          periodLabel={periodLabel}
        /> 
      </div>

      {/* Best Selling & Most Popular Courses */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Best Selling Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Cours les plus vendus
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : bestSellingCourses.length > 0 ? (
              <div className="space-y-4">
                {bestSellingCourses.map((course, index) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-muted-foreground">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="font-medium">{course.title || "Sans titre"}</p>
                        <p className="text-sm text-muted-foreground">
                          {course.total_earned} EURO
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatNumber(course.sales_count)} ventes
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-24 flex items-center justify-center text-muted-foreground">
                Aucune donnée disponible
              </div>
            )}
          </CardContent>
        </Card>

        {/* Most Popular Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Cours les plus populaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : mostPopularCourses.length > 0 ? (
              <div className="space-y-4">
                {mostPopularCourses.map((course, index) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-muted-foreground">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="font-medium">{course.title || "Sans titre"}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatNumber(course.enrollments_count)} inscriptions
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-24 flex items-center justify-center text-muted-foreground">
                Aucune donnée disponible
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Enrollments & Sales */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Enrollments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Inscriptions récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : recentEnrollments.length > 0 ? (
              <div className="space-y-4 max-h-100 overflow-y-auto">
                {recentEnrollments.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {enrollment.student_name || "Étudiant inconnu"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {enrollment.course_title || "Cours inconnu"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {enrollment.enrolled_at && (
                        <p className="text-sm">
                          {format(
                            new Date(enrollment.enrolled_at),
                            "dd MMM yyyy",
                            { locale: fr }
                          )}
                        </p>
                      )}
                      {enrollment.status && (
                        <span
                          className={`text-xs px-4 py-1 rounded-full ${
                            enrollment.status === "paid"
                              ? "bg-green-100 text-green-700"
                              : enrollment.status === "free"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {enrollment.status === "completed"
                            ? "Terminé"
                            : enrollment.status === "active"
                            ? "Actif"
                            : enrollment.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-24 flex items-center justify-center text-muted-foreground">
                Aucune inscription récente
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Ventes récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : recentSales.length > 0 ? (
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {recentSales.map((sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {sale.course_title || "Cours inconnu"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {sale.student_name || "Étudiant inconnu"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">
                        {sale.amount} EURO
                      </p>
                      {sale.purchased_at && (
                        <p className="text-sm text-muted-foreground">
                          {format(
                            new Date(sale.purchased_at),
                            "dd MMM yyyy",
                            { locale: fr }
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-24 flex items-center justify-center text-muted-foreground">
                Aucune vente récente
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Students */}
      {topStudents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5" />
              Meilleurs étudiants
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-3">
                {topStudents.map((studentData, index) => {
                  const student = studentData.student;
                  return (
                    <div
                      key={student.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
                    >
                      <div className="relative">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-lg font-bold text-primary">
                            {student.name ? student.name.charAt(0) : "?"}
                          </span>
                        </div>
                        {index < 3 && (
                          <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-yellow-500 flex items-center justify-center">
                            <Star className="h-3 w-3 text-white fill-current" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{student.name || "Inconnu"}</p>
                        <p className="text-sm text-muted-foreground">
                          {student.email || ""}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm">
                            {formatNumber(studentData.purchases_count)} achats
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {studentData.total_spent}  EURO dépensés
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Last Updated */}
      {data?.generated_at && (
        <p className="text-sm text-muted-foreground text-center">
          Dernière mise à jour :{" "}
          {format(new Date(data.generated_at), "dd MMMM yyyy 'à' HH:mm", {
            locale: fr,
          })}
        </p>
      )}
    </div>
  );
}