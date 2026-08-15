"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  Loader2,
  Lock,
  PlayCircle,
  Share2,
  Sparkles, 
  Trophy,
  User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

import { AvatarUploader } from "@/components/profile/avatar-upload";
import { useProfile } from "@/hooks/profile/use-profile";
import { ApiError } from "@/lib/api";

import AccountDeactivation from "@/components/profile/account-deactivation";
import ChangePassword from "@/components/profile/change-pwd";
import { BasicInfoSection } from "@/components/profile/informations-form";
import { SocialLinksSection } from "@/components/profile/social-links";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export type SectionStatus = "idle" | "saving" | "success" | "error";
type TabType = "informations" | "learning" | "liens_sociaux" | "security";

const TABS: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: "informations", label: "Informations", icon: User },
  { id: "learning", label: "Mes Cours & Lectures", icon: GraduationCap },
  { id: "liens_sociaux", label: "Liens sociaux", icon: Share2 },
  { id: "security", label: "Sécurité", icon: Lock },
];

const ENROLLED_COURSES = [
  {
    id: "1",
    title: "Développement Web Fullstack avec Next.js & Node",
    category: "Programmation",
    progress: 75,
    completedChapters: 18,
    totalChapters: 24,
    lastAccessed: "Hier",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "2",
    title: "Intelligence Artificielle & Prompt Engineering",
    category: "Data & IA",
    progress: 40,
    completedChapters: 6,
    totalChapters: 15,
    lastAccessed: "Il y a 3 jours",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=300&auto=format&fit=crop&q=80",
  },
];

const TRACKED_BOOKS = [
  {
    id: "b1",
    title: "30 Days Life Reset Journal",
    author: "EduSpark Digital",
    pagesRead: 35,
    totalPages: 50,
    status: "En cours",
  },
  {
    id: "b2",
    title: "Guide de l'Architecture Web Moderne",
    author: "Alexandre Martin",
    pagesRead: 120,
    totalPages: 120,
    status: "Terminé",
  },
];

export function getApiErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

interface SaveButtonProps {
  status: SectionStatus;
  label: string;
  className?: string;
  /** Désactive le bouton même hors saving — utilisé pour le dirty-check des formulaires. */
  disabled?: boolean;
}

export function SaveButton({
  status,
  label,
  className,
  disabled = false,
}: SaveButtonProps) {
  return (
    <Button
      type="submit"
      disabled={status === "saving" || disabled}
      className={cn(
        "cursor-pointer rounded-xl bg-orange-500 px-6 py-2.5 font-medium text-white shadow-none",
        "transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-orange-600",
        "active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0",
        className
      )}
    >
      {status === "saving" ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Enregistrement...</span>
        </>
      ) : status === "success" ? (
        <>
          <CheckCircle2 className="mr-2 h-4 w-4" />
          <span>Enregistré</span>
        </>
      ) : (
        label
      )}
    </Button>
  );
}

export default function ProfilePage() {
  const shouldReduceMotion = useReducedMotion();
  const { profile, isLoading, updateProfileOptimistically } = useProfile();
  const [activeTab, setActiveTab] = useState<TabType>("informations");
  const { token } = useAuth();

  return (
    <div className="min-h-screen w-full  px-4 py-4 sm:px-4 lg:px-4">
      <div className="mx-auto min-w-full space-y-8">
        {/* En-tête du profil */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-orange-600">
              <Sparkles className="h-3.5 w-3.5" />
              Espace Membre
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Mon Profil & Progression
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gérez vos informations, suivez vos cours et mesurez votre progression.
            </p>
          </div>

          <Badge className="w-fit gap-2 rounded-full border border-border/80 bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Compte Actif
          </Badge>
        </motion.div>

        {isLoading ? (
          <div className="flex h-80 items-center justify-center rounded-2xl border border-border/60 bg-card/50">
            <Loader2 className="mr-2 h-6 w-6 animate-spin text-orange-500" />
            <span className="text-sm font-medium text-muted-foreground">
              Chargement du profil EduSpark...
            </span>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Sidebar utilisateur */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="flex flex-col items-center rounded-2xl border border-border/60 bg-card p-6  backdrop-blur-sm">
                <AvatarUploader
                  token={token}
                  currentUrl={profile?.profile_picture_url}
                  name={profile?.name}
                  onUploaded={(url) =>
                    updateProfileOptimistically({ profile_picture_url: url })
                  }
                  onDeleted={() =>
                    updateProfileOptimistically({ profile_picture_url: undefined })
                  }
                />
                <div className="mt-4 text-center">
                  <h2 className="text-lg font-semibold text-foreground">
                    {profile?.name ?? "Utilisateur"}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {profile?.headline ?? "Étudiant EduSpark"}
                  </p>
                </div>

                {/* Métriques d'apprentissage rapides */}
                <div className="mt-6 grid w-full grid-cols-2 gap-3 border-t border-border/60 pt-6">
                  <div className="flex flex-col items-center rounded-xl bg-muted/40 p-3 text-center">
                    <Trophy className="h-5 w-5 text-amber-500 mb-1" />
                    <span className="text-lg font-bold text-foreground">1,250</span>
                    <span className="text-[11px] text-muted-foreground">XP Gagnés</span>
                  </div>
                  <div className="flex flex-col items-center rounded-xl bg-muted/40 p-3 text-center">
                    <Clock className="h-5 w-5 text-orange-500 mb-1" />
                    <span className="text-lg font-bold text-foreground">24h</span>
                    <span className="text-[11px] text-muted-foreground">Temps suivi</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Zone de contenu principal avec Onglets */}
            <main className="lg:col-span-8 space-y-6">
              <div className="rounded-2xl border border-border/60 bg-card shadow-sm backdrop-blur-sm overflow-hidden">
                {/* Barre de navigation des onglets pleine largeur */}
                <div className="w-full border-b border-border/60 bg-muted/20 px-2 pt-2">
                  <div className="flex w-full items-center justify-between overflow-x-auto no-scrollbar">
                    {TABS.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveTab(tab.id)}
                          className={cn(
                            "relative flex flex-1 items-center justify-center gap-2 px-3 py-3 text-xs font-semibold transition-colors whitespace-nowrap",
                            isActive
                              ? "text-orange-600 dark:text-orange-500"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span>{tab.label}</span>
                          {isActive && (
                            <motion.div
                              layoutId="active-tab-indicator"
                              className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full"
                              transition={{
                                duration: 0.25,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Contenu de l'onglet actif */}
                <div className="p-6">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {activeTab === "informations" && (
                        <BasicInfoSection
                          profile={profile}
                          token={token}
                          onSaved={(updates) => updateProfileOptimistically(updates)}
                        />
                      )}

                      {/* Tracker de cours & e-books */}
                      {activeTab === "learning" && (
                        <div className="space-y-8">
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-orange-500" />
                                Cours en cours d'apprentissage
                              </h3>
                              <span className="text-xs text-muted-foreground">
                                {ENROLLED_COURSES.length} cours actifs
                              </span>
                            </div>

                            <div className="space-y-4">
                              {ENROLLED_COURSES.map((course) => (
                                <div
                                  key={course.id}
                                  className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-border/60 bg-background/50 p-4 transition-all hover:border-orange-500/40 hover:bg-accent/30"
                                >
                                  <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <div
                                      className="h-14 w-14 shrink-0 rounded-lg bg-cover bg-center border border-border/50"
                                      style={{ backgroundImage: `url(${course.image})` }}
                                    />
                                    <div className="space-y-1">
                                      <span className="text-[10px] font-semibold text-orange-600 bg-orange-500/10 px-2 py-0.5 rounded-full">
                                        {course.category}
                                      </span>
                                      <h4 className="text-sm font-semibold text-foreground line-clamp-1">
                                        {course.title}
                                      </h4>
                                      <p className="text-xs text-muted-foreground">
                                        {course.completedChapters} sur {course.totalChapters} chapitres terminés
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-4 w-full sm:w-1/3 justify-between sm:justify-end">
                                    <div className="w-full max-w-[120px] space-y-1">
                                      <div className="flex justify-between text-[11px]">
                                        <span className="text-muted-foreground font-medium">Progression</span>
                                        <span className="font-bold text-orange-500">{course.progress}%</span>
                                      </div>
                                      <Progress value={course.progress} className="h-1.5" />
                                    </div>
                                    <Button size="icon" variant="ghost" className="shrink-0 group-hover:text-orange-500">
                                      <PlayCircle className="h-5 w-5" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-orange-500" />
                                Livres & E-books Suivis
                              </h3>
                              <span className="text-xs text-muted-foreground">
                                {TRACKED_BOOKS.length} livres dans votre bibliothèque
                              </span>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                              {TRACKED_BOOKS.map((book) => {
                                const percentage = Math.round(
                                  (book.pagesRead / book.totalPages) * 100
                                );
                                return (
                                  <div
                                    key={book.id}
                                    className="rounded-xl border border-border/60 bg-background/50 p-4 space-y-3"
                                  >
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <h4 className="text-sm font-semibold text-foreground">
                                          {book.title}
                                        </h4>
                                        <p className="text-xs text-muted-foreground">
                                          Par {book.author}
                                        </p>
                                      </div>
                                      <Badge
                                        variant="outline"
                                        className={cn(
                                          "text-[10px] font-medium",
                                          book.status === "Terminé"
                                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                                            : "border-orange-500/30 bg-orange-500/10 text-orange-600"
                                        )}
                                      >
                                        {book.status}
                                      </Badge>
                                    </div>

                                    <div className="space-y-1 pt-2">
                                      <div className="flex justify-between text-[11px] text-muted-foreground">
                                        <span>Page {book.pagesRead} sur {book.totalPages}</span>
                                        <span className="font-semibold text-foreground">{percentage}%</span>
                                      </div>
                                      <Progress value={percentage} className="h-1.5" />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === "liens_sociaux" && (
                        <SocialLinksSection
                          profile={profile}
                          token={token}
                          onSaved={(socialLinks) => updateProfileOptimistically({ social_links: socialLinks })}
                        />
                      )}

                      {activeTab === "security" && <SecuritySection />}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </main>
          </div>
        )}
      </div>
    </div>
  );
}

function SecuritySection() {
  const { token, clearSession } = useAuth();
  const router = useRouter();
  return (
    <div className="space-y-6">
      <ChangePassword token={token} />
      <AccountDeactivation
        token={token}
        onDeactivated={() => {
          clearSession();
          router.push("/login?deactivated=1");
        }}
      />
    </div>
  );
}