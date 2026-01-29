'use client';

import { useRouter } from 'next/navigation';
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
import { useState } from 'react';
import { Loader2, LogOut } from 'lucide-react';

interface ConfirmSignOutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ConfirmSignOutModal({ open, onOpenChange }: ConfirmSignOutModalProps) {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await logout();

      onOpenChange(false);
     toast.success('Déconnexion réussie');
      router.push('/');

    } catch (error) {
      console.error('Erreur lors du logout:', error);
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
            className="mt-2 sm:mt-0"
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
              <>
                <LogOut className="h-4 w-4" />
                <span>Se déconnecter</span>
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}