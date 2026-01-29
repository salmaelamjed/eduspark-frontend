'use client';

import Image from "next/image";
import Link from "next/link";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { useSignInForm } from "@/hooks/sign-in/use-sign-in";


const SignIn = () => {

  const {methods,onHandleSubmit,loading }=useSignInForm();
  const {register,formState:{errors}}=methods;

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image / Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/10 items-center justify-center p-12">
        <div className="max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <Image
              src="/images/EduSparkL.svg"
              alt="EduSpark Logo"
              width={200}
              height={100}
            />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Bienvenue sur EduSpark
          </h2>
          <p className="text-muted-foreground">
            Connecte-toi pour reprendre ton parcours {"d'apprentissage"} et continuer à développer tes compétences.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-foreground mb-8">Connexion</h1>

          <form onSubmit={onHandleSubmit}  className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                {...register("email")}
                placeholder="exemple@eduspark.ma"
                type="email"
                className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                {...register("password")}
                placeholder="••••••••"
                type="password"
                className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <Label htmlFor="remember" className="flex items-center gap-2 cursor-pointer">
                <Input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-muted-foreground">Se souvenir de moi</span>
              </Label>

              <Link
                href="/mot-de-passe-oublie"
                className="text-orange-500 hover:underline font-medium"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <Button 
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-colors"
          >
             {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connexion en cours...
              </span>
            ) : 'Se connecter'} 
          </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link href="/sign-up" className="text-orange-500 hover:underline font-medium">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;