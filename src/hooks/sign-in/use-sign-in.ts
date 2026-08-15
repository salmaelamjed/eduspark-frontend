"use client";

import {  useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/auth-context";
import { ApiError } from "@/lib/api";
import { UserLoginProps, UserLoginSchema } from "@/schema/auth.schema";

type UserRole = "admin" | "teacher" | "student";

const ROLE_REDIRECTS: Record<UserRole, string> = {
  admin: "/dashboard",
  teacher: "/dashboard",
  student: "/",
};

export const useSignInForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const methods = useForm<UserLoginProps>({
    resolver: zodResolver(UserLoginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onHandleSubmit = methods.handleSubmit(async (values) => {
    if (loading) return; 
    setLoading(true);

    try {
      const response = await login({
        email: values.email,
        password: values.password,
      });

      if (!mountedRef.current) return;

      if (response.success) {
        const role = response.user?.role as UserRole | undefined;
        const destination = role ? ROLE_REDIRECTS[role] : "/";

        toast.success(response.message || "Bon retour !");
        router.replace(destination);
        router.refresh();
        return;
      }

     if (response.needs_verification) {
       toast.error(response.message || "Veuillez vérifier votre email.");
       router.push(
         `/verify-email?email=${encodeURIComponent(response.email ?? values.email)}`,
       );
       return;
     }
     if (response.account_deactivated) {
       toast.error(response.message || "Ce compte a été désactivé.");
       methods.setError("password", { message: "Ce compte est désactivé." });
       return;
     }
     toast.error(response.message || "Échec de la connexion.");
     methods.setError("password", { message: response.message });
    } catch (err) {
      if (!mountedRef.current) return;

      const message =
        err instanceof ApiError
          ? err.message
          : "Une erreur est survenue. Veuillez réessayer.";
      toast.error(message);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  });

  return {
    methods,
    onHandleSubmit,
    loading,
  };
};
