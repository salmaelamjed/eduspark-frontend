'use client'
import { Card } from '../ui/card';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface RealTimeModeProps {
  mode: 'ai' | 'human' | null;
  onSwitchToHuman: () => Promise<void>;
  onSwitchToAi: () => Promise<void>;
}

const RealTimeMode = ({ mode, onSwitchToHuman, onSwitchToAi }: RealTimeModeProps) => {
  const [isSwitching, setIsSwitching] = useState(false);

  const handleModeToggle = async (checked: boolean) => {
    setIsSwitching(true);
    try {
      if (checked) {
        await onSwitchToHuman();
      } else {
        await onSwitchToAi();
      }
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-1">
      <Switch
        checked={mode === 'human'}
        onCheckedChange={handleModeToggle}
        disabled={isSwitching}
        className="data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-blue-500 scale-75"
      />
      <span className={cn(
        'text-xs font-medium',
        mode === 'human' ? 'text-orange-500' : 'text-blue-500'
      )}>
        {mode === 'human' ? 'Enseignant en ligne' : 'Mode IA'}
      </span>
    </div>
  );
};

export default RealTimeMode;