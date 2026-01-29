"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserLoginProps, UserLoginSchema } from "@/schema/auth.schema";


export const useSignInForm = () => {

    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

      const methods = useForm<UserLoginProps>({
        resolver: zodResolver(UserLoginSchema),
        mode: "onChange",
        defaultValues: {
          email: "",
          password: "",
        },
      });
   

     const onHandleSubmit = methods.handleSubmit(async (values) => {
       setLoading(true);

       try {
         const response = await login({
           email: values.email,
           password: values.password,
         });

         if (response.success === true) {
           const role = response.user?.role;

           if (role === "admin" || role === "teacher") {
             router.push("/dashboard");
           } else if (role === "student") {
             router.push("/");
           }
           router.refresh();

           toast.success(response.message || "Welcome back!");
         } else {
           toast.error(response.message || "Login failed");
         }
       } catch (err) {
         const msg =
           err instanceof Error ? err.message : "Something went wrong";
         toast.error(msg || "Login failed");
       } finally {
         setLoading(false);
       }
     });

      return {
        methods,
        onHandleSubmit,
        loading,
      };

}