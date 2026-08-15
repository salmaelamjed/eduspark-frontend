"use client";

import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { Sparkles, ArrowRight, BarChart3, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type CourData = {
  title: string;
  description?: string;
  price: number;
  slug: string;
  is_free: boolean;
  image?: string | null;
  level: string;
  language: string;
  domain_slug: string;
  domain: string;
};

// Variantes d'animation pour le bouton central au survol
const buttonVariants = {
  initial: { opacity: 0, y: 10, scale: 0.95 },
  hover: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

export function CoursCard({
  title,
  description,
  image,
  slug,
  price,
  is_free,
  level,
  language,
  domain,
  domain_slug,
}: CourData) {
  const domainLabel = domain || domain_slug;

  return (
    <motion.div
      className="group w-full max-w-70 "
      initial="initial"
      whileHover="hover"
      animate="initial"
    >
      <motion.div
        variants={{
          initial: { y: 0 },
          hover: { y: -6, transition: { duration: 0.3, ease: "easeOut" } },
        }}
      >
        <Card className="flex flex-col overflow-hidden rounded-[2.5rem] border border-border/80 bg-card p-0  transition-shadow duration-300 group-hover:border-orange-500/40  ">
          {/* Section Image */}
          <div className="relative h-58 w-full overflow-hidden">
            <Image
              fill
              src={image || "/placeholder-course.jpg"}
              alt={title}
              className="h-full w-full object-cover transition-[filter] duration-500 ease-out group-hover:blur-sm"
            />

            {/* Overlay sombre discret au survol pour faire ressortir le bouton */}
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Bouton "Voir les détails" — seul élément cliquable qui redirige */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-20"
              variants={buttonVariants}
            >
              <Link
                href={`/courses/${slug}`}
                className="flex items-center gap-2 bg-white text-gray-900 font-semibold px-6 py-3 rounded-full shadow-xl text-sm hover:bg-white/90 transition-colors"
              >
                Voir les détails
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            {/* Badge Prix / Gratuit */}
            <div className="absolute top-4 left-4 z-10">
              <Badge className="bg-background/80 hover:bg-background/90 text-foreground border-none font-bold text-xs px-3.5 py-1.5 rounded-full backdrop-blur-sm shadow-none">
                {is_free ? "Gratuit" : `$${price}`}
              </Badge>
            </div>
          </div>

          {/* Contenu de la Carte */}
          <div className="flex flex-col px-5 pb-3 space-y-4">
            {/* Titre & Description */}
            <div className="space-y-2 min-h-24">
              <h3 className="text-lg font-bold leading-snug tracking-tight text-foreground line-clamp-2 transition-colors duration-200 group-hover:text-orange-600">
                {title}
              </h3>
              {description && (
                <p className="line-clamp-2 text-sm text-muted-foreground/90 leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2  border-border/50">
              {/* Domaine — pleine largeur disponible */}
              <div
                title={domainLabel}
                className="flex w-full min-w-0 items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1.5"
              >
                <Sparkles className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                <span className="truncate capitalize font-semibold text-xs text-orange-600">
                  {domainLabel}
                </span>
              </div>

              {/* Niveau & Langue — seconde ligne */}
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 bg-secondary/70 text-secondary-foreground px-2.5 py-1 rounded-full text-[11px] font-medium capitalize">
                  <BarChart3 className="h-3 w-3" />
                  {level}
                </div>
                <div className="flex items-center gap-1 bg-secondary/70 text-secondary-foreground px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider w-full text-center justify-center">
                  <Globe className="h-3 w-3" />
                  {language}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default CoursCard;