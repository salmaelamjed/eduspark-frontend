// src/components/Footer.tsx
import React from 'react';
import Image from 'next/image';
import { Copyright, Facebook, Instagram, MessageCircle } from 'lucide-react'; // Ajoute les icônes sociales
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t mt-auto">
      <div className="container mx-auto px-6 py-12 md:py-16">
        {/* Grid responsive : 1 colonne mobile → 4 colonnes desktop */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Colonne 1 : Logo + description */}
          <div className="flex flex-col items-start">
            <Image
              src="/images/EduSparkL.svg"
              alt="EduSpark Logo"
              width={140}
              height={60}
              priority
              className="mb-6"
            />
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              EduSpark est une plateforme d’apprentissage moderne qui te permet de développer tes compétences à ton rythme, où que tu sois.
            </p>
          </div>

          {/* Colonne 2 : Liens rapides (navigation principale) */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Liens rapides</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
              </li>
              <li>
                <Link href="/cours" className="hover:text-primary transition-colors">Cours</Link>
              </li>
              <li>
                <Link href="/parcours" className="hover:text-primary transition-colors">Parcours</Link>
              </li>
              <li>
                <Link href="/a-propos" className="hover:text-primary transition-colors">À propos</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Informations légales */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Informations</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link>
              </li>
              <li>
                <Link href="/politique-confidentialite" className="hover:text-primary transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/conditions-utilisation" className="hover:text-primary transition-colors">
                  Conditions d’utilisation
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-primary transition-colors">Support</Link>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Réseaux sociaux */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Suivez-nous</h3>
            <div className="flex gap-5">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6" />
              </Link>
              <Link
                href="https://wa.me/tonnumero"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>

        <div className=" pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground flex items-center justify-center gap-1.5">
            <Copyright className="h-4 w-4" />
            <span>{currentYear} EduSpark – Tous droits réservés.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;