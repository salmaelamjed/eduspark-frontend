"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Choisis ton parcours",
    description:
      "Explore nos domaines d'apprentissage et sélectionne la formation adaptée à tes objectifs.",
  },
  {
    number: "02",
    title: "Apprends à ton rythme",
    description:
      "Accède aux cours interactifs, vidéos et exercices pratiques disponibles 24h/24 et 7j/7.",
  },
  {
    number: "03",
    title: "Reçois de l'aide en direct",
    description:
      "Pose tes questions à notre assistance IA ou échange avec des formateurs experts.",
  },
];

// Variants pour le titre et le sous-titre
const headerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Variants pour le conteneur des cartes (stagger)
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// Variants pour chaque carte d'étape
const stepCardVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// Variants pour le bloc d'image
const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: 0.3 },
  },
};

export const HowItWorksSection = () => {
  return (
    <section className="py-20 px-6 md:py-28 bg-background relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* En-tête minimalist */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={headerVariants}
          className="max-w-2xl mb-16 md:mb-24"
        >
          <p className="text-xs font-semibold tracking-widest text-orange-500 uppercase mb-3">
            Processus
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Une expérience fluide conçue pour te faire progresser rapidement,
            étape par étape.
          </p>
        </motion.div>

        {/* Grille Principale */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Liste des étapes */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="lg:col-span-6 space-y-4"
          >
            {steps.map((step) => (
              <motion.div
                key={step.number}
                variants={stepCardVariants}
                whileHover={{ x: 6 }}
                className="group relative p-6 rounded-2xl bg-card border border-border/60 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md cursor-default"
              >
                <div className="flex items-start gap-5">
                  <span className="text-sm font-mono font-semibold text-orange-500/80 group-hover:text-orange-500 transition-colors pt-0.5">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-orange-500 transition-colors duration-200">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Image (Dashboard Preview) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={imageVariants}
            className="lg:col-span-6"
          >
            <div className="relative rounded-2xl border border-border bg-muted/30 p-2 backdrop-blur-sm shadow-xl">
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-background border border-border/50">
                <Image
                  src="/images/commentimag.png"
                  alt="Aperçu de la plateforme"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};