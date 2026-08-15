// components/profile/avatar-upload.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAvatarUpload } from "@/hooks/profile/use-avatar-upload";
import { cn } from "@/lib/utils";
import { Camera, Loader2, Trash2, UploadCloud } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

interface AvatarUploaderProps {
  token: string | null | undefined;
  currentUrl?: string | null;
  name?: string;
  onUploaded?: (url: string) => void;
  onDeleted?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-16 w-16",
  md: "h-24 w-24",
  lg: "h-32 w-32",
};

export function AvatarUploader({
  token,
  currentUrl,
  name,
  onUploaded,
  onDeleted,
  className,
  size = "md",
}: AvatarUploaderProps) {
  const { previewUrl, status, progress, errorMessage, isBusy, selectFile, deleteAvatar } =
    useAvatarUpload({
      token,
      currentUrl,
      onUploaded,
      onDeleted,
    });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await selectFile(file);
      if (errorMessage) {
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erreur lors de l'upload"
      );
    } finally {
      // Réinitialiser l'input pour permettre de sélectionner le même fichier
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAvatar();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erreur lors de la suppression"
      );
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative">
        {/* Spinner de progression circulaire */}
        {status === "uploading" && (
          <div className="absolute -inset-3 z-10">
            <svg
              className="h-full w-full -rotate-90"
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              {/* Cercle de fond */}
              <circle
                cx="50"
                cy="50"
                r="47"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-muted-foreground/20"
              />
              {/* Cercle de progression */}
              <circle
                cx="50"
                cy="50"
                r="47"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${(progress / 100) * 295} 295`}
                className="text-orange-500 transition-all duration-300 ease-out"
              />
            </svg>
          </div>
        )}

        <div className={cn("relative", sizeClasses[size])}>
          <Avatar className={cn("h-full w-full border-2 border-border/60", sizeClasses[size])}>
            {previewUrl && (
              <AvatarImage
                src={previewUrl}
                alt={name || "Avatar"}
                className="object-cover"
              />
            )}
            <AvatarFallback className="bg-orange-500/20 text-xl font-semibold text-orange-500">
              {status === "uploading" ? (
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
              ) : (
                getInitials(name)
              )}
            </AvatarFallback>
          </Avatar>

          {/* Overlay de progression */}
          {status === "uploading" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
              <span className="text-sm font-bold text-white">
                {Math.round(progress)}%
              </span>
            </div>
          )}

          {/* Bouton d'upload overlay */}
          {!isBusy && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 opacity-0 transition-all duration-300 hover:bg-black/40 hover:opacity-100 group"
                    aria-label="Changer l'avatar"
                  >
                    <Camera className="h-8 w-8 text-white opacity-0 transition-all duration-300 group-hover:opacity-100" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{"Changer l'avatar"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* Message d'erreur */}
      {status === "error" && errorMessage && (
        <p className="text-xs text-red-500 text-center max-w-50">
          {errorMessage}
        </p>
      )}

      {/* Boutons d'action */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isBusy}
          className="rounded-full border-border/60 bg-white/5 px-4 py-2 text-xs text-foreground hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "uploading" ? (
            <>
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              Upload {Math.round(progress)}%
            </>
          ) : (
            <>
              <UploadCloud className="mr-2 h-3 w-3" />
              Changer
            </>
          )}
        </Button>

        {previewUrl && !isBusy && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="rounded-full px-4 py-2 text-xs text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
          >
            <Trash2 className="mr-2 h-3 w-3" />
            Supprimer
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Uploader une image de profil"
      />
    </div>
  );
}