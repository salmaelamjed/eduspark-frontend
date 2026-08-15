"use client";

import { FormEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Github,
  Globe,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";
import { SaveButton } from "../../../app/profile/page";
import type { SocialLinksInput } from "@/schema/profile.schema";
import type { SocialLinks } from "@/types/user";
import { useUpdateSocialLinks } from "@/hooks/profile/use-update-social-links";
import { useDirtyCheck } from "@/hooks/use-dirty-check";

const SOCIAL_FIELDS: {
  key: keyof SocialLinksInput;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  placeholder: string;
}[] = [
  { key: "linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "https://linkedin.com/in/..." },
  { key: "github", label: "GitHub", icon: Github, placeholder: "https://github.com/..." },
  { key: "twitter", label: "Twitter / X", icon: Twitter, placeholder: "https://twitter.com/..." },
  { key: "website", label: "Site web", icon: Globe, placeholder: "https://votre-site.com" },
  { key: "youtube", label: "YouTube", icon: Youtube, placeholder: "https://youtube.com/@..." },
  { key: "instagram", label: "Instagram", icon: Instagram, placeholder: "https://instagram.com/..." },
];

interface ProfileWithLinks {
  social_links?: Partial<SocialLinksInput>;
}

const EMPTY_LINKS: SocialLinksInput = {
  linkedin: "",
  github: "",
  twitter: "",
  website: "",
  youtube: "",
  instagram: "",
};

export function SocialLinksSection({
  profile,
  token,
  onSaved,
}: {
  profile: ProfileWithLinks | null | undefined;
  token: string | null | undefined;
  onSaved?: (socialLinks: SocialLinks) => void;
}) {
  const [values, setValues] = useState<SocialLinksInput>(EMPTY_LINKS);
  const [initialValues, setInitialValues] = useState<SocialLinksInput>(EMPTY_LINKS);

  useEffect(() => {
    if (!profile?.social_links) return;
    const next = { ...EMPTY_LINKS, ...profile.social_links };
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValues(next);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInitialValues(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.social_links]);

  const { submit, status, fieldErrors, apiError } = useUpdateSocialLinks({
    token,
    onSuccess: (socialLinks) => {
      onSaved?.(socialLinks);
      // Nouveau snapshot après sauvegarde réussie
      setInitialValues((prev) => ({ ...prev, ...socialLinks }));
    },
  });

  const setField = (key: keyof SocialLinksInput, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  // Recalculé à chaque render — repasse à false si on revient aux valeurs d'origine.
  const isDirty = useDirtyCheck(values, initialValues);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isDirty) return; // rien à envoyer si aucun lien n'a changé
    void submit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {SOCIAL_FIELDS.map(({ key, label, icon: Icon, placeholder }) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={`social-${key}`} className="flex items-center gap-2">
              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              {label}
            </Label>
            <Input
              id={`social-${key}`}
              value={values[key] || ""}
              onChange={(e) => setField(key, e.target.value)}
              placeholder={placeholder}
              className="h-11 rounded-2xl border-border/60 bg-background/60 px-4"
            />
            {fieldErrors[key] && <p className="text-xs text-red-500">{fieldErrors[key]}</p>}
          </div>
        ))}
      </div>

      {apiError && <p className="text-xs text-red-500">{apiError}</p>}

      <div className="flex justify-end">
        <SaveButton
          status={status === "loading" ? "saving" : status}
          label="Enregistrer les liens"
          disabled={!isDirty}
        />
      </div>
    </form>
  );
}