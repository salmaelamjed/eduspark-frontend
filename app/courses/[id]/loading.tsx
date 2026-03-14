import React from 'react';

const LoadingCourseDetails = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section Skeleton */}
      <div className="bg-linear-to-r from-orange-600 to-orange-500">
        <div className="container px-4 py-12 md:py-16">
          <div className="max-w-4xl">
            {/* Fil d'Ariane Skeleton */}
            <div className="h-4 w-64 bg-white/20 rounded mb-6 animate-pulse" />
            
            {/* Badges Skeleton */}
            <div className="flex gap-3 mb-4">
              <div className="h-8 w-24 bg-white/20 rounded-full animate-pulse" />
              <div className="h-8 w-24 bg-white/20 rounded-full animate-pulse" />
            </div>

            {/* Titre Skeleton */}
            <div className="h-12 w-3/4 bg-white/20 rounded mb-4 animate-pulse" />
            
            {/* Description Skeleton */}
            <div className="space-y-2 mb-6">
              <div className="h-4 w-full bg-white/20 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-white/20 rounded animate-pulse" />
            </div>

            {/* Métadonnées Skeleton */}
            <div className="flex gap-6">
              <div className="h-4 w-24 bg-white/20 rounded animate-pulse" />
              <div className="h-4 w-24 bg-white/20 rounded animate-pulse" />
              <div className="h-4 w-24 bg-white/20 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal Skeleton */}
      <div className="container px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonne principale Skeleton */}
          <div className="lg:col-span-2 space-y-8">
            {/* Miniature Skeleton */}
            <div className="aspect-video bg-gray-200 rounded-xl animate-pulse" />

            {/* Sections Skeleton */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="h-6 w-48 bg-gray-200 rounded mb-4 animate-pulse" />
                <div className="space-y-3">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-4/6 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* Colonne latérale Skeleton */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="h-10 w-32 bg-gray-200 rounded mb-6 animate-pulse" />
              <div className="space-y-3">
                <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
                <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingCourseDetails;