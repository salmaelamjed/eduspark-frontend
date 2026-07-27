'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  count: number;
  /** Délai avant le début du fondu, en ms */
  autoDismissMs?: number;
};

const UnreadDivider = ({ count, autoDismissMs = 3500 }: Props) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

 useEffect(() => {
  timerRef.current = setTimeout(() => setIsVisible(false), autoDismissMs);
  return () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };
}, [autoDismissMs]);

  // Ne retire l'élément du DOM qu'après la fin réelle de la transition CSS,
  // évitant tout à-coup de layout pendant le fondu.
  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (e.propertyName === 'opacity' && !isVisible) {
      setIsMounted(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div
      onTransitionEnd={handleTransitionEnd}
      role="separator"
      aria-label={`${count} nouveaux messages`}
      className={cn(
        'flex items-center gap-3 overflow-hidden transition-all ease-out',
        'duration-500',
        isVisible ? 'max-h-12 opacity-100 my-4 scale-100' : 'max-h-0 opacity-0 my-0 scale-95',
      )}
    >
      <div className="h-px flex-1 bg-orange-200" />
      <span className="text-xs font-medium text-orange-500 bg-orange-50 px-3 py-1 rounded-full whitespace-nowrap">
        {count} nouveau{count > 1 ? 'x' : ''} message{count > 1 ? 's' : ''}
      </span>
      <div className="h-px flex-1 bg-orange-200" />
    </div>
  );
};

export default UnreadDivider;