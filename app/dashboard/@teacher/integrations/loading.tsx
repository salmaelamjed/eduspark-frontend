'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingIntegrations = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="w-full">
          <CardContent className="flex flex-col p-6 gap-4">
            {/* Ligne du haut : Logo + Bouton */}
            <div className="flex w-full justify-between items-center">
              {/* Fake Logo (w-20 h-20) */}
              <Skeleton className="w-20 h-20 rounded-xl" />
              {/* Fake Bouton Connecter */}
              <Skeleton className="h-10 w-24 rounded-lg" />
            </div>
            
            {/* Ligne du bas : Description */}
            <div className="space-y-2 mt-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[80%]" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LoadingIntegrations;