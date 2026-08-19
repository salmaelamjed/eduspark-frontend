"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { BestCoursesSkeleton } from "./best-courses-skeleton";
import { useBestCourses } from "@/hooks/courses/use-best-courses";
import { cn } from "@/lib/utils";
import type { BestCourse } from "@/types/course";
import { CourseCard } from "../course-card";

// Mappe la forme de données API vers les props attendues par CourseCard
function toCardCourse(course: BestCourse) {
  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
    thumbnail: course.thumbnail,
    is_free: course.is_free,
    price: course.price,
    teacher: course.teacher,
    level: course.level,
    language: course.language,
    domain: course.domain?.name,
    domain_slug: course.domain?.slug,
  };
}

export function BestCoursesSection() {
  const { courses, isLoading, error } = useBestCourses({ limit: 8 });

  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 4);
    setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows, courses]);

  const scrollByCard = (direction: "prev" | "next") => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-slide]");
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: direction === "next" ? step : -step, behavior: "smooth" });
  };

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16">
        <p className="text-center text-sm text-muted-foreground">
          Impossible de charger les meilleurs cours pour le moment.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full px-4 py-16">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">
            <Flame className="size-3.5" />
            Les plus populaires
          </span>
          <h2 className="mt-3 text-2xl font-bold text-gray-950 sm:text-3xl">
            Cours les mieux suivis
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Les formations qui rassemblent le plus d&apos;apprenants sur la plateforme
          </p>
        </div>

        {/* Arrows (desktop) */}
        {!isLoading && courses.length > 0 && (
          <div className="hidden shrink-0 gap-2 sm:flex">
            <button
              onClick={() => scrollByCard("prev")}
              disabled={!canScrollPrev}
              aria-label="Précédent"
              className="flex size-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-all hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => scrollByCard("next")}
              disabled={!canScrollNext}
              aria-label="Suivant"
              className="flex size-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-all hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <BestCoursesSkeleton count={4} />
      ) : courses.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Aucun cours disponible pour le moment.
        </p>
      ) : (
        <div
          ref={scrollerRef}
          className="scrollbar-none h-full -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2"
        >
          {courses.map((course, i) => (
            <div
              key={course.id}
              data-slide
              className={cn(
                "w-[78%] shrink-0 snap-start animate-in fade-in-0 slide-in-from-bottom-2",
                "sm:w-[46%] lg:w-[31%] xl:w-[23%]"
              )}
              style={{ animationDelay: `${i * 60}ms`, animationDuration: "400ms" }}
            >
              <CourseCard course={toCardCourse(course)} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}