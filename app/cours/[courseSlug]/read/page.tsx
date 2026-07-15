'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useCourseDetailBySlug } from '@/hooks/courses/use-course';
import { ModuleReadSidebar } from '@/components/read-sidebar';
import { FileText } from 'lucide-react';
import LessonContent from '@/components/lesson/lesson-content';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from '@/components/ui/separator';
import BotWindow from '@/components/chatbot/window';
import Loading from './loading';
import { buildQuizNumberMap } from '@/lib/quiz-numbering';
import { useCourseAccess } from '@/hooks/courses/use-course-access';

const Page = () => {
  const params = useParams();
    const courseId = params.courseSlug  as string;
      const router = useRouter();
    

  const {course, loading, error } = useCourseDetailBySlug(courseId);
  const { access, loading: accessLoading } = useCourseAccess(course?.id ?? null);

  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});

  const handleToggleExpand = useCallback((moduleId: number) => {
    setExpandedModules((prev) => ({ ...prev, [moduleId]: !(prev[moduleId] ?? true) }));
  }, []);

  const handleSelectLesson = useCallback((moduleId: number, lessonId: number) => {
    setSelectedModuleId(moduleId);
    setSelectedLessonId(lessonId);
  }, []);

  const quizNumberMap = useMemo(() => buildQuizNumberMap(course), [course]);

useEffect(() => {
  if (!accessLoading && course && !course.is_free && access && !access.has_access) {
    router.replace(`/cours/${courseId}/checkout`);
  }
}, [accessLoading, access, course, courseId, router]);
  useEffect(() => {
    if (loading || !course) return;
  }, [course, loading, selectedLessonId]);

  if (loading) return <Loading/>;
  if (error || !course) return <div className="p-8">Erreur</div>;

  const modulesWithExpand = course.modules?.map((mod) => ({
    ...mod,
    isExpanded: expandedModules[mod.id] ?? true,
  })) ?? [];

  const selectedLesson = modulesWithExpand
    .flatMap(m => m.lessons)
    .find(l => {
      const lessonId = String(l.id);
      const selectedId = String(selectedLessonId);
      return lessonId === selectedId;
    }) ?? null;

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <aside className="shrink-0">
        <ModuleReadSidebar
          modules={modulesWithExpand}
          selectedModuleId={selectedModuleId}
          selectedLessonId={selectedLessonId}
          courseTitle={course.title}
          onSelectModule={setSelectedModuleId}
          onSelectLesson={handleSelectLesson}
          onToggleExpand={handleToggleExpand}
        />
      </aside>

      <main className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="mx-auto mt-4">
          {selectedLesson ? (
            <ScrollArea className="h-screen w-full p-4">
              <LessonContent 
                lesson={selectedLesson} 
                courseSlug={course.slug} 
                quizNumberMap={quizNumberMap}
              />
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center text-muted-foreground gap-3">
              <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center">
                <FileText className="w-8 h-8 text-orange-400" />
              </div>
              <p className="font-medium text-gray-700">Sélectionnez une leçon pour commencer</p>
              <p className="text-sm text-gray-400">Choisissez un module dans la barre latérale</p>
            </div>
          )}
        </div>
      </main>
      <Separator orientation="vertical" />
      <aside className="shrink-0 w-90">
        <BotWindow/>
      </aside>
    </div>
  );
};

export default Page;