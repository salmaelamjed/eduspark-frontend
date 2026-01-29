import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Footer from "@/components/footer";
import { BookOpen, TrendingUp, Sparkles } from "lucide-react";

export default function HomePage(){

  const features = [
  {
    icon: BookOpen,
    title: "Cours pratiques",
    description: "Apprends avec des projets réel",
  },
  {
    icon: TrendingUp,
    title: "Progression guidée",
    description: "Suivi de ton évolution pas à pas",
  },
  {
    icon: Sparkles,
    title: "Apprentissage Intelligent",
    description: "Outils modernes et accompagnement",
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
    <section className="py-16 px-4 bg-background" >
         <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
          Nos parcours populaires
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
          Choisi ton domaine et commencer des {"aujourd’hui!"}
        </p>
    </section>
    <section className="py-16 px-4 bg-background">
       <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
            Comment ca marche ?
         </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
          Commence ton apprentissage en 3 étapes simples        
          </p>
    <div className="flex  gap-40 items-center max-w-7xl mx-auto">
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
    <section className="py-16 px-4 bg-background">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
            Des paroles {"d'éloge"} des autres à propos
                 de notre présence
         </h2>
    </section>

     <section className="py-16 px-4 bg-background">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
           FAQs
         </h2>
    </section>
     <Footer/>
    </main>
  )
}

