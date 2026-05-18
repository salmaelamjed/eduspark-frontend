'use client'; 

import { useParams } from 'next/navigation';
import { useCourseDetail } from '@/hooks/courses/use-course'; 
 import LoadingCourseDetails from './loading';
import Image from 'next/image';
import { BarChart2, Book, BookOpen, CalendarDays, Globe, Languages, Quote, UserCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';

const CourseDetails = () => {
  const params = useParams();
  const courseId = params.id as string;
  const router = useRouter();
  
  const { course, loading, error } = useCourseDetail(courseId);

  if (loading) return <LoadingCourseDetails/>;
   const totalLessons = course?.modules?.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0) || 0;
  const totalModules = course?.modules?.length || 0;

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gray-950">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Erreur</h2>
          <p className="text-gray-300">{error || 'الدورة غير موجودة'}</p>
        </div>
      </div>
    );
  }
  // ✅ Handler du bouton
  const handleEnroll = () => {
    if (course.is_free) {
      router.push(`/courses/${courseId}/read`);
    } else {
      router.push(`/courses/${courseId}/subscribe`);
    }
  };

  return (
      <div className="container flex  mx-auto pt-4 gap-6">
       <div className='border rounded-2xl  h-128 w-110'>
       {course.thumbnail ? (
  <div className="relative w-full h-128 rounded-2xl overflow-hidden">
    <Image
      src={course.thumbnail}
      alt={course.title}
      fill
      sizes="(max-width: 768px) 100vw, 800px"
      className="object-cover"
      priority
    />
  </div>
) : (
  <div className="w-full  h-128 rounded-2xl bg-muted flex items-center justify-center">
    <BookOpen className="w-16 h-16 text-muted-foreground" />
  </div>
)}

       </div>
       <div className=' bottom-2 left-0 right-0 p-6 md:p-10 z-10'>
        <h1 className="text-2xl  font-bold leading-tight">
              {course.title}
            </h1>

            <div className="mt-4 sm:w-auto" aria-label="Section titre des cours">
          <div>
            <h2 className="flex gap-2 text-xl sm:text-xl font-medium text-foreground">
             <Quote className='w-6 h-6 text-orange-500 '/> Description  
            </h2>
          </div>
          <div className="flex gap-1 mt-1 mb-2" aria-hidden="true">
            <span className="h-2 w-8 sm:w-24 rounded-full bg-orange-500" />
            <span className="h-2 w-2 rounded-full bg-orange-400" />
            <span className="h-2 w-2 rounded-full bg-orange-300" />
            <span className="h-2 w-2 rounded-full bg-orange-200" />
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg mt-4 text-medium p-2 text-gray-600">{course.description}</div>
        <div className="mt-4 sm:w-auto" aria-label="Section titre des cours">
          <div>
            <h2 className="flex gap-2 text-xl sm:text-xl font-medium text-foreground">
             <Quote className='w-6 h-6 text-orange-500 '/> Informations  
            </h2>
          </div>
          <div className="flex gap-1 mt-1" aria-hidden="true">
            <span className="h-2 w-8 sm:w-24 rounded-full bg-orange-500" />
            <span className="h-2 w-2 rounded-full bg-orange-400" />
            <span className="h-2 w-2 rounded-full bg-orange-300" />
            <span className="h-2 w-2 rounded-full bg-orange-200" />
          </div>
        </div>
      <div className='mt-4 px-8'>
        {/* Row 1 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex gap-2 items-center">
            <Globe className="w-4 h-4 text-orange-500 shrink-0" />
            <span className="text-orange-400 font-bold">Domaine :</span>
            <span className="text-gray-700">{course.domain?.name}</span>
          </div>
          <div className="flex gap-2 items-center">
            <UserCircle className="w-4 h-4 text-orange-500 shrink-0" />
            <span className="text-orange-400 font-bold">Présenté par :</span>
            <span className="text-gray-700">{course.teacher?.name}</span>
          </div>
        </div>
        <Separator orientation='horizontal' className='my-2 bg-gray-200' />
        {/* Row 2 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex gap-2 items-center">
            <Languages className="w-4 h-4 text-orange-500 shrink-0" />
            <span className="text-orange-400 font-bold">Langue :</span>
            <span className="text-gray-700">{ course.language}</span>
          </div>
          <div className="flex gap-2 items-center">
            <BarChart2 className="w-4 h-4 text-orange-500 shrink-0" />
            <span className="text-orange-400 font-bold">Niveau :</span>
            <span className="text-gray-700">{course.level}</span>
          </div>
        </div>
        <Separator orientation='horizontal' className='my-2 bg-gray-200' />
        {/* Row 3 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex gap-2 items-center">
            <BookOpen className="w-4 h-4 text-orange-500 shrink-0" />
            <span className="text-orange-400 font-bold">Contenu :</span>
            <span className="text-gray-700">{totalModules} modules · {totalLessons} leçons</span>
          </div>
          <div className="flex gap-2 items-center">
            <CalendarDays className="w-4 h-4 text-orange-500 shrink-0" />
            <span className="text-orange-400 font-bold">Publié le :</span>
            <span className="text-gray-700">
              {new Date(course.created_at).toLocaleDateString("fr-FR", {
                day: "numeric", month: "long", year: "numeric"
              })}
            </span>
          </div>
        </div>
    </div>
       <div className="mt-8 pb-4">
          <Button
        onClick={handleEnroll}
        className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-5 rounded-xl transition-all hover:cursor-pointer"
      >
        {course.is_free ? "Commencer gratuitement" : "S'inscrire au cours"}
      </Button>
        </div>
       </div>
      </div>
  );
};

export default CourseDetails;