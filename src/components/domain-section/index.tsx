"use client"

import { useGetDomains } from "@/hooks/domains/use-domain"
import Image from "next/image"
import { Skeleton } from "../ui/skeleton"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel"
import Link from "next/link"

export const DomainsSection = () => {
    const { domains, loading } = useGetDomains()

    if (loading) {
        return (
            <section className="py-16 px-4 bg-background">
                <div className="mx-auto">
                    <Skeleton className="h-10 w-64 mx-auto mb-4" />
                    <Skeleton className="h-6 w-96 mx-auto mb-12" />
                    <div className="flex gap-6 justify-center">
                        {Array.from({ length: 7 }).map((_, index) => (
                            <div key={index} className="flex flex-col items-center gap-3">
                                <Skeleton className="h-40 w-40 rounded-full" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-16 px-4 bg-background overflow-hidden">
            <div className="mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
                    Nos parcours
                </h2>
                <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
                    Choisis ton domaine et commence dès{" aujourd'hui"} !
                </p>

                {/* Conteneur principal avec padding pour laisser respirer les flèches pro */}
                <div className="relative px-1 md:px-6">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                            
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-6">
                            {domains.map((domain) => (
                                <CarouselItem
                                    key={domain.id}
                                    className="pl-6 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6"
                                >
                                    <div className="domain-card flex flex-col items-center gap-2 p-2 cursor-pointer group select-none">
                                        <Link href={`/domains/${domain.slug}`} className="outline-none">
                                            <div className="relative w-36 h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-full p-1.5 duration-300 ease-in-out  ">
                                                <div className="w-full h-full rounded-full overflow-hidden relative">
                                                    <Image
                                                        src={domain.image!}
                                                        alt={domain.name}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                        sizes="(max-width: 768px) 144px, (max-width: 1024px) 160px, 176px"
                                                        quality={90}
                                                        priority={false}
                                                    />
                                                </div>
                                                {/* Overlay effet au survol à l'intérieur du cercle */}
                                                <div className="absolute inset-1.5 rounded-full bg-black/0 group-hover:bg-black/5 transition-all duration-300" />
                                            </div>
                                        </Link>
                                        
                                        <span className="font-semibold text-foreground text-center text-sm md:text-base leading-tight max-w-40 group-hover:text-orange-500 transition-colors duration-300">
                                            {domain.name}
                                        </span>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        {/* Flèches Premium Magnifiques & Parfaitement alignées à l'extérieur */}
                        <CarouselPrevious className="hidden md:flex -left-6 top-[40%] translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-orange-500 text-white hover:bg-orange-600 hover:text-white border-none hover:cursor-pointer shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-0 focus-visible:ring-2 focus-visible:ring-orange-500" />
                        <CarouselNext className="hidden md:flex -right-6 top-[40%] translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-orange-500 text-white hover:bg-orange-600 hover:text-white hover:cursor-pointer border-none shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-0 focus-visible:ring-2 focus-visible:ring-orange-500" />
                    </Carousel>
                </div>
            </div>
        </section>
    )
}