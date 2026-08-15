"use client";

import { Button } from "@/components/ui/button";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Bot, Sparkles } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };


  return (
    <section className="relative overflow-hidden bg-linear-to-br from-background via-background to-orange-500/5 px-4 py-10 md:py-18 w-full">
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center"
        >
          {/* Badge IA */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-600">
              <Sparkles className="h-4 w-4 text-orange-500" />
             {" L'apprentissage réinventé par l'IA"}
            </span>
          </motion.div>

          {/* Titre principal */}
          <motion.h1
            variants={itemVariants}
            className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl text-foreground"
          >
            Propulsez vos compétences avec <br />
            <span className="bg-linear-to-r from-orange-500 via-orange-600 to-amber-500 bg-clip-text text-transparent">
              EduSpark
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="mx-auto mb-10 max-w-3xl text-lg text-muted-foreground md:text-xl leading-relaxed"
          >
            {"Bienvenue sur EduSpark, la plateforme d'éducation en ligne de nouvelle génération. Nous combinons des cours d'experts de haut niveau avec un assistant IA interactif disponible 24h/24 pour transformer votre façon d'apprendre"}
          </motion.p>

          {/* Boutons d'action */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button 
              asChild 
              size="lg" 
              className="group gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full px-8"
            >
              <Link href="/courses">
                Découvrir nos cours
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="group gap-2 rounded-full border-border hover:bg-accent font-medium px-8"
            >
              <Link href="/a-propos">
                <Bot className="h-4 w-4 text-orange-500" />
                En savoir plus sur notre IA
              </Link>
            </Button>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}