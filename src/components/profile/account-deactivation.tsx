"use client";

import { AlertTriangle } from "lucide-react";
import DeactivateAccountModal from "../modal/deactive-account-modal";

export function AccountDeactivation({
  token,
  onDeactivated,
}: {
  token: string | null | undefined;
  onDeactivated: () => void;
}) {
  return (
    <section className="flex flex-row justify-between items-center rounded-2xl border border-red-500/30 bg-red-500/5 p-6 backdrop-blur">
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-red-500">
        <AlertTriangle className="h-4 w-4" />
        Zone dangereuse
      </div>
      <p className="mb-4 mt-1 text-xs text-muted-foreground">
        Désactiver votre compte le rendra invisible aux autres utilisateurs.
      </p>
      </div>
      
      <DeactivateAccountModal token={token} onDeactivated={onDeactivated} />
    </section>
  );
}

export default AccountDeactivation;