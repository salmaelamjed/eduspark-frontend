import { BookOpen, TrendingUp, Sparkles } from "lucide-react";

export  const features = [
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

 // Fonction pour télécharger un fichier
export  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  
