import React from 'react';
import Navbar from '@/components/navbar';

export default function ApprenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Navbar /> 
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}