"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignUpForm } from "@/hooks/sign-up/use-sign-up";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const SignUp = () => {
  const {methods,loading,onHandleSubmit}=useSignUpForm();
  const {register,formState:{errors}}=methods;
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/10 items-center justify-center p-12">
        <div className="max-w-md">
          <div className="flex items-center gap-2 mb-8">
           <Image
           src={'/images/EduSparkL.svg'}
           alt="Logo"
           width={200}
           height={100}
           />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Commencez votre parcours {" d'apprentissage"}
          </h2>
          <p className="text-muted-foreground">
            Rejoignez des milliers {"d'apprenants"} et développez vos compétences avec nos cours interactifs.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-foreground mb-8">Inscription</h1>
          
          <form onSubmit={onHandleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullname">Nom complet</Label>
              <Input
                id="fullname"
                {...register("fullname")}
                placeholder="John Doe"
                type="text"
                required
              />
              {errors.fullname &&(
                <p className="text-sm text-red-600 mt-1">{errors.fullname.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                {...register("email")}
                placeholder="exemple@eduspark.ma"
                type="email"
                required
              />
              {errors.email &&(
                <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                {...register("password")}
                placeholder="••••••••"
                type="password"
                required
              />
              {errors.password &&(
                <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                {...register("confirmPassword")}
                placeholder="••••••••"
                type="password"
                required
              />
              {errors.confirmPassword &&(
                <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-400 text-white px-6 py-6 w-full hover:cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Création en cours...
                </div>
              ) : (
                "Créer mon compte"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Déjà inscrit ?{" "}
            <Link href="/sign-in" className="text-orange-500 hover:underline font-medium ">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;