"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Briefcase, Percent, GraduationCap } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const BecomeTeacherHeroSection = () => {
  // Construire l'URL avec les query params de message / provenance
  const targetUrl = {
    pathname: "/become-teacher/request",
    query: {
      source: "landing_cta",
      message: "apply_now",
    },
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/60 relative overflow-hidden border-y border-slate-200/60">
      {/* Halos d'arrière-plan */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="text-center space-y-8"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Opportunité de carrière</span>
            </div>
          </motion.div>

          {/* Titre & Description */}
          <motion.div variants={itemVariants} className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Devenez enseignant sur{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-500">
                EduSpark
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Partagez votre expertise avec notre communauté. Créez vos cours en toute autonomie, 
              générez des revenus et accompagnez des milliers d'apprenants dans leur réussite.
            </p>
          </motion.div>

          {/* Cartes d'avantages rapides */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-4xl mx-auto pt-4"
          >
            <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-xs hover:border-orange-500/30 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center mb-3">
                <Briefcase className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Flexibilité totale</h4>
              <p className="text-xs text-slate-500 mt-1">Créez selon votre propre rythme et vos horaires.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-xs hover:border-orange-500/30 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center mb-3">
                <Percent className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Revenus attractifs</h4>
              <p className="text-xs text-slate-500 mt-1">Gagnez des revenus réguliers grâce à vos cours.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-xs hover:border-orange-500/30 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center mb-3">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Support Pédagogique</h4>
              <p className="text-xs text-slate-500 mt-1">Notre équipe vous aide à structurer vos contenus.</p>
            </div>
          </motion.div>

          {/* Bouton CTA avec lien enrichi d'un query parameter */}
          <motion.div variants={itemVariants} className="pt-4 flex justify-center">
            <Button
              asChild
              size="lg"
              className="h-12 px-8 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <Link href={targetUrl} className="flex items-center gap-2">
                <span>Poser ma candidature</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};