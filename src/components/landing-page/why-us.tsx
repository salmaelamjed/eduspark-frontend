"use client";
import { motion,Variants } from "framer-motion";
import { CheckCircle2, BookOpen, Cpu, MessageSquare, Users } from "lucide-react"; // Import des icônes

// --- Variantes d'Animation ---

// Variante pour le conteneur principal (déclenche les enfants)
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const textVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { duration: 0.5, ease: "easeOut" } 
  },
};

const featureVariants: Variants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1, 
    transition: { duration: 0.4, ease: "easeOut" } 
  },
};

const iconVariants: Variants = {
  hover: { 
    scale: 1.15, 
    transition: { type: "spring", stiffness: 300 } 
  },
};
// --- Composant Principal ---

export function WhyEduSparkSection() {
  return (
    <motion.section 
      className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true, amount: 0.3 }} 
      variants={containerVariants}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* -- Bloc Texte -- */}
        <div>
          {/* Accent Visuel (Ligne orange) */}
          <motion.div className="flex gap-1 mb-4" aria-hidden="true" variants={textVariants}>
            <span className="h-1.5 w-12 rounded-full bg-orange-500" />
            <span className="h-1.5 w-2 rounded-full bg-orange-400" />
            <span className="h-1.5 w-2 rounded-full bg-orange-300" />
          </motion.div>
          
          {/* Titre */}
          <motion.h2 
            className="text-3xl font-extrabold text-gray-950 tracking-tight mb-6"
            variants={textVariants}
          >
            Pourquoi avoir créé EduSpark ?
          </motion.h2>
          
          {/* Paragraphes */}
          <motion.p className="text-gray-600 leading-relaxed mb-4" variants={textVariants}>
            {"Trop souvent, l'apprentissage en ligne est une expérience passive et solitaire. Face à une vidéo ou un texte complexe, l'étudiant se retrouve livré à lui-même lorsqu'une question surgit"}
          </motion.p>
          <motion.p className="text-gray-600 leading-relaxed mb-6" variants={textVariants}>
            <strong>{"EduSpark est né pour briser cette barrière."}</strong> {"Notre mission est de rendre l'éducation accessible, engageante et hautement personnalisée en plaçant l'accompagnement au cœur de votre parcours."}
          </motion.p>

          {/* Liste à puces (Checklist) */}
          <div className="space-y-3">
            {[
              "Des formateurs experts passionnés par la transmission.",
              "Une technologie de pointe pour des explications instantanées.",
              "Une progression fluide et mesurable à votre propre rythme.",
            ].map((text, index) => (
              <motion.div key={index} className="flex items-start gap-3" variants={textVariants}>
                <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 font-medium">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* -- Grille de Statistiques (Visuels) -- */}
        <motion.div className="grid grid-cols-2 gap-4" variants={containerVariants}>
          
          {/* Stat 1: 100% Cours structurés */}
          <motion.div 
            className="p-6 rounded-3xl bg-orange-50 border border-orange-100/50 flex flex-col justify-between h-48"
            variants={featureVariants}
          >
            <motion.div className="p-3 rounded-2xl bg-white text-orange-500 shadow-sm w-fit" whileHover="hover" variants={iconVariants}>
              <BookOpen className="w-6 h-6" />
            </motion.div>
            <div>
              <p className="text-3xl font-black text-gray-950">100%</p>
              <p className="text-xs text-gray-500 font-medium">Cours structurés</p>
            </div>
          </motion.div>

          {/* Stat 2: IA (Note: 'translate-y-4' est remplacé par 'variants' pour le décalage initial) */}
          <motion.div 
            className="p-6 rounded-3xl bg-gray-50 border border-gray-100 flex flex-col justify-between h-48"
            variants={{...featureVariants, hidden: {...featureVariants.hidden, y: 16}}} // Ajout du décalage initial
          >
            <motion.div className="p-3 rounded-2xl bg-white text-orange-500 shadow-sm w-fit" whileHover="hover" variants={iconVariants}>
              <Cpu className="w-6 h-6" />
            </motion.div>
            <div>
              <p className="text-3xl font-black text-gray-950">IA</p>
              <p className="text-xs text-gray-500 font-medium">Assistance instantanée</p>
            </div>
          </motion.div>

          {/* Stat 3: 24/7 Réponses interactives */}
          <motion.div 
            className="p-6 rounded-3xl bg-gray-50 border border-gray-100 flex flex-col justify-between h-48"
            variants={featureVariants}
          >
            <motion.div className="p-3 rounded-2xl bg-white text-orange-500 shadow-sm w-fit" whileHover="hover" variants={iconVariants}>
              <MessageSquare className="w-6 h-6" />
            </motion.div>
            <div>
              <p className="text-3xl font-black text-gray-950">24/7</p>
              <p className="text-xs text-gray-500 font-medium">Réponses interactives</p>
            </div>
          </motion.div>

          {/* Stat 4: 98% Satisfaction apprenants (Note: décalage 'y: 16') */}
          <motion.div 
            className="p-6 rounded-3xl bg-orange-500 text-white flex flex-col justify-between h-48"
            variants={{...featureVariants, hidden: {...featureVariants.hidden, y: 16}}} // Ajout du décalage initial
          >
            <motion.div className="p-3 rounded-2xl bg-orange-400 text-white shadow-sm w-fit" whileHover="hover" variants={iconVariants}>
              <Users className="w-6 h-6" />
            </motion.div>
            <div>
              <p className="text-3xl font-black">98%</p>
              <p className="text-xs text-orange-100 font-medium">Satisfaction apprenants</p>
            </div>
          </motion.div>
        
        </motion.div>

      </div>
    </motion.section>
  );
}

export default WhyEduSparkSection;