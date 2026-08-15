'use client';

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from 'framer-motion';
import Image from 'next/image';
import { Search, X, CornerDownLeft } from 'lucide-react';
import { useMemo, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

type CourseCommand = {
  id: string;
  iconSrc: string;
  label: string;
  category: string;
  description: string;
  href?: string;
};

const coursesData: CourseCommand[] = [
  {
    id: 'fullstack',
    iconSrc:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&auto=format&fit=crop&q=80',
    label: 'Développement Web Fullstack',
    category: 'Programmation',
    description: 'React, Next.js, Node.js et bases de données',
  },
  {
    id: 'uiux',
    iconSrc:
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=100&auto=format&fit=crop&q=80',
    label: 'Design UI/UX & Figma',
    category: 'Design',
    description: 'Concevoir des interfaces modernes et prototypes',
  },
  {
    id: 'algo',
    iconSrc:
      'https://images.unsplash.com/photo-1516116211223-4c7141870a67?w=100&auto=format&fit=crop&q=80',
    label: 'Algorithmique & Structures de données',
    category: 'Informatique',
    description: 'Les fondamentaux de la programmation',
  },
  {
    id: 'ia',
    iconSrc:
      'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=100&auto=format&fit=crop&q=80',
    label: "Introduction à l'Intelligence Artificielle",
    category: 'Data & IA',
    description: 'Concepts de base du Machine Learning et Prompts',
  },
];

const overlayTransition: Transition = { duration: 0.18, ease: 'easeOut' };

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredCourses = useMemo(
    () =>
      coursesData.filter(
        (course) =>
          course.label.toLowerCase().includes(query.toLowerCase()) ||
          course.category.toLowerCase().includes(query.toLowerCase()) ||
          course.description.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    const handleNavigation = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filteredCourses.length > 0 ? (prev + 1) % filteredCourses.length : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filteredCourses.length > 0
            ? (prev - 1 + filteredCourses.length) % filteredCourses.length
            : 0
        );
      } else if (e.key === 'Enter' && filteredCourses[selectedIndex]) {
        e.preventDefault();
        handleSelectCourse(filteredCourses[selectedIndex]);
      }
    };

    window.addEventListener('keydown', handleNavigation);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleNavigation);
    };
  }, [isOpen, filteredCourses, selectedIndex]);

  const handleSelectCourse = (course: CourseCommand) => {
    console.log('Cours sélectionné :', course);
    setIsOpen(false);
    setQuery('');
  };

  const panelVariants: Variants = shouldReduceMotion
    ? {
        initial: { opacity: 0, y: 0 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 0 },
      }
    : {
        initial: { opacity: 0, scale: 0.98, y: -10 },
        animate: {
          opacity: 1,
          scale: 1,
          y: 0,
          transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
        },
        exit: {
          opacity: 0,
          scale: 0.98,
          y: -10,
          transition: { duration: 0.15, ease: 'easeIn' },
        },
      };

  return (
    <>
      {/* Bouton déclencheur dans la Navbar */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group flex items-center gap-3 rounded-xl border border-border/70 bg-background/50 px-3.5 py-1.5 text-sm text-muted-foreground shadow-sm transition-all hover:border-orange-500/50 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
      >
        <Search className="h-4 w-4 text-orange-500 transition-transform group-hover:scale-110" aria-hidden />
        <span className="font-medium hidden sm:inline-block">Rechercher un cours…</span>
        <span className="font-medium sm:hidden">Rechercher…</span>
        <kbd className="hidden md:inline-flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Modal projetée via Portal */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div className="fixed inset-0 z-100 flex items-start justify-center px-4 pt-16 sm:pt-24">
                {/* Backdrop / Arrière-plan sombre */}
                <motion.div
                  aria-hidden
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={overlayTransition}
                  onClick={() => setIsOpen(false)}
                />

                {/* Conteneur principal de la Command Palette */}
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-label="Rechercher des cours"
                  {...panelVariants}
                  className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl ring-1 ring-black/5"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Zone de Saisie */}
                  <div className="flex items-center border-b border-border px-4 py-3">
                    <Search className="h-5 w-5 shrink-0 text-orange-500 mr-3" aria-hidden />
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Rechercher un cours, un sujet, une catégorie..."
                      className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                      autoFocus
                    />
                    
                    {/* Remplacement du badge ESC par le bouton 'X' précédent */}
                    <motion.button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/60 bg-muted/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                      whileHover={
                        shouldReduceMotion
                          ? undefined
                          : { rotate: 90, scale: 1.05 }
                      }
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
                    >
                      <X className="h-4 w-4" aria-hidden />
                      <span className="sr-only">Fermer la recherche</span>
                    </motion.button>
                  </div>

                  {/* Liste des Résultats */}
                  <div className="max-h-80 overflow-y-auto p-2">
                    {filteredCourses.length === 0 ? (
                      <div className="py-12 text-center text-sm text-muted-foreground">
                        Aucun cours trouvé pour <span className="font-semibold text-foreground">{query}</span>
                      </div>
                    ) : (
                      <ul role="listbox" className="space-y-1">
                        {filteredCourses.map((course, index) => {
                          const isSelected = index === selectedIndex;
                          return (
                            <li key={course.id} role="option" aria-selected={isSelected}>
                              <button
                                type="button"
                                onClick={() => handleSelectCourse(course)}
                                onMouseEnter={() => setSelectedIndex(index)}
                                className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors ${
                                  isSelected
                                    ? 'bg-orange-500/10 text-foreground border border-orange-500/20'
                                    : 'hover:bg-muted/60 text-muted-foreground'
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  {/* Miniature du cours */}
                                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border/50 bg-muted">
                                    <Image
                                      src={course.iconSrc}
                                      alt={course.label}
                                      fill
                                      sizes="40px"
                                      className="object-cover"
                                    />
                                  </div>

                                  <div className="flex flex-col truncate">
                                    <span className={`text-sm font-medium truncate ${isSelected ? 'text-orange-600 dark:text-orange-400' : 'text-foreground'}`}>
                                      {course.label}
                                    </span>
                                    <span className="text-xs text-muted-foreground truncate">
                                      {course.description}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0 ml-3">
                                  <span className="rounded-md border border-border/60 bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                                    {course.category}
                                  </span>
                                  {isSelected && (
                                    <CornerDownLeft className="h-4 w-4 text-orange-500" />
                                  )}
                                </div>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>

                  {/* Footer d'astuces UX */}
                  <div className="flex items-center justify-between border-t border-border bg-muted/30 px-4 py-2 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <kbd className="rounded border bg-background px-1">↑</kbd>
                        <kbd className="rounded border bg-background px-1">↓</kbd>
                        Naviguer
                      </span>
                      <span className="flex items-center gap-1">
                        <kbd className="rounded border bg-background px-1">↵</kbd>
                        Ouvrir
                      </span>
                    </div>
                    <span>{filteredCourses.length} résultat(s)</span>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}