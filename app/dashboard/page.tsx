'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, ArrowLeft, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center bg-background  text-center overflow-hidden">
      
      {/* Subtle background geometric gradients for depth */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-orange-500/10 blur-[120px] sm:h-96 sm:w-96" />
      <div className="absolute bottom-1/4 left-1/3 -z-10 h-64 w-64 rounded-full bg-muted blur-[100px]" />

      <div className="max-w-md">
        
        {/* Logo Section */}
        <div className="mb-8 flex justify-center">
          <Link 
            href="/" 
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-lg p-1"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white transition-transform group-hover:scale-105">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Edu<span className="text-orange-500">Spark</span>
            </span>
          </Link>
        </div>

        {/* Big 404 Status */}
        <span className="inline-flex select-none rounded-full bg-orange-500/10 px-4 py-1.5 text-sm font-semibold tracking-wide text-orange-600 dark:text-orange-400">
          Erreur 404
        </span>
        
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Cours introuvable ou page égarée
        </h1>
        
        <p className="mt-4 text-base text-muted-foreground leading-relaxed">
          Désolé, la page que vous recherchez {"n'existe"} pas ou a été déplacée. Profitons-en pour vous remettre sur la bonne voie {"d'apprentissage"}.
        </p>

        {/* Dynamic visual placeholder (Modern Grid Stack) */}
        <div className="my-10 flex justify-center">
          <div className="relative flex h-20 w-32 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30">
            <Search className="h-7 w-7 text-muted-foreground/50 animate-pulse" />
            <span className="absolute -bottom-2 -right-2 flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500 text-xs font-bold text-white shadow-md">
              ?
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="w-full sm:w-auto h-11 border-border px-5 text-sm font-medium hover:bg-muted transition-colors inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retourner en arrière
          </Button>

          <Button
            asChild
            className="w-full sm:w-auto h-11 bg-orange-500 text-white hover:bg-orange-600 font-medium shadow-sm shadow-orange-500/15 transition-all inline-flex items-center justify-center gap-2"
          >
            <Link href="/">
              <Home className="h-4 w-4" />
              Accueil EduSpark
            </Link>
          </Button>
        </div>

      </div>

      {/* Modern minimal footer */}
      <footer className="absolute bottom-6 text-center text-xs text-muted-foreground/70">
        © 2026 EduSpark. Tous droits réservés.
      </footer>
    </div>
  );
}