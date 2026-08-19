"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import React, { Fragment, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import CreateDomainForm from "@/components/create-domain";
import { DomainsTable } from "@/components/domains/domains-table";
import { useDomainsManagement } from "@/hooks/domains/use-domain";
import {DomainsTableSkeleton} from "./domains-table-skeleton";

export default function DomainPage() {
  const [open, setOpen] = useState(false);
  const {
    domains,
    pagination,
    isPageLoading,
    hasPagination,
    currentPage,
    setCurrentPage,
  } = useDomainsManagement();

  return (
    <div className="min-h-screen flex flex-col container mx-auto ">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Domaines</h1>
          <p className="text-muted-foreground mt-1">
            Gérez et suivez tous vos domaines
          </p>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              className="
                bg-orange-500 
                hover:bg-orange-400
                text-white 
                rounded-3xl 
                px-6 
                py-6 
                flex 
                items-center 
                gap-2 
                transition-all
              "
            >
              <PlusCircle className="h-5 w-5" />
              Ajouter un domaine
            </Button>
          </SheetTrigger>

          <SheetContent className="w-full sm:max-w-lg md:max-w-xl overflow-y-auto">
            <SheetHeader className="mb-2">
              <SheetTitle className="text-2xl">Nouveau domaine</SheetTitle>
              <SheetDescription>
                Remplissez les informations ci-dessous pour créer un nouveau domaine.
              </SheetDescription>
            </SheetHeader>
            <div>
              <CreateDomainForm
                onSuccess={() => {
                  setOpen(false);
                }}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-col flex-1 min-h-0">
        {isPageLoading ? (
          <DomainsTableSkeleton/>
        ):(
          <div className="flex-1 overflow-auto">
          <DomainsTable domains={domains}  />
        </div>
        )}

        {hasPagination && (
          <div className="py-6 mt-auto bg-background">
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (pagination?.hasPrevPage) setCurrentPage((p) => p - 1);
                      }}
                      className={!pagination?.hasPrevPage ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {Array.from({ length: pagination?.lastPage ?? 1 }, (_, i) => i + 1)
                    .filter(
                      (p) =>
                        p === 1 ||
                        p === pagination?.lastPage ||
                        (p >= currentPage - 1 && p <= currentPage + 1)
                    )
                    .map((pageNum, idx, arr) => (
                      <Fragment key={pageNum}>
                        {idx > 0 && arr[idx - 1] !== pageNum - 1 && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                        <PaginationItem>
                          <PaginationLink
                            href="#"
                            isActive={pageNum === currentPage}
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(pageNum);
                            }}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      </Fragment>
                    ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (pagination?.hasNextPage) setCurrentPage((p) => p + 1);
                      }}
                      className={!pagination?.hasNextPage ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}