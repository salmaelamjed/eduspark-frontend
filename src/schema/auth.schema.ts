import {  z } from "zod";

export const UserLoginSchema = z.object({
  email: z.string().email({ message: "You did not enter a valid email" }),
  password: z
    .string()
    .min(8, { message: "Your password must be atleast 8 characters long" })
    .max(64, {
      message: "Tour password can not be longer then 64 characters long ",
    }),
  code: z.string().optional(),
});

export const UserRegistrationSchema = z
  .object({
    fullname: z
      .string()
      .min(3, { message: "Le nom complet doit contenir au moins 3 caractères" })
      .max(100, {
        message: "Le nom complet ne peut pas dépasser 100 caractères",
      }),
    email: z.string().email({ message: "Adresse email invalide" }),
    password: z
      .string()
      .min(8, {
        message: "Le mot de passe doit contenir au moins 8 caractères",
      })
      .max(64, {
        message: "Le mot de passe ne peut pas dépasser 64 caractères",
      })
      .refine(
        (value) =>
          /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]{8,64}$/.test(
            value ?? "",
          ),
        {
          message:
            "Le mot de passe doit contenir au moins une lettre, un chiffre et un caractère spécial (!@#$%^&* etc.)",
        },
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const ChangePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Le mot de passe actuel est requis" }),
    password: z
      .string()
      .min(8, {
        message: "Le nouveau mot de passe doit contenir au moins 8 caractères",
      })
      .max(64, {
        message: "Le nouveau mot de passe ne peut pas dépasser 64 caractères",
      })
      .refine(
        (value) =>
          /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]{8,64}$/.test(
            value ?? "",
          ),
        {
          message:
            "Le mot de passe doit contenir au moins une lettre, un chiffre et un caractère spécial",
        },
      ),
    confirmPassword: z.string(),
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const VerifyEmailSchema = z.object({
    code: z.string().length(6, "Le code doit contenir exactement 6 chiffres"),
    email: z.string().email("Email invalide"),
});

export type UserLoginProps = z.infer<typeof UserLoginSchema>;
export type UserRegistrationProps = z.infer<typeof UserRegistrationSchema>;
export type ChangePasswordProps = z.infer<typeof ChangePasswordSchema>;
export type VerifyEmailProps = z.infer<typeof VerifyEmailSchema>;