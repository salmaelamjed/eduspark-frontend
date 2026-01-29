// src/app/mot-de-passe-oublie/page.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding (identique aux autres pages) */}
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
            Récupère ton accès
          </h2>
          <p className="text-muted-foreground">
            Pas de panique ! Entre ton email et on {"t'envoie"} un lien pour réinitialiser ton mot de passe en quelques secondes.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-foreground mb-8">Mot de passe oublié ?</h1>
          
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email associé à ton compte</Label>
              <Input
                id="email"
                placeholder="exemple@eduspark.ma"
                type="email"
                required
                autoFocus
              />
              <p className="text-sm text-muted-foreground mt-1.5">
                On {"t'enverra"} un lien de réinitialisation sécurisé.
              </p>
            </div>

            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
              Envoyer le lien de réinitialisation
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Tu te souviens de ton mot de passe ?{" "}
            <Link href="/sign-in" className="text-orange-500 hover:underline font-medium">
              Retour à la connexion
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;