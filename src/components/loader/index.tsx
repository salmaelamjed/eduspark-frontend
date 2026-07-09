'use client';

import React, { useEffect, useState } from 'react';

interface LoaderProps {
  children: React.ReactNode;
}

const Loader: React.FC<LoaderProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let currentProgress = 0;
    const timer = setInterval(() => {
      currentProgress += Math.random() * 3 + 1;
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(timer);
        setTimeout(() => setLoading(false), 400);
      }
      
      setProgress(Math.min(currentProgress, 100));
    }, 60);

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          {/* Spinner simple */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-orange-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-orange-500 border-r-orange-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>

          {/* Logo */}
          <h1 className="text-3xl font-bold text-gray-800">
            Edu<span className="text-orange-500">Spark</span>
          </h1>

          {/* Barre de progression */}
          <div className="w-56 flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-orange-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-400 font-mono min-w-[32px]">
              {Math.floor(progress)}%
            </span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default Loader;