"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertCircle,Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CourseCheckout } from "@/components/checkout/course-checkout";
import { useAuth } from "@/context/auth-context";
import { CourseDetail, coursesApi } from "@/api/courses";

export default function CourseCheckoutPage() {
  const params = useParams<{ courseSlug: string }>();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.courseSlug) return;
    let cancelled = false;

    coursesApi
      .getBySlug(params.courseSlug)
      .then((data) => {
        if (!cancelled) setCourse(data);
      })
      .catch(() => {
        if (!cancelled) setError("Impossible de charger ce cours.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [params.courseSlug]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/sign-in?redirect=/cours/${params.courseSlug}/checkout`);
    }
  }, [authLoading, isAuthenticated, params.courseSlug, router]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
        <p className="text-sm font-medium">Chargement de votre session...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center px-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-base font-medium text-destructive">{error ?? "Cours introuvable."}</p>
        <Link href="/courses" className="mt-2 text-sm font-medium text-orange-500 hover:underline">
          Retour aux cours
        </Link>
      </div>
    );
  }

  if (course.is_free || course.price <= 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center px-4">
        <div className="rounded-full bg-emerald-50 p-3 dark:bg-emerald-950/30">
          <CheckCircle2 className="h-6 w-6 text-emerald-500" />
        </div>
        <p className="text-base font-medium">Ce cours est gratuit, aucun paiement {" n'est"} nécessaire.</p>
        <Link href={`/courses/${course.slug}`} className="text-sm font-semibold text-orange-500 hover:underline">
          Accéder directement au cours
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">

      <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
       

        <h1 className="mb-10 text-3xl font-bold  tracking-normal">Finaliser votre commande</h1>

        {/* Senior UX Grid Layout */}
<div className="grid gap-10 lg:grid-cols-12 items-start">
  
  {/* COLONNE GAUCHE: Course Summary Card -> Devenue STICKY */}
  <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-6">
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* Thumbnail Container */}
      {course.thumbnail && (
        <div className="relative aspect-video w-full bg-muted">
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
      
      {/* Card Content */}
      <div className="p-6">
        {course.domain?.name && (
          <span className="inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/10 dark:bg-orange-500/10 dark:text-orange-400">
            {course.domain.name}
          </span>
        )}
        
        <h2 className="mt-3 text-xl font-bold leading-snug">{course.title}</h2>
        
        <hr className="my-5 border-border" />
        
        {/* Modern Price Row */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Total à régler</span>
          <span className="text-2xl font-black text-foreground tracking-tight">
            {course.price.toFixed(2)} €
          </span>
        </div>
      </div>
    </div>

    {/* Trust Badging */}
    <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-4 flex items-start gap-3">
      <ShieldCheck className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
      <div>
        <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-400">Paiement 100% sécurisé</p>
        <p className="text-xs text-emerald-700/80 dark:text-emerald-500/80 mt-0.5">
          Vos informations bancaires sont chiffrées et ne transitent jamais par nos serveurs.
        </p>
      </div>
    </div>
  </div>

  {/* COLONNE DROITE: Stripe Checkout Form Container */}
  <div className="lg:col-span-7 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
    <h3 className="text-lg font-semibold mb-6">Informations de paiement</h3>
    <CourseCheckout
      courseId={course.id}
      courseTitle={course.title}
      price={course.price}
      currency="EUR" 
      image={course.thumbnail}
      domain={course.domain?.name}
      onSuccess={() => router.push(`/cours/${course.slug}/read`)}
    />
  </div>

</div>
      </div>
    </div>
  );
}