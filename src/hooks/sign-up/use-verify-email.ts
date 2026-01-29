import { authApi } from "@/api/auth";
import { VerifyEmailProps, VerifyEmailSchema } from "@/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {  useState } from "react"
import { useForm } from "react-hook-form";
import { toast } from "sonner";




export const UserVerifyEmail=()=>{
    const router=useRouter();
    const [loading , setLoading ]=useState<boolean>(false);
    const [resendLoading, setResendLoading]=useState<boolean>(false);
    
    const methods=useForm<VerifyEmailProps>({
        resolver:zodResolver(VerifyEmailSchema),
        defaultValues:{
            code:"",
            email:localStorage.getItem("pending_verification_email") || "",
        },
        mode:"onChange",
    })

    const onHandleSubmit=methods.handleSubmit(async(values)=>{
        setLoading(true);

        try {
            const response = await authApi.verifyEmail({
                code:values.code,
                email:values.email,
            });
            if (response?.success === true) {
                toast.success(response.message)
                router.push("/sign-in");
                localStorage.removeItem("pending_verification_email");
                router.refresh()
            }
            
        } catch (error) {
            console.log("Erreurs lors de la verification de l'email:",error);
        }finally{
            setLoading(false)
        }

    })

    const onResendCode=async()=>{
        const email =localStorage.getItem("pending_verification_email");
        if(!email) return;

        setResendLoading(true);

        try {
          const response = await authApi.resendVerificationCode({ email });

          if (response?.success === true) {
            toast.success(response.message || "Nouveau code envoyé !");
          }
        } catch (error: any) {
          toast.error(
            error.response?.message ||
              "Impossible de renvoyer le code. Réessayez plus tard.",
          );
        } finally {
          setResendLoading(false);
        }
    }

    return {
      methods,
      onHandleSubmit,
      onResendCode,
      loading,
      resendLoading,
    };
}