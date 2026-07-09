'use client';

import React from 'react';
import { Button } from '../ui/button';
import { Loader } from '../loading';
import { useConnectToStripe } from '@/hooks/integrations/use-integrations';

type Props = {
  connected: boolean;
};

const StripeConnect = ({ connected }: Props) => {
  const { 
    handleConnect, 
    isLoading, 
    isAccountConnected,
    isOnboardingComplete 
  } = useConnectToStripe();

  const isConnected = connected || isAccountConnected;
  const isDisabled = isConnected || isOnboardingComplete;

  return (
    <Button
      className={`bg-orange-500 px-6 hover:bg-orange-400 hover:cursor-pointer disabled:cursor-not-allowed `}
      disabled={isDisabled}
      onClick={() => handleConnect()}
    >
      <Loader loading={isLoading}>
        {isConnected || isOnboardingComplete ? 'Connected' : 'Connect To stripe'}
      </Loader>
    </Button>
  );
};

export default StripeConnect;