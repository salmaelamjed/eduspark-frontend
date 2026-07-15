import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Footer from "@/components/footer";
import RequestForm from "@/components/request-form";
import { features } from "@/constants/landing";
import { DomainsSection } from "@/components/domain-section";
      import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Briefcase, Percent, Sparkles } from "lucide-react";

export default function HomePage(){
   const faqs = [
     {
       value: "courses",
       question: "Comment accéder aux cours ?",
       answer: "Une fois inscrit, vous avez accès à tous les cours de votre parcours. Connectez-vous simplement à votre compte et commencez à apprendre à votre rythme.",
     },
     {
       value: "certification",
       question: "Est-ce que je reçois un certificat ?",
       answer: "Oui ! À la fin de chaque parcours, vous recevez un certificat de réussite que vous pouvez partager sur LinkedIn ou ajouter à votre CV.",
     },
     {
       value: "support",
       question: "Comment contacter le support ?",
       answer: "Notre équipe est disponible par email, chat en direct ou téléphone. Nous répondons sous 24h les jours ouvrés.",
     },
     {
       value: "payment",
       question: "Quels sont les modes de paiement ?",
       answer: "Nous acceptons les cartes bancaires, PayPal et les virements. Des facilités de paiement sont disponibles pour les formations longues.",
     },
   ];


  return (
    <main>
      <Navbar/>
     
     <section className="p-8 flex flex-col md:flex-row justify-between items-center bg-background">
  <div className="w-full lg:w-[60%] flex flex-col gap-7">

          {/* Pill badge */}
          <div className="fade-up d1 inline-flex items-center gap-2 self-start px-4 py-2 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-sm font-semibold">
            <Sparkles className="w-4 h-4" />
            La plateforme des ambitieux
          </div>

          {/* Headline */}
          <h1 className="fade-up d2 font-black leading-[1.08] tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
            <span
              className="block text-gray-900"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
            >
              Apprends.{" "}
              <span
                className="inline-block"
                style={{
                  background: "linear-gradient(90deg, #f97316, #fb923c)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Progresse.
              </span>
            </span>
            <span
              className="block text-gray-900 mt-1"
              style={{ fontSize: "clamp(2.6rem, 5vw, 4rem)" }}
            >
              Libère ton{" "}
              <span
                className="relative inline-block"
                style={{
                  background: "linear-gradient(90deg, #ea580c, #f97316)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                potentiel.
                {/* Underline accent */}
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="6"
                  viewBox="0 0 200 6"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 5 Q50 0 100 5 Q150 10 200 5"
                    stroke="#f97316"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </span>
          </h1>

          {/* Description */}
          <p className="fade-up d3 text-gray-500 text-lg leading-relaxed max-w-lg">
            Une plateforme unique pour explorer{" "}
            <strong className="font-semibold text-gray-800">
              la programmation, le design, le business, les langues et bien plus encore.
            </strong>{" "}
            Des parcours guidés, des outils modernes et un mindset qui {"t'accompagne"} vers la réussite.
          </p>

      

      
        </div>

  <div className="mt-10 md:mt-0 md:ml-12">
    <Image 
      src="/images/imgl1.jpg"
      alt="Landing image"
      width={500}
      height={400}
      className=" object-cover"
    />
  </div>
    </section>

       
        <section className="relative py-20 px-4 bg-background overflow-hidden">
  {/* Optionnel : Un léger halo lumineux en arrière-plan pour dynamiser la section */}
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

  <div className="container relative mx-auto max-w-5xl">
    {/* En-tête de la section */}
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h2  className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
        À propos {" d'EduSpark"}
      </h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        EduSpark est une plateforme {"d'apprentissage"} moderne conçue pour aider chacun à développer ses compétences, 
        quel que soit son niveau. Notre mission est de rendre {"l'éducation"} accessible, pratique et orientée vers le monde réel.
      </p>
    </div>
    
    {/* Grille des fonctionnalités */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <div
          key={index}
          className="group flex flex-col items-center text-center p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-orange-500/50 hover:bg-card  "
        >
          {/* Conteneur de l'icône avec effet de background au survol */}
          <div className="mb-5 p-4 rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-950/30 transition-colors duration-300 group-hover:bg-orange-500 group-hover:text-white">
            <feature.icon className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.75} />
          </div>

          <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">
            {feature.title}
          </h3>
          
          <p className="text-muted-foreground text-sm leading-relaxed">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>
    <DomainsSection/>


    <section className="py-16 px-4 md:py-24 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
            Comment ça marche ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Commence ton apprentissage en 3 étapes simples et rapides.
          </p>
        </div>

        {/* Contenu */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-20">
          {/* Bloc Image */}
          <div className="relative w-full max-w-89 aspect-4/3 md:max-w-100">
            <Image
      src="/images/commentimag.png"
      alt="Comment"
      width={300}
      height={150}
      className="rounded-lg "
    />
          </div>

          {/* Bloc Liste & Action */}
          <div className="flex-1 max-w-xl">
            <ol className="space-y-6 list-none counter-reset">
              {/* Étape 1 */}
              <li className="flex gap-4 items-start">
                <span className="flex items-center justify-center bg-orange-100 text-orange-600 font-bold rounded-full h-8 w-8 shrink-0 text-sm mt-1">
                  1
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-1">Inscris-toi</h3>
                  <p className="text-muted-foreground">Crée ton compte gratuitement en quelques secondes.</p>
                </div>
              </li>

              {/* Étape 2 */}
              <li className="flex gap-4 items-start">
                <span className="flex items-center justify-center bg-orange-100 text-orange-600 font-bold rounded-full h-8 w-8 shrink-0 text-sm mt-1">
                  2
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-1">Choisis ton parcours</h3>
                  <p className="text-muted-foreground">Sélectionne le domaine qui {"t'intéresse"}.</p>
                </div>
              </li>

              {/* Étape 3 */}
              <li className="flex gap-4 items-start">
                <span className="flex items-center justify-center bg-orange-100 text-orange-600 font-bold rounded-full h-8 w-8 shrink-0 text-sm mt-1">
                  3
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-1">Apprends et progresse</h3>
                  <p className="text-muted-foreground">Suis les cours, pratique et avance à ton rythme.</p>
                </div>
              </li>
            </ol>

            {/* Bouton d'action */}
            <div className="mt-10 text-center md:text-left">
              <Button className="text-white font-bold bg-orange-500 hover:bg-orange-600 h-12 px-8 rounded-xl transition-all shadow-md hover:shadow-lg">
                Commencer maintenant
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>


 <section className="py-20 bg-slate-50 px-6 sm:px-12 border-t border-b border-slate-100">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Colonne Gauche : Textes & Arguments (5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-orange-600 mb-2">
                Opportunité de carrière
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
                Devenez enseignant sur EduSpark
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Partagez votre expertise avec notre communauté. Créez vos cours en toute autonomie, 
                générez des revenus et accompagnez des milliers {"d'apprenants"} dans leur développement.
              </p>
            </div>

            {/* Petits indicateurs discrets et pros pour meubler l'espace de manière utile */}
            <div className="pt-6 border-t border-slate-200 space-y-4 hidden sm:block">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="w-8 h-8 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                  <Briefcase className="w-4 h-4" />
                </div>
                <span>Flexibilité totale sur vos horaires et vos contenus</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="w-8 h-8 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                  <Percent className="w-4 h-4" />
                </div>
                <span>Rémunération attractive et transparente</span>
              </div>
            </div>
          </div>

          {/* Colonne Droite : Formulaire épuré (7 cols) */}
          <div className="lg:col-span-7 w-full">
            <RequestForm />
          </div>

        </div>
      </div>
    </section>
    
  

    
    <section className="py-16 px-4 bg-background">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
            Des paroles {"d'éloge"} des autres à propos
                 de notre présence
         </h2>
    </section>

    <section className="py-20 px-4 bg-secondary/30">
  <div className="max-w-4xl mx-auto">
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
        Questions fréquentes
      </h2>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        Tout ce que vous devez savoir pour commencer votre apprentissage
      </p>
    </div>

    <Accordion type="single" collapsible defaultValue="courses" className="w-full">
      {faqs.map((faq) => (
        <AccordionItem 
          key={faq.value} 
          value={faq.value}
          className="bg-card border border-border rounded-xl mb-4 px-6 "
        >
          <AccordionTrigger className="text-left text-foreground font-semibold hover:no-underline py-5 hover:cursor-pointer">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pb-5">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
</section>
     <Footer/>
    </main>
  )
}

