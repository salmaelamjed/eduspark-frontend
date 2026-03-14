"use client"
import { useGetDomains } from "@/hooks/domains/use-domain"
import Image from "next/image"
import { Skeleton } from "../ui/skeleton"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel"
import Link from "next/link"

export const DomainsSection = () => {
    const {domains, loading , }=useGetDomains()

if (loading) {
    return (
      <section className="py-16 px-4 bg-background">
        <div className=" mx-auto">
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
    );
  }

  return (
    <section className="py-16 px-4 bg-background">
      <div className=" mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
          Nos parcours
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
          Choisis ton domaine et commence dès {"aujourd'hui "}!
        </p>

        <div className="">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {domains.map((domain) => (
                <CarouselItem
                  key={domain.id}
                  className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/7"
                >
                  <div className="domain-card flex flex-col items-center gap-4 p-2 cursor-pointer group">
                    <Link href={`/domains/${domain.slug}`}>
                     <div className="domain-image w-40 h-40 md:w-40 md:h-40 lg:w-44 lg:h-44">
                      <Image
                        src={`http://localhost:8000/storage/${domain.image}`}
                        alt={domain.name}
                        className="w-full h-full object-cover rounded-full"
                        width={0}
                        height={0}
                        unoptimized
                      />
                    </div>
                    </Link>
                    <span className="font-semibold text-foreground  text-center text-sm md:text-base leading-tight max-w-40 group-hover:text-primary transition-colors">
                      {domain.name}
                    </span>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 h-10 w-10 hover:cursor-pointer bg-orange-500 text-primary-foreground hover:bg-orane-500/90 border-none shadow-md" />
            <CarouselNext className="right-0 h-10 w-10 hover:cursor-pointer bg-orange-500 text-primary-foreground hover:bg-orange-500/90 border-none shadow-md" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}

