"use client";

import { useGetDomains } from "@/hooks/domains/use-domain";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

import { Skeleton } from "../ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

// Correction du typage avec le type 'Variants' de framer-motion
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const DomainsSection = () => {
  const { domains, loading } = useGetDomains();

  const plugin = useRef(
    Autoplay({ delay: 3500, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  return (
    <section className="py-16 px-4 bg-background overflow-hidden">
      <div className=" mx-auto">
        {/* Titre & Description avec animation */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
            Nos parcours
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Choisis ton domaine et commence dès{" aujourd'hui !"}
          </p>
        </motion.div>

        {/* Conteneur Carrousel */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          className="relative px-1 md:px-8"
        >
          <Carousel
            plugins={[plugin.current]}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 md:-ml-6">
              {/* ÉTAT 1 : CHARGEMENT (Squelette des cartes uniquement) */}
              {loading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <CarouselItem
                      key={index}
                      className="pl-4 md:pl-6 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6"
                    >
                      <div className="flex flex-col items-center gap-3 p-2">
                        <Skeleton className="w-36 h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-full" />
                        <Skeleton className="h-4 w-28 rounded-md mt-1" />
                      </div>
                    </CarouselItem>
                  ))
                : /* ÉTAT 2 : DONNÉES CHARGÉES */
                  domains.map((domain) => (
                    <CarouselItem
                      key={domain.id}
                      className="pl-4 md:pl-6 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6"
                    >
                      <div className="domain-card flex flex-col items-center gap-3 p-2 cursor-pointer group select-none">
                        <Link
                          href={`/domains/${domain.slug}`}
                          className="outline-none"
                        >
                          <div className="relative w-36 h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-full p-1.5 transition-all duration-300 ease-in-out group-hover:scale-105">
                            <div className="w-full h-full rounded-full overflow-hidden relative border-2 border-transparent group-hover:border-orange-500 transition-colors duration-300">
                              <Image
                                src={domain.image || "/images/placeholder.png"}
                                alt={domain.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="(max-width: 768px) 144px, (max-width: 1024px) 160px, 176px"
                                quality={90}
                              />
                            </div>
                            <div className="absolute inset-1.5 rounded-full bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                          </div>
                        </Link>

                        <span className="font-semibold text-foreground text-center text-sm md:text-base leading-tight max-w-40 group-hover:text-orange-500 transition-colors duration-300">
                          {domain.name}
                        </span>
                      </div>
                    </CarouselItem>
                  ))}
            </CarouselContent>

            {/* Boutons de navigation */}
            <CarouselPrevious className="hidden md:flex -left-5 top-1/2 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-orange-500 text-white hover:bg-orange-600 hover:text-white border-none shadow-md transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-0 focus-visible:ring-2 focus-visible:ring-orange-500" />
            <CarouselNext className="hidden md:flex -right-5 top-1/2 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-orange-500 text-white hover:bg-orange-600 hover:text-white border-none shadow-md transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-0 focus-visible:ring-2 focus-visible:ring-orange-500" />
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
};