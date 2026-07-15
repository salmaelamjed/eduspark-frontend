'use client'; 

import { useParams } from 'next/navigation';
import { useCourseDetail } from '@/hooks/courses/use-course'; 
import LoadingCourseDetails from './loading';
import Image from 'next/image';
import { BarChart2, BookOpen, Globe, Languages, Quote, UserCircle, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { CourseCard } from '@/components/course-card';
import { useCourseAccess } from '@/hooks/courses/use-course-access';

export interface BookData {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  is_free: boolean;
  price: number;
  teacher: {
    name: string;
  };
  level: "beginner" | "intermediate" | "advanced";
  language: string;
  domain: {
    name: string;
  };
  domain_slug: string;
}

export const MOCK_BOOKS: BookData[] = [
  {
    id: "book-5",
    title: "UX Design : Concevoir des Interfaces que Vos Utilisateurs Vont Adorer",
    slug: "ux-design-interfaces-utilisateurs",
    thumbnail: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80",
    is_free: false,
    price: 19.99,
    teacher: { name: "Amélie Roux" },
    level: "beginner",
    language: "fr",
    domain: { name: "Design & UI" },
    domain_slug: "design-ui"
  },
  {
    id: "book-6",
    title: "Sécurité des Applications Web : Le Guide de Survie de l'OWASP",
    slug: "securite-applications-web-owasp",
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
    is_free: false,
    price: 45.00,
    teacher: { name: "Damien Vautier" },
    level: "advanced",
    language: "fr",
    domain: { name: "Cybersécurité" },
    domain_slug: "cybersecurite"
  },
  {
    id: "book-7",
    title: "Le Guide du SEO pour Développeurs Next.js / React",
    slug: "seo-pour-developpeurs-nextjs",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    is_free: false,
    price: 15.00,
    teacher: { name: "Thomas Morel" },
    level: "intermediate",
    language: "fr",
    domain: { name: "Marketing Digital" },
    domain_slug: "marketing-digital"
  },
  {
    id: "book-8",
    title: "Construire des APIs RESTful Robustes avec NestJS",
    slug: "apis-restful-robustes-nestjs",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    is_free: false,
    price: 24.99,
    teacher: { name: "Alexandre Dupont" },
    level: "intermediate",
    language: "en",
    domain: { name: "Développement Web" },
    domain_slug: "developpement-web"
  }
];

const CourseDetails = () => {
  const params = useParams();
  const courseId = params.id as string;
  const router = useRouter();
  
  const { course, loading, error } = useCourseDetail(courseId);
  const { access, loading: accessLoading } = useCourseAccess(course?.id ?? null);

  if (loading) return <LoadingCourseDetails />;
  
  if (error || !course) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-white bg-gray-950 rounded-3xl">
        <div className="text-center p-8 bg-gray-900 rounded-2xl border border-gray-800 max-w-md mx-4">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Erreur</h2>
          <p className="text-gray-300">{error || 'الدورة غير موجودة'}</p>
          <Button 
            onClick={() => router.push('/courses')}
            className="mt-6 bg-orange-500 hover:bg-orange-600 text-white"
          >
            Retour aux cours
          </Button>
        </div>
      </div>
    );
  }

  const handleEnroll = () => {
  if (course.is_free || access?.has_access) {
    router.push(`/cours/${courseId}/read`); 
  } else {
    router.push(`/cours/${courseId}/checkout`); 
  }
};

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">

      <div className="flex flex-col lg:flex-row gap-6 items-stretch h-[78vh] mb-10">
        
        {/* Colonne Gauche : Image de couverture */}
        <div className="w-full lg:w-95 xl:w-105 shrink-0 flex">
          <div className="relative w-full lg:h-full rounded-3xl overflow-hidden shadow-md border border-gray-100 bg-gray-50 flex-1">
            {course.thumbnail ? (
              <Image
                src={course.thumbnail}
                alt={course.title}
                fill
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover transition-transform duration-500 hover:scale-102"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <BookOpen className="w-16 h-16 text-gray-300" />
                <span className="text-xs text-gray-400">Aucun visuel disponible</span>
              </div>
            )}
            
            {/* Badge Prix */}
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-orange-500 text-white text-xs font-black uppercase px-4 py-2 rounded-full shadow-lg">
                {course.is_free ? 'Gratuit' : `${course.price} €`}
              </span>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Contenu de la fiche technique */}
        <div className="flex-1 w-full rounded-3xl sm:p-8 border border-gray-100 flex flex-col justify-between">
          
          <div>
            {/* Titre Principal */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 leading-tight tracking-tight line-clamp-2">
              {course.title}
            </h1>

            {/* Section Description */}
            <div className="mt-6">
              <div className="flex items-center gap-2">
                <Quote className="w-4 h-4 text-orange-500 shrink-0" />
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Description</h2>
              </div>
              <div className="flex gap-1 mt-1.5 mb-2.5" aria-hidden="true">
                <span className="h-1 w-12 rounded-full bg-orange-500" />
                <span className="h-1 w-1.5 rounded-full bg-orange-400" />
                <span className="h-1 w-1.5 rounded-full bg-orange-300" />
              </div>
              
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-xs sm:text-sm text-gray-600 leading-relaxed max-h-25 overflow-y-auto scrollbar-thin">
                {course.description || "Aucune description fournie pour ce cours."}
              </div>
            </div>

            {/* Section Informations Complémentaires */}
            <div className="mt-6">
              <div className="flex items-center gap-2">
                <Quote className="w-4 h-4 text-orange-500 shrink-0" />
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Informations clés</h2>
              </div>
              <div className="flex gap-1 mt-1.5 mb-3" aria-hidden="true">
                <span className="h-1 w-12 rounded-full bg-orange-500" />
                <span className="h-1 w-1.5 rounded-full bg-orange-400" />
                <span className="h-1 w-1.5 rounded-full bg-orange-300" />
              </div>

              {/* Grille d'informations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs sm:text-sm">
                
                {/* Domaine */}
                <div className="flex items-center gap-2.5 py-0.5">
                  <div className="p-1.5 rounded-lg bg-orange-50 text-orange-500 shrink-0">
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium leading-none mb-0.5">Domaine</p>
                    <p className="text-gray-900 font-semibold leading-tight">{course.domain?.name || 'Général'}</p>
                  </div>
                </div>

                {/* Formateur */}
                <div className="flex items-center gap-2.5 py-0.5">
                  <div className="p-1.5 rounded-lg bg-orange-50 text-orange-500 shrink-0">
                    <UserCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium leading-none mb-0.5">Présenté par</p>
                    <p className="text-gray-900 font-semibold leading-tight">{course.teacher?.name || 'Anonyme'}</p>
                  </div>
                </div>

                {/* Langue */}
                <div className="flex items-center gap-2.5 py-0.5">
                  <div className="p-1.5 rounded-lg bg-orange-50 text-orange-500 shrink-0">
                    <Languages className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium leading-none mb-0.5">Langue</p>
                    <p className="text-gray-900 font-semibold uppercase leading-tight">{course.language || 'FR'}</p>
                  </div>
                </div>

                {/* Niveau */}
                <div className="flex items-center gap-2.5 py-0.5">
                  <div className="p-1.5 rounded-lg bg-orange-50 text-orange-500 shrink-0">
                    <BarChart2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium leading-none mb-0.5">Niveau requis</p>
                    <p className="text-gray-900 font-semibold capitalize leading-tight">{course.level || 'Tous niveaux'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Separator className="my-4 bg-gray-100" />

            {/* Bouton d'action principal */}
            <div className="pt-1">
              <Button 
              onClick={handleEnroll} disabled={accessLoading} 
              className='bg-orange-500 hover:bg-orange-400 hover:cursor-pointer'
              >
                {course.is_free || access?.has_access
                  ? "Continuer le cours"
                  : "S'inscrire au cours"}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </div>

        </div>
      </div>

      <div className="mt-12">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider">Découvrez {"d'autres"} cours</h2>
        </div>
        
        <div className="flex gap-1 mt-1.5 mb-6" aria-hidden="true">
          <span className="h-1 w-12 rounded-full bg-orange-500" />
          <span className="h-1 w-1.5 rounded-full bg-orange-400" />
          <span className="h-1 w-1.5 rounded-full bg-orange-400" />
          <span className="h-1 w-1.5 rounded-full bg-orange-400" />
          <span className="h-1 w-1.5 rounded-full bg-orange-300" />
        </div>

        {/* Grille responsive affichant les faux livres */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {MOCK_BOOKS.map((book) => (
            <CourseCard key={book.id} course={book} />
          ))}
        </div>
      </div>

    </div>
  );
};

export default CourseDetails;