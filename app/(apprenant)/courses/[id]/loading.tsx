import React from 'react';
import { Separator } from '@/components/ui/separator';

// Un petit sous-composant local pour éviter les répétitions de div animés
const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded ${className}`} />
);

const LoadingCourseDetails = () => {
  return (
    <div className="min-h-screen">
      <div className="container flex flex-col md:flex-row mx-auto pt-4 gap-6">        
        {/* Colonne Gauche : Image Thumbnail */}
        <div className=" rounded-2xl h-128 w-full md:w-110 p-1 shrink-0">
          <Skeleton className="w-full h-full rounded-2xl" />
        </div>

        {/* Colonne Droite : Infos du cours */}
        <div className="flex-1 bottom-2 left-0 right-0 p-6 md:p-10 z-10 w-full">
          {/* Titre principal */}
          <Skeleton className="h-6 w-3/4 mb-6 rounded-lg" />

          {/* Section Titre 1 : Description */}
          <div className="mt-4">
            <Skeleton className="h-5 w-40 mb-2" />
            <div className="flex gap-1 mb-2">
              <Skeleton className="h-2 w-24 rounded-full" />
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-2 w-2 rounded-full" />
            </div>
          </div>

          {/* Bloc de texte Description */}
          <div className="rounded-lg mt-4 p-4 border border-gray-100 space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>

          {/* Section Titre 2 : Informations */}
          <div className="mt-8">
            <Skeleton className="h-6 w-40 mb-2" />
            <div className="flex gap-1">
              <Skeleton className="h-2 w-24 rounded-full" />
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-2 w-2 rounded-full" />
            </div>
          </div>

          {/* Grille des spécifications (Rows 1, 2, 3) */}
          <div className="mt-4 px-8 space-y-4">
            {/* Row 1 */}
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-4/5" />
            </div>
            <Separator orientation="horizontal" className="my-2 bg-gray-100" />
            
            {/* Row 2 */}
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-2/3" />
            </div>
            <Separator orientation="horizontal" className="my-2 bg-gray-100" />
            
            {/* Row 3 */}
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>

          {/* Zone du Bouton d'action de fin */}
          <div className="mt-8 pb-4">
            <Skeleton className="h-10 w-full sm:w-56 rounded-xl" />
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoadingCourseDetails;