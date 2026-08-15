import { z } from "zod";

// ---- PUT /profile ---------------------------------------------------------
 
export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(255)
    .regex(/^[\p{L}\s\-'.]+$/u, "Le nom contient des caractères non autorisés."),
  headline: z.string().trim().max(150).optional().or(z.literal("")),
  bio: z.string().trim().max(2000).optional().or(z.literal("")),
  country: z
    .string()
    .length(2, "Code pays ISO à 2 lettres (ex: MA, FR).")
    .regex(/^[A-Za-z]{2}$/, "Code pays invalide.")
    .optional()
    .or(z.literal("")),
  date_of_birth: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (value) => {
        if (!value) return true;
        const age = getAgeFromDateString(value);
        return age >= 13 && age <= 120;
      },
      { message: "Vous devez avoir entre 13 et 120 ans." }
    ),
  expertise_level: z
    .enum(["beginner", "intermediate", "advanced", "expert"])
    .optional()
    .or(z.literal("")),
});
 
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
 
function getAgeFromDateString(dateStr: string): number {
  const dob = new Date(dateStr);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}
 
// ---- POST /profile/avatar --------------------------------------------------
 
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_AVATAR_BYTES = 2048 * 1024; // 2048 Ko, identique à AVATAR_MAX_KB côté Laravel
 
export const avatarUploadSchema = z.object({
  profile_picture: z
    .instanceof(File, { message: "Sélectionnez une image." })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Formats acceptés : JPG, PNG, WEBP.",
    })
    .refine((file) => file.size <= MAX_AVATAR_BYTES, {
      message: "L'image ne doit pas dépasser 2 Mo.",
    }),
});
 
export type AvatarUploadInput = z.infer<typeof avatarUploadSchema>;
 
// ---- PUT /profile/social-links --------------------------------------------
 
const httpsUrl = z
  .string()
  .trim()
  .refine((value) => value === "" || value.startsWith("https://"), {
    message: "L'URL doit commencer par https://",
  })
  .refine((value) => value === "" || z.string().url().safeParse(value).success, {
    message: "URL invalide.",
  });
 
export const socialLinksSchema = z.object({
  linkedin: httpsUrl.optional().or(z.literal("")),
  github: httpsUrl.optional().or(z.literal("")),
  twitter: httpsUrl.optional().or(z.literal("")),
  website: httpsUrl.optional().or(z.literal("")),
  youtube: httpsUrl.optional().or(z.literal("")),
  instagram: httpsUrl.optional().or(z.literal("")),
});
 
export type SocialLinksInput = z.infer<typeof socialLinksSchema>;
 
// ---- PUT /profile/password ---------------------------------------------
 
export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Le mot de passe actuel est requis."),
    password: z
      .string()
      .min(8, "Au moins 8 caractères.")
      .regex(/[a-z]/, "Au moins une minuscule.")
      .regex(/[A-Z]/, "Au moins une majuscule.")
      .regex(/[0-9]/, "Au moins un chiffre."),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["password_confirmation"],
  });
 
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
 
// ---- PUT /profile/email --------------------------------------------------
 
export const changeEmailSchema = z.object({
  email: z.string().trim().email("Adresse e-mail invalide.").max(255),
  current_password: z.string().min(1, "Le mot de passe actuel est requis."),
});
 
export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;
 
// ---- POST /profile/deactivate ----------------------------------------
 
export const deactivateAccountSchema = z.object({
  current_password: z.string().min(1, "Le mot de passe actuel est requis."),
  confirmation: z.literal(true, {
    errorMap: () => ({ message: "Vous devez confirmer cette action." }),
  }),
});
 
export type DeactivateAccountInput = z.infer<typeof deactivateAccountSchema>;