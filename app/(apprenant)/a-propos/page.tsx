'use client';

import React from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Cpu, 
  MessageSquare, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen text-gray-900">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28 bg-linear-to-b from-orange-50/50 to-white">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-size-[6rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-sm font-semibold mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4" />
             {"L'apprentissage réinventé par l'IA"}
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-950 tracking-tight leading-none mb-6">
            Propulsez vos compétences avec <span className="text-orange-500">EduSpark</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 leading-relaxed mb-8">
            Bienvenue sur EduSpark, la plateforme {"d'éducation "}en ligne de nouvelle génération. Nous combinons des cours {"d'experts"} de haut niveau avec un assistant IA interactif disponible 24h/24 pour transformer votre façon {"d'apprendre"}.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold rounded-2xl px-8 py-6 shadow-md hover:shadow-lg transition-all">
              <Link href="/courses" className="flex items-center gap-2">
                Découvrir nos cours <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-gray-200 text-gray-700 hover:bg-gray-50 rounded-2xl px-8 py-6">
              <Link href="#chatbot-info">
                En savoir plus sur notre IA
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Notre Mission (Section Valeurs) */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex gap-1 mb-4" aria-hidden="true">
              <span className="h-1.5 w-12 rounded-full bg-orange-500" />
              <span className="h-1.5 w-2 rounded-full bg-orange-400" />
              <span className="h-1.5 w-2 rounded-full bg-orange-300" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-950 tracking-tight mb-6">
              Pourquoi avoir créé EduSpark ?
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
                {"              Trop souvent, l'apprentissage en ligne est une expérience passive et solitaire. Face à une vidéo ou un texte complexe, l'étudiant se retrouve livré à lui-même lorsqu'une question surgit"}
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
                {"              <strong>EduSpark est né pour briser cette barrière.</strong> Notre mission est de rendre l'éducation accessible, engageante et hautement personnalisée en plaçant l'accompagnement au cœur de votre parcours."}
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 font-medium">Des formateurs experts passionnés par la transmission.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 font-medium">Une technologie de pointe pour des explications instantanées.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 font-medium">Une progression fluide et mesurable à votre propre rythme.</p>
              </div>
            </div>
          </div>

          {/* Grille de stats ou visuels */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-orange-50 border border-orange-100/50 flex flex-col justify-between h-48">
              <div className="p-3 rounded-2xl bg-white text-orange-500 shadow-sm w-fit">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-black text-gray-950">100%</p>
                <p className="text-xs text-gray-500 font-medium">Cours structurés</p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100 flex flex-col justify-between h-48 translate-y-4">
              <div className="p-3 rounded-2xl bg-white text-orange-500 shadow-sm w-fit">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-black text-gray-950">IA</p>
                <p className="text-xs text-gray-500 font-medium">Assistance instantanée</p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100 flex flex-col justify-between h-48">
              <div className="p-3 rounded-2xl bg-white text-orange-500 shadow-sm w-fit">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-black text-gray-950">24/7</p>
                <p className="text-xs text-gray-500 font-medium">Réponses interactives</p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-orange-500 text-white flex flex-col justify-between h-48 translate-y-4">
              <div className="p-3 rounded-2xl bg-orange-400 text-white shadow-sm w-fit">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-black">98%</p>
                <p className="text-xs text-orange-100 font-medium">Satisfaction apprenants</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section Innovation Chatbot IA */}
      <section id="chatbot-info" className="py-20 bg-gray-50 border-y border-gray-100 mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="flex justify-center gap-1 mb-4" aria-hidden="true">
              <span className="h-1.5 w-2 rounded-full bg-orange-400" />
              <span className="h-1.5 w-12 rounded-full bg-orange-500" />
              <span className="h-1.5 w-2 rounded-full bg-orange-400" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-950 tracking-tight mb-4">
              Un Chatbot Intelligent pour tout comprendre
            </h2>
            <p className="text-gray-600">
              Fini les moments de blocage devant une notion difficile. Notre tuteur virtuel intelligent est là pour adapter les concepts complexes à votre niveau.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 rounded-2xl bg-orange-50 text-orange-500 w-fit mb-6">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-950 mb-3">Questions à la volée</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Une phrase ou un exemple de code vous échappe ? Posez directement votre question dans le chat intégré pendant que vous suivez votre cours.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 rounded-2xl bg-orange-50 text-orange-500 w-fit mb-6">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-950 mb-3">Vulgarisation et Exemples</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {"Demandez à l'IA de reformuler une notion sous forme de métaphore, de simplifier le vocabulaire ou de vous générer des cas pratiques d'application"}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 rounded-2xl bg-orange-50 text-orange-500 w-fit mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-950 mb-3">Entraînement Personnalisé</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Le chatbot peut générer des mini-quiz personnalisés à la fin de vos lectures pour {"s'assurer que vous avez parfaitement assimilé l'essentiel."} 
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Call to Action Finale */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-950 rounded-3xl p-8 sm:p-12 lg:p-16 text-center text-white relative overflow-hidden shadow-xl">
          {/* Cercles de fond stylisés */}
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-72 h-72 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-72 h-72 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <GraduationCap className="w-12 h-12 text-orange-500 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              {"Prêt à allumer l'étincelle de votre savoir ?"}
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-8">
             {" Rejoignez EduSpark dès aujourd'hui et faites l'expérience d'une éducation interactive assistée par l'intelligence artificielle."}
            </p>
            <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold rounded-2xl px-8 py-6 shadow-md transition-all">
              <Link href="/courses" className="flex items-center gap-2">
                Commencer à apprendre <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
    </div>
  );
}