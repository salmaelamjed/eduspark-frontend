'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useConnectToStripe } from '@/hooks/integrations/use-integrations';

interface IntegrationsContextType {
  isAccountConnected: boolean;
  isOnboardingComplete: boolean;
  isInitializing: boolean;
  checkAccountStatus: () => Promise<void>;
  connections: {
    stripe: boolean;
  };
}

const IntegrationsContext = createContext<IntegrationsContextType | undefined>(undefined);

export const IntegrationsProvider = ({ children }: { children: ReactNode }) => {
  const { 
    isAccountConnected, 
    isOnboardingComplete,
    isInitializing,
    checkAccountStatus 
  } = useConnectToStripe();

  const connections = {
    stripe: isAccountConnected && isOnboardingComplete
  };

  return (
    <IntegrationsContext.Provider value={{
      isAccountConnected,
      isOnboardingComplete,
      isInitializing,
      checkAccountStatus,
      connections
    }}>
      {children}
    </IntegrationsContext.Provider>
  );
};

export const useIntegrations = () => {
  const context = useContext(IntegrationsContext);
  if (!context) {
    throw new Error('useIntegrations must be used within IntegrationsProvider');
  }
  return context;
};