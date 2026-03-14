import { useCourseContent } from '@/hooks/courses/useCourseContent'
import { createContext, useContext } from 'react'

export const CourseContentContext = createContext<ReturnType<typeof useCourseContent> | null>(null)

export const useSharedCourseContent = () => {
  const ctx = useContext(CourseContentContext)
  if (!ctx) throw new Error("Missing CourseContentContext")
  return ctx
}