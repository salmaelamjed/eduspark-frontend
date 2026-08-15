"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useDeactivateAccount } from "@/hooks/profile/use-deactivate-account";

interface DeactivateAccountModalProps {
  token: string | null | undefined;
  onDeactivated: () => void;
  trigger?: React.ReactNode;
}

export function DeactivateAccountModal({
  token,
  onDeactivated,
  trigger,
}: DeactivateAccountModalProps) {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");

  const { submit, status, fieldError, apiError, reset } = useDeactivateAccount({
    token,
    onSuccess: () => {
      setCurrentPassword("");
      setOpen(false);
      onDeactivated();
    },
  });

  const isSaving = status === "loading";

  const handleOpenChange = (next: boolean) => {
    if (isSaving) return;
    setOpen(next);
    if (!next) {
      setCurrentPassword("");
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="destructive" className="rounded-sm hover:cursor-pointer">
            Désactiver 
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-500">
            <AlertTriangle className="h-5 w-5" />
            Désactiver votre compte ?
          </DialogTitle>
          <DialogDescription>
            Votre profil deviendra invisible aux autres utilisateurs et vous
            serez déconnecté immédiatement.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="modal-deactivate-password">
            Confirmez avec votre mot de passe
          </Label>
          <Input
            id="modal-deactivate-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            autoFocus
          />
          {fieldError && <p className="text-xs text-red-500">{fieldError}</p>}
          {apiError && <p className="text-xs text-red-500">{apiError}</p>}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="ghost" disabled={isSaving} onClick={() => handleOpenChange(false)}>
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isSaving}
            onClick={() => submit(currentPassword)}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmer la désactivation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeactivateAccountModal;