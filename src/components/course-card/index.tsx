'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export interface CourseCardProps {
  course: {
    id: string | number;
    title: string;
    slug: string;
    thumbnail?: string | null;
    is_free: boolean;
    price?: number | string;
    teacher?: string | { name: string } | null;
    level?: string;
    language?: string;
    domain?: string | { name: string };
    domain_slug?: string;
  };
}

export const CourseCard = ({ course }: CourseCardProps) => {
  // Gestion sécurisée des formats de données imbriquées ou simples
  const teacherName = typeof course.teacher === 'object' && course.teacher !== null 
    ? course.teacher.name 
    : course.teacher || 'Anonyme';

  const domainName = typeof course.domain === 'object' && course.domain !== null 
    ? course.domain.name 
    : course.domain || 'Général';

  const formattedLanguage = course.language ? course.language.toUpperCase() : 'FR';

  return (
    <div className="group relative flex flex-col overflow-hidden bg-white border border-gray-100 rounded-2xl transition-all duration-300 hover:shadow-md hover:border-orange-200">
      
      {/* ─── IMAGE CONTENEUR (Aspect Ratio 16/9 Constant) ─── */}
      <div className="relative w-full aspect-video overflow-hidden bg-gray-50 shrink-0">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BookOpen className="h-8 w-8 text-gray-300" />
          </div>
        )}

        {/* Badge Prix avec effet de découpe */}
        <div className="absolute top-0 left-0 z-10">
          <div 
            className="bg-orange-500 px-5 py-1.5 text-xs font-bold text-white shadow-sm"
            style={{
              clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)",
              paddingRight: course.is_free ? "3.5rem" : "2rem",
            }}
          >
            {course.is_free ? 'Gratuit' : `${course.price} €`}
          </div>
        </div>
        
        {/* Overlay d'action au survol */}
        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center z-10">
          <Link 
            href={`/courses/${course.slug}`} 
            className="rounded-xl bg-orange-500 hover:bg-orange-600 px-5 py-2.5 text-xs font-bold text-white transition-all transform translate-y-2 group-hover:translate-y-0"
          >
            Voir le cours
          </Link>
        </div>
      </div>

      {/* ─── CORPS DE LA CARTE ─── */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Titre avec hauteur verrouillée pour aligner les grilles */}
          <h4 className="mb-1 text-sm font-bold leading-tight text-gray-950 line-clamp-2 h-10 group-hover:text-orange-500 transition-colors">
            {course.title}
          </h4>
          
          <p className="mb-3 text-xs text-gray-400 font-medium">
            Par {teacherName}
          </p>
        </div>

        {/* Badges de métadonnées */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-gray-50">
          {/* Niveau */}
          <span className="rounded-lg bg-gray-50 px-2.5 py-1 text-[10px] font-bold text-gray-600 capitalize">
            {course.level === "beginner" ? "Débutant" : course.level === "intermediate" ? "Intermédiaire" : "Avancé"}
          </span>

          {/* Langue */}
          <span className="rounded-lg bg-gray-50 px-2.5 py-1 text-[10px] font-bold text-gray-600">
            {formattedLanguage}
          </span>

          {/* Domaine cliquable */}
          {course.domain_slug && (
            <Link 
              href={`/domains/${course.domain_slug}`} 
              className="rounded-lg bg-orange-50/50 hover:bg-orange-50 px-2.5 py-1 text-[10px] font-extrabold text-orange-600 transition-colors"
            >
              {domainName}
            </Link>
          )}
        </div>
      </div>

    </div>
  );
};