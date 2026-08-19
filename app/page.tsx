import Navbar from "@/components/navbar"
import Footer from "@/components/footer";
import RequestForm from "@/components/request-form";
import { DomainsSection } from "@/components/domain-section";
      import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Briefcase, Percent } from "lucide-react";
import { HeroSection } from "@/components/landing-page/hero-block";
import WhyEduSparkSection from "@/components/landing-page/why-us";
import { HowItWorksSection } from "@/components/landing-page/how-it-works";
import { BecomeTeacherHeroSection } from "@/components/landing-page/BecomeTeacherSection";
import { BestCoursesSection } from "@/components/landing-page/best-courses";

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
      <HeroSection/>
      <WhyEduSparkSection/>
      <DomainsSection/>
      <BestCoursesSection/> 
      <HowItWorksSection/>
     <BecomeTeacherHeroSection/>
    
  

    
    {/* <section className="py-16 px-4 bg-background">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
            Des paroles {"d'éloge"} des autres à propos
                 de notre présence
         </h2>
    </section> */}

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

