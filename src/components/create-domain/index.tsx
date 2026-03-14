"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(1, "Le nom est obligatoire").max(100),
  description: z.string().optional(),

  image: z
    .any()                             // ← accept anything during SSR
    .refine(
      (files) => {
        // Skip validation on server / during SSR
        if (typeof window === "undefined") return true;
        return files instanceof FileList;
      },
      "Type de fichier invalide"
    )
    .refine(
      (files) => {
        if (typeof window === "undefined") return true;
        return files instanceof FileList && files.length > 0;
      },
      "L'image est obligatoire"
    )
    .refine(
      (files) => {
        if (typeof window === "undefined") return true;
        return files instanceof FileList && files[0]?.size <= 5 * 1024 * 1024;
      },
      "L'image ne doit pas dépasser 5MB"
    )
    .refine(
      (files) => {
        if (typeof window === "undefined") return true;
        const file = files?.[0];
        return (
          file &&
          ["image/jpeg", "image/png", "image/webp"].includes(file.type)
        );
      },
      "Format accepté : JPEG, PNG ou WebP"
    ),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateDomainFormProps {
  onSuccess?: () => void;
}

export default function CreateDomainForm({ onSuccess }: CreateDomainFormProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { token } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);

      if (data.description) {
        formData.append("description", data.description);
      }

      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }

      const response = await fetch("http://localhost:8000/api/domains", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erreur lors de la création");
      }

      toast.success("Domaine créé avec succès !");
      form.reset();
      setPreview(null);
      
      // Appeler le callback de succès si fourni
      onSuccess?.();
      
    } catch (err: any) {
      console.error("Erreur:", err);
      toast.error(err?.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    form.setValue("image", null as any);
    setPreview(null);
  };

  return (
    <Card className="max-w-2xl mx-auto border-0 shadow-none">
      <CardHeader>
        <CardTitle>Créer un nouveau domaine</CardTitle>
        <CardDescription>
          Ajoutez un domaine de formation avec une image et une description
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Champ Nom */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du domaine *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Marketing Digital"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormDescription>
                    Le nom principal de votre domaine de formation
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Champ Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez brièvement ce domaine..."
                      className="resize-none"
                      rows={4}
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Champ Image */}
            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Image *</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {preview ? (
                        <div className="relative w-full h-48 border-2 border-dashed rounded-lg overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={preview}
                            alt="Prévisualisation"
                            className="w-full h-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={clearImage}
                            disabled={loading}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="relative">
                          <Input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            id="image-upload"
                            disabled={loading}
                            {...field}
                            onChange={(e) => {
                              onChange(e.target.files);
                              handleImageChange(e.target.files);
                            }}
                          />
                          <label
                            htmlFor="image-upload"
                            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                              <p className="mb-2 text-sm text-muted-foreground">
                                <span className="font-semibold">
                                  Cliquez pour uploader
                                </span>{" "}
                                ou glissez-déposez
                              </p>
                              <p className="text-xs text-muted-foreground">
                                PNG, JPG ou WebP (MAX. 5MB)
                              </p>
                            </div>
                          </label>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bouton de soumission */}
            <Button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-400" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création en cours...
                </>
              ) : (
                "Créer le domaine"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}