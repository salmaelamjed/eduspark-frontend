export type IntegrationsListItemProps = {
  id: string;
  name: string;
  logo: string;
  description: string;
  title: string;
  modalDescription: string;
};

export const INTEGRATION_LIST_ITEMS: IntegrationsListItemProps[] = [
  {
    id: "1",
    name: "stripe",
    logo: "https://i.pinimg.com/1200x/9b/aa/57/9baa570450cd8ad79ff954ac81b582da.jpg",
    description:
      " Stripe vous permet de recevoir facilement les paiements de vos étudiants pour vos cours en ligne. Gérez vos revenus en toute sécurité et concentrez‑vous sur l’enseignement.",
    title: "Connecter mon compte Stripe",
    modalDescription:
      "Avec Stripe, vos cours EduSpark deviennent accessibles à tous grâce à une solution de paiement fiable et rapide.",
  },
// {
//   id: "2",
//   name: "paypal",
//   logo: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg",
//   description:
//     "PayPal vous permet de recevoir les paiements de vos étudiants de manière simple et sécurisée, partout dans le monde.",
//   title: "Connecter mon compte PayPal",
//   modalDescription:
//     "Avec PayPal, les enseignants sur EduSpark peuvent encaisser les frais de cours rapidement et offrir aux étudiants une solution de paiement internationale et reconnue."
// }

];
