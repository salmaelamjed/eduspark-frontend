'use client';

import React, { useEffect, useState } from 'react';
import IntegrationsList from '@/components/integrations';
import { useConnectToStripe } from '@/hooks/integrations/use-integrations';
import { Loader2 } from 'lucide-react';

const IntegrationsPage = () => {
  const { 
    isAccountConnected, 
    isOnboardingComplete,
    isInitializing,
    checkAccountStatus 
  } = useConnectToStripe();

  // ✅ Construire les connexions directement
  const connections = {
    stripe: isAccountConnected && isOnboardingComplete
  };

  // ✅ Vérifier le statut au chargement
  useEffect(() => {
    checkAccountStatus();
  }, []);

  // ✅ Rafraîchir automatiquement quand la page reçoit le focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAccountStatus();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkAccountStatus]);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-h-screen ">
  <div className='mb-8'>
    <h1 className="text-3xl font-bold">integration</h1>
    <p className="text-muted-foreground mt-1">
      Gérez et connectez vos comptes de paiement en toute simplicité. 
    </p>
  </div>
  <IntegrationsList connections={connections} />
  </div>
  );
};

export default IntegrationsPage;