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
     
      <section className="p-4 flex justify-between items-center">
         <div className="">
          <h1 className="text-orange-500 font-extrabold text-5xl">
            Le code {" n'est"} plus un mystère. <br />
            Il est ton super-pouvoir.
          </h1>
          <p className="text-gray-400 text-xl mt-2">
            Maîtrise les langages stars (Python IA,
            Rust sécurité, JS/TS web) , <br />
            stack moderne + mindset dev pro
          </p>

          <Button className="mt-6 text-white font-bold  bg-orange-500  py-8 px-8 cursor-pointer hover:bg-orange-400">Commencer à apprendre</Button>
         </div>
         <div>
          <Image 
          src='/images/imgl1.jpg'
          alt='landing image'
          width={600}
          height={3000}
          />
         </div>
      </section>
       
        <section className="py-16 px-4 bg-background">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
          A propos {"d'EduSpark"}
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
          EduSpark est une plateforme {"d'apprentissage "} moderne conçue pour aider chacun à développer ses compétences,
           quel que soit son niveau. Notre mission est de rendre  {"l'éducation"} accessible, pratique et orientée 
           vers le monde réel.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-8 rounded-xl border-2 border-orange-500 bg-background hover:shadow-lg transition-shadow"
            >
              <div className="mb-4 text-primary">
                <feature.icon className="w-10 h-10 text-orange-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
    <DomainsSection/>

    <section className="py-16 px-4 bg-background">
       <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
            Comment ca marche ?
         </h2>
        <p className="text-center text-muted-foreground  max-w-3xl mx-auto">
          Commence ton apprentissage en 3 étapes simples        
          </p>
    <div className="flex  gap-20 items-center justify-center min-w-full mx-auto">
      <Image
      src={'/images/commentimag.png'}
      alt="Comment"
      width={300}
      height={200}
      />
      <div className="ml-8">
        <ol className="list-decimal text-xl font-normal text-gray-700">
          <li className="mb-4">Inscris-toi :  Creer ton compte gratuitement en quelques seconds</li>
          <li className="">Choisis ton parcours: Selectionne le demaine qui {"t’interesse"}.</li>
           <li className="mt-4">Apprends et progresse : Suis es cours, pratique, et avance a ton rythme</li>
        </ol>
          <Button className="mt-10 text-white font-bold  bg-orange-500  py-8 px-8 cursor-pointer hover:bg-orange-400">Commencer maintenant</Button>
      </div>
    </div>
    </section>

    <section className="py-16 bg-background px-12">
  <div className="w-full  mx-auto">
    <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
      Devenez enseignant sur EduSpark
    </h2>
    
    <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
      Partagez votre expertise, créez vos propres cours payants et formez des milliers {"d’apprenants."}
      <br />
      Rejoignez la communauté des formateurs EduSpark en quelques clics.
    </p>

    <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-4">
      <div className="">
        <Image
          src="/images/pr.png"
          width={700}
          height={600}
          alt="Professeur partageant son savoir sur EduSpark"
          className="object-contain rounded-lg"
          priority
        />
      </div>
      <div className="w-full lg:w-1/2 max-w-lg lg:max-w-none mx-auto lg:mx-0">
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

