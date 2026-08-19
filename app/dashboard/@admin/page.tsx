'use client'

import React, { useEffect } from 'react'
import { SectionCards } from '@/components/admin/section-cards'
import TransactionsCard from '@/components/admin/TransactionsCard'
import { useAdminDashboard } from '@/hooks/admin/useAdminDashboard'
import { TotalCours } from '@/components/admin/chart-cours'
import { useAuth } from '@/context/auth-context'
import { RevenueGrowth } from '@/components/admin/revenue-growth'
import { cn } from '@/lib/utils'
import { useTopCourses } from '@/hooks/admin/useAdminTopCours'
import { TopCoursesCard } from '@/components/admin/top-cours'
import { Bell, FileOutput, Upload } from 'lucide-react'


function AnimateIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <div
      className={cn(
        "animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-500 ease-out",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

const Page = () => {
  const { stats, isLoading, fetchStats } = useAdminDashboard()
  const { token } = useAuth()
  const { courses, loading } = useTopCourses({
    limit: 5,
    by: 'revenue'
  });
  console.log(courses)
  useEffect(() => {
    if (token) {
      fetchStats()
    }
  }, [fetchStats, token])

  return (
    <div className="w-full max-w-400 mx-auto   ">
      <AnimateIn delay={0} className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Tableau de bord
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Visualisez les résultats, optimisez la réussite
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="px-4 flex gap-2 py-2 items-center  bg-transparent hover:bg-muted hover:cursor-pointer border text-gray-900 text-sm font-medium rounded-lg  transition-colors">
              <Upload className='size-4'/>
              Exporter
            </button>
          </div>
        </div>
      </AnimateIn>

      <AnimateIn delay={75} className="mb-4 sm:mb-6">
        <SectionCards stats={stats} isLoading={isLoading} />
      </AnimateIn>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <AnimateIn delay={150} className="lg:col-span-7">
          <RevenueGrowth />
        </AnimateIn>

        <AnimateIn delay={225} className="md:col-span-1 lg:col-span-5">
          <TotalCours />
        </AnimateIn>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6 mb-4 sm:mb-6">
  {/* Transactions - un peu plus large */}
  <AnimateIn delay={300} className="lg:col-span-7 h-full">
    <TransactionsCard />
  </AnimateIn>

  {/* Top Cours */}
  <AnimateIn delay={375} className="lg:col-span-5 h-full">
    <TopCoursesCard
      courses={courses}
      isLoading={loading}
    />
  </AnimateIn>
</div>

    
    </div>
  )
}

export default Page