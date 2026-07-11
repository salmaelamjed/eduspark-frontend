'use client';

import React, { useEffect } from 'react';
import IntegrationsList from '@/components/integrations';
import { useConnectToStripe } from '@/hooks/integrations/use-integrations';
import LoadingIntegrations from './loading';

const IntegrationsPage = () => {
  const { 
    isAccountConnected, 
    isOnboardingComplete,
    isInitializing,
    checkAccountStatus 
  } = useConnectToStripe();

  const connections = {
    stripe: isAccountConnected && isOnboardingComplete
  };

  useEffect(() => {
    checkAccountStatus();
  }, [checkAccountStatus]);

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
      <LoadingIntegrations/>
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