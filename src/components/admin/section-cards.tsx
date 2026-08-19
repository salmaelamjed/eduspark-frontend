"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { DashboardStats, GrowthMetric } from "@/types/Admin.types";
import DashboardSkeleton from "../../../app/dashboard/skeletonDash";

interface SectionCardsProps {
  stats: DashboardStats | null;
  isLoading?: boolean;
}

/**
 * Formate un nombre en devise. Ajuste `currency`/`locale` selon ton marché
 * (ex: "EUR" / "fr-FR" si tu factures en euros).
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

/**
 * Badge de tendance. Le pourcentage vient TOUJOURS du backend
 * (voir AdminController::growthMetric) — ce composant ne fait que
 * choisir l'icône/couleur en fonction du signe, jamais de calcul.
 *
 * Si `growth_percent` est `null` (pas de donnée sur la période précédente),
 * on affiche "Nouveau" plutôt qu'un pourcentage inventé.
 */
function TrendBadge({ metric }: { metric: GrowthMetric }) {
  if (metric.growth_percent === null) {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        Nouveau
      </Badge>
    );
  }

  const isPositive = metric.growth_percent >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;
  const sign = isPositive ? "+" : "";

  return (
    <Badge variant="outline">
      <Icon className={isPositive ? "text-green-500" : "text-red-500"} />
      {sign}
      {metric.growth_percent}%
    </Badge>
  );
}

function TrendFooterLine({ metric, label }: { metric: GrowthMetric; label: string }) {
  if (metric.growth_percent === null) {
    return (
      <div className="line-clamp-1 flex items-center gap-2 font-medium">
        {label}
      </div>
    );
  }

  const isPositive = metric.growth_percent >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="line-clamp-1 flex items-center gap-2 font-medium">
      {label}
      <Icon className={`size-4 ${isPositive ? "text-green-500" : "text-red-500"}`} />
    </div>
  );
}

export function SectionCards({ stats, isLoading }: SectionCardsProps) {
  if (isLoading || !stats) {
    return <DashboardSkeleton/>;
  }

  const { finance, users, courses, trends } = stats;

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-orange-500/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs sm:grid-cols-2 xl:grid-cols-4 m-0 dark:*:data-[slot=card]:bg-card">
      {/* Total Revenue */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(finance.total_revenue)}
          </CardTitle>
          <CardAction>
            <TrendBadge metric={trends.revenue} />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <TrendFooterLine
            metric={trends.revenue}
            label={
              trends.revenue.growth_percent !== null && trends.revenue.growth_percent >= 0
                ? "Trending up this month"
                : "Trending down this month"
            }
          />
          <div className="text-muted-foreground">Revenus des 30 derniers jours</div>
        </CardFooter>
      </Card>

      {/* New Customers (sur les 30 derniers jours) */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>New Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatNumber(trends.new_users.current)}
          </CardTitle>
          <CardAction>
            <TrendBadge metric={trends.new_users} />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <TrendFooterLine
            metric={trends.new_users}
            label={
              trends.new_users.growth_percent !== null && trends.new_users.growth_percent >= 0
                ? "Croissance des inscriptions"
                : "Acquisition needs attention"
            }
          />
          <div className="text-muted-foreground">Nouveaux comptes (30 derniers jours)</div>
        </CardFooter>
      </Card>

      {/* Active Accounts — total cumulatif, pas de tendance sans table de snapshots */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Accounts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatNumber(users.active)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-muted-foreground">
              {formatNumber(users.inactive)} inactifs
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {users.students} étudiants · {users.teachers} formateurs
          </div>
          <div className="text-muted-foreground">Sur {users.total} comptes au total</div>
        </CardFooter>
      </Card>

      {/* Published Courses */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Published Courses</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatNumber(courses.published)}
          </CardTitle>
          <CardAction>
            <TrendBadge metric={trends.new_courses} />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <TrendFooterLine
            metric={trends.new_courses}
            label={
              trends.new_courses.growth_percent !== null &&
              trends.new_courses.growth_percent >= 0
                ? "Nouveaux cours ce mois-ci"
                : "Publication en baisse"
            }
          />
          <div className="text-muted-foreground">
            {courses.draft} brouillons · {courses.archived} archivés
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}