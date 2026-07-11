'use client';

import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/context/auth-context';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useEffect, useRef, useState } from 'react';
import { Loader2, LogOut } from 'lucide-react';

interface ConfirmSignOutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ConfirmSignOutModal({ open, onOpenChange }: ConfirmSignOutModalProps) {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const awaitingRedirectRef = useRef(false);

useEffect(() => {
  if (!awaitingRedirectRef.current || pathname !== '/') return;

  awaitingRedirectRef.current = false;

  // On synchronise l'UI locale avec un changement d'état externe (la route,
  // pilotée par le router, hors du contrôle de ce composant) : c'est le cas
  // d'usage explicitement prévu par la règle react-hooks/set-state-in-effect
  // ("calling setState in a callback function when external state changes").
  /* eslint-disable react-hooks/set-state-in-effect */
  setIsLoggingOut(false);
  onOpenChange(false);
}, [pathname, onOpenChange]);

  const handleSignOut = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await logout();
      toast.success('Déconnexion réussie');

      if (pathname === '/') {
        // Déjà sur la home : rien à attendre côté navigation.
        setIsLoggingOut(false);
        onOpenChange(false);
      } else {
        awaitingRedirectRef.current = true;
        router.push('/');
        // Ne PAS fermer le modal ici : il reste affiché (spinner) jusqu'à
        // ce que le useEffect ci-dessus détecte l'arrivée sur "/".
      }
    } catch (error) {
      console.error('Erreur lors du logout:', error);
      awaitingRedirectRef.current = false;
      setIsLoggingOut(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isLoggingOut) {
      onOpenChange(newOpen);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <LogOut className="h-5 w-5" />
            Déconnexion
          </AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à votre compte.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isLoggingOut}
            className="mt-2 sm:mt-0 hover:cursor-pointer"
          >
            Annuler
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleSignOut();
            }}
            disabled={isLoggingOut}
            className="bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Déconnexion...</span>
              </>
            ) : (
              <div className="hover:cursor-pointer flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span>Se déconnecter</span>
              </div>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}