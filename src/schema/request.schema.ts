import { z } from "zod";

// 1 Schéma VALIDATION FORMULAIRE (création par l'étudiant)
export const CreateTeacherRequestSchema = z.object({
  domain_id: z
    .number({ message: "Veuillez sélectionner un domaine" })
    .int()
    .positive("Le domaine est requis"),

  linkedin_url: z
    .string({ message: "LinkedIn est requis" })
    .trim()
    .url({
      message:
        "Format d'URL LinkedIn invalide (ex: https://www.linkedin.com/in/...)",
    })
    .min(10, "Le lien semble trop court")
    .max(255, "URL trop longue"),

  project_url: z
    .string({ message: "Un lien vers un projet est requis" })
    .trim()
    .url({ message: "Format d'URL invalide (ex: https://github.com/...)" })
    .min(10, "Le lien semble trop court")
    .max(255, "URL trop longue"),

  motivation: z
    .string({ message: "La motivation est requise" })
    .trim()
    .min(100, "La motivation doit contenir au moins 100 caractères")
    .max(3000, "La motivation ne doit pas dépasser 3000 caractères"),
});

export type CreateTeacherRequestProps = z.infer<
  typeof CreateTeacherRequestSchema
>;
