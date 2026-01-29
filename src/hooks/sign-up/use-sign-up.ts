"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { UserRegistrationProps, UserRegistrationSchema } from "@/schema/auth.schema";


export const useSignUpForm=()=>{
      const [loading, setLoading] = useState<boolean>(false);
     const router = useRouter();
     const { register } = useAuth();
     
     const methods=useForm<UserRegistrationProps>({
        resolver:zodResolver(UserRegistrationSchema),
        defaultValues:{
            fullname:"",
            email:"",
            password:"",
            confirmPassword:"",
        },
        mode:"onChange",
     })

     const onHandleSubmit=methods.handleSubmit(async(values)=>{
           setLoading(true);

           try {
            const response= await register({
                name:values.fullname,
                email:values.email,
                password:values.password,
                password_confirmation:values.confirmPassword,
            })

            if (response?.success === true) {
              localStorage.setItem("pending_verification_email", values.email);
              toast.success("Success", {
                description: response.message,
              });
              router.push(`/verify-email`);
              router.refresh();
            }
            
           } catch (error) {
            console.log("Probleme lors de l'inscription:",error);
            toast.error("Error", {
              description:
                "Une erreur est survenue lors de l'inscription.Veuillez ressayer plus tard.",
            });
           }finally{
            setLoading(false);
           }
     });

 return{
    methods,
    onHandleSubmit,
    loading,
 }

}

