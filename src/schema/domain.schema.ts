import { z } from "zod";

export const CreateDomainSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne doit pas dépasser 100 caractères")
    .trim(),

  description: z
    .string()
    .max(2000, "La description ne doit pas dépasser 2000 caractères")
    .optional()
    .nullable()
    .transform((val) => (val?.trim() ? val.trim() : null)),

  image: z
    .instanceof(File, { message: "Vous devez sélectionner une image" })
    .refine(
      (file) => {
        const validTypes = [
          "image/jpeg",
          "image/jpg", // some browsers still return this
          "image/png",
          "image/webp",
        ];
        return validTypes.includes(file.type);
      },
      { message: "Seuls les formats JPG, JPEG, PNG et WEBP sont autorisés" },
    )
    .refine(
      (file) => file.size <= 2 * 1024 * 1024, // 2 Mo
      { message: "L'image ne doit pas dépasser 2 Mo" },
    ),
});

export type CreateDomainProps = z.infer<typeof CreateDomainSchema>;