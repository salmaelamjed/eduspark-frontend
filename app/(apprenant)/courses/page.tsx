'use client'
import { CourseListFilters } from "@/api/courses";
import { UseGetCourses } from "@/hooks/courses/use-course";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import LoadingCourses from "./loading";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue  } from "@/components/ui/select";
import EmptyComponent from "@/components/empty/Empty";
import { Book, Filter, FolderOpen } from "lucide-react";
import { useGetDomains } from "@/hooks/domains/use-domain"

type FilterValue = string | number | boolean | undefined;
type FilterKey = keyof CourseListFilters;

const Page = () => {
  const [filters, setFilters] = useState<CourseListFilters>({ page: 1 });
  const [appliedFilters, setAppliedFilters] = useState<CourseListFilters>({ page: 1 });
  const { courses, loading, error, getCourses } = UseGetCourses(appliedFilters);
  const { domains, loading: loadingDomains } = useGetDomains();
  

  // ─── Gestion des changements de filtres avec typage correct ───
  const handleFilterChange = (key: FilterKey, value: FilterValue) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ─── Apply filters manually ───
  const handleApplyFilters = () => {
    setAppliedFilters({
      ...filters,
      page: 1, 
    });
    getCourses({
      ...filters,
      page: 1,
    });
  };

  // ─── Reset all filters ───
  const handleResetFilters = () => {
    const resetFilters: CourseListFilters = { page: 1 };
    setFilters(resetFilters);
    setAppliedFilters(resetFilters);
    getCourses(resetFilters);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > (courses?.last_page ?? 1)) return;
    
    setFilters((prev) => ({ ...prev, page: newPage }));
    setAppliedFilters((prev) => ({ ...prev, page: newPage }));
    getCourses({ ...appliedFilters, page: newPage });
  };

  const hasActiveFilters = (): boolean => {
    const { page, ...filterParams } = appliedFilters;
    return Object.values(filterParams).some((value): boolean => 
      value !== undefined && value !== '' && value !== 'all'
    );
  };

  return (
    <div className="px-4 mt-4 py-4">
          {/* Filtres */}
<div className=" flex flex-col md:flex-row flex-wrap items-stretch md:items-center justify-between gap-3 rounded-lg mb-6">
  
  {/* Title section */}
  <div className="w-full sm:w-auto">
    <h2 className="text-2xl sm:text-3xl font-medium text-foreground">Cours</h2>
    <div className="flex gap-1 mt-1" aria-hidden="true">
      <span className="h-2 w-8 sm:w-12 rounded-full bg-orange-500" />
      <span className="h-2 w-2 rounded-full bg-orange-400" />
      <span className="h-2 w-2 rounded-full bg-orange-300" />
      <span className="h-2 w-2 rounded-full bg-orange-200" />
    </div>
  </div>

  {/* Filter controls */}
  <div className="w-full md:flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
    
    {/* Domaine */}
    <div className="col-span-1">
      <Select
        onValueChange={(value) => handleFilterChange("domain", value === "all" ? undefined : value)}
        value={filters.domain}
      >
        <SelectTrigger className="w-full border-none bg-gray-100 rounded-full py-5 px-4 text-sm hover:bg-gray-200 focus:ring-2 focus:ring-orange-500 transition-colors">
          <SelectValue placeholder="Domaine" />
        </SelectTrigger>
        <SelectContent className="mt-2 max-h-72 overflow-y-auto" position="popper">
          <SelectGroup>
            <SelectLabel>Domaines</SelectLabel>
            <SelectItem value="all">Tous les domaines</SelectItem>
            {loadingDomains ? (
              <SelectItem value="loading" disabled>Chargement...</SelectItem>
            ) : !domains?.length ? (
              <div className="p-4 text-center">
                <EmptyComponent
                  icon={<FolderOpen className="w-6 h-6 text-gray-400 mx-auto mb-2" />}
                  title="Aucun domaine"
                  description="Aucun domaine trouvé"
                />
              </div>
            ) : (
              domains.map((domain) => (
                <SelectItem key={domain.id} value={domain.slug}>{domain.name}</SelectItem>
              ))
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>

    {/* Niveau */}
    <div className="col-span-1">
      <Select
        value={filters.level }
        onValueChange={(value) => handleFilterChange("level", value === "all" ? undefined : value)}
      >
        <SelectTrigger className="w-full border-none bg-gray-100 rounded-full py-5 px-4 text-sm hover:bg-gray-200 focus:ring-2 focus:ring-orange-500 transition-colors">
          <SelectValue placeholder="Niveau" />
        </SelectTrigger>
        <SelectContent className="mt-2" position="popper">
          <SelectGroup>
            <SelectItem value="all">Tous les niveaux</SelectItem>
            <SelectItem value="beginner">Débutant</SelectItem>
            <SelectItem value="intermediate">Intermédiaire</SelectItem>
            <SelectItem value="advanced">Avancé</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>

    {/* Date — FIXED: propres options au lieu de copier domaine */}
    <div className="col-span-1">
      <Select
      >
        <SelectTrigger className="w-full border-none bg-gray-100 rounded-full py-5 px-4 text-sm hover:bg-gray-200 focus:ring-2 focus:ring-orange-500 transition-colors">
          <SelectValue placeholder="Date" />
        </SelectTrigger>
        <SelectContent className="mt-2" position="popper">
          <SelectGroup>
            <SelectLabel>Trier par date</SelectLabel>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="-created_at">Plus récent</SelectItem>
            <SelectItem value="created_at">Plus ancien</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>

    {/* Prix */}
    <div className="col-span-1">
      <Select
        onValueChange={(value) => handleFilterChange("is_free", value === "all" ? undefined : value === "true")}
      >
        <SelectTrigger className="w-full border-none bg-gray-100 rounded-full py-5 px-4 text-sm hover:bg-gray-200 focus:ring-2 focus:ring-orange-500 transition-colors">
          <SelectValue placeholder="Prix" />
        </SelectTrigger>
        <SelectContent className="mt-2" position="popper">
          <SelectGroup>
            <SelectLabel>Prix</SelectLabel>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="true">Gratuit</SelectItem>
            <SelectItem value="false">Payant</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>

    {/* Prix min / max */}
    <div className="col-span-1 sm:col-span-2 grid grid-cols-2 gap-2">
      <Input
        type="number"
        min={0}
        value={filters.min_price ?? ""}
        onChange={(e) => handleFilterChange("min_price", e.target.value ? Number(e.target.value) : undefined)}
        className="w-full border-none bg-gray-100 rounded-full py-5 px-4 text-sm placeholder:text-gray-500 hover:bg-gray-200 focus:ring-2 focus:ring-orange-500 transition-colors"
        placeholder="Min €"
        aria-label="Prix minimum"
      />
      <Input
        type="number"
        min={0}
        value={filters.max_price ?? ""}
        onChange={(e) => handleFilterChange("max_price", e.target.value ? Number(e.target.value) : undefined)}
        className="w-full border-none bg-gray-100 rounded-full py-5 px-4 text-sm placeholder:text-gray-500 hover:bg-gray-200 focus:ring-2 focus:ring-orange-500 transition-colors"
        placeholder="Max €"
        aria-label="Prix maximum"
      />
    </div>
  </div>

  {/* Filter button */}
  <button
    onClick={handleApplyFilters}
    disabled={loading}
    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-orange-500 hover:bg-orange-600 px-6 py-4 sm:px-8 sm:py-3 text-sm font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 active:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <Filter className="h-4 w-4" />
    <span>Filtrer</span>
  </button>

</div>

      {/* Contenu principal */}
      {loading ? (
        <LoadingCourses />
      ) : error ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-xl font-medium text-gray-900">Une erreur est survenue</p>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => getCourses(appliedFilters)}
            className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Réessayer
          </button>
        </div>
      ) : !courses || courses?.data?.length === 0 ? (
        <div className="mt-8">
          <EmptyComponent 
            icon={<Book className="w-12 h-12 text-gray-400" />}
            title="Aucun cours trouvé"
            description={hasActiveFilters() 
              ? "Aucun cours ne correspond à vos critères de filtrage. Essayez de modifier vos filtres."
              : "Aucun cours n'est disponible pour le moment. Revenez plus tard !"
            }
          />
          {hasActiveFilters() && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleResetFilters}
                className="text-sm bg-orange-500 hover:bg-orange-400 cursor-pointer text-white font-bold rounded-md py-3 px-6"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Grille des cours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.data.map((course) => (
              <div key={course.id} className="group relative overflow-hidden border rounded-lg hover:shadow-xs">
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-gray-100">
                  {course.thumbnail ? (
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Book className="h-12 w-12 text-gray-400" />
                    </div>
                  )}

                  {/* Price/Label badge */}
                  <div className="absolute left-0 top-0">
                    <div 
                      className="bg-orange-500 px-5 py-1.5 text-xs font-bold text-white"
                      style={{
                        clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)",
                        paddingRight: course.is_free ? "4rem" : "2.5rem",
                      }}
                    >
                      {course.is_free ? 'Gratuit' : `${course.price} €`}
                    </div>
                  </div>
                    
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                    <Link 
                      href={`/courses/${course.slug}`} 
                      className="rounded-md bg-orange-500 hover:bg-orange-400 px-4 py-2 text-sm font-semibold text-white transition-colors"
                    >
                      Voir le cours
                    </Link>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="mb-2 line-clamp-2 text-sm font-bold leading-tight text-gray-900">
                    {course.title}
                  </h3>
                  <p className="mb-3 text-xs text-gray-600">{course.teacher}</p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700">
                      {course.level === "beginner"
                        ? "Débutant"
                        : course.level === "intermediate"
                        ? "Intermédiaire"
                        : "Avancé"}
                    </span>
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700">
                      {course.language.toUpperCase()}
                    </span>
                    <Link 
                      href={`/domains/${course.domain_slug}`} 
                      className="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      {course.domain}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {courses && courses.last_page > 1 && (
            <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4">
              <button
                onClick={() => handlePageChange(appliedFilters.page! - 1)}
                disabled={appliedFilters.page === 1 || loading}
                className="w-full sm:w-auto px-6 py-3 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Précédent
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                  Page {appliedFilters.page} sur {courses.last_page}
                </span>
                <span className="text-sm text-gray-500">
                  ({courses.total} cours)
                </span>
              </div>

              <button
                onClick={() => handlePageChange(appliedFilters.page! + 1)}
                disabled={appliedFilters.page === courses.last_page || loading}
                className="w-full sm:w-auto px-6 py-3 bg-orange-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
              >
                Suivant
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Page