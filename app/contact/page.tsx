'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare, 
  Sparkles, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Intégrez votre logique d'envoi d'API ici
    console.log('Formulaire envoyé :', formData);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="bg-white min-h-screen text-gray-900">
      
      {/* 1. Header & Introduction */}
      <section className="py-16 bg-gradient-to-b from-orange-50/50 to-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            Une question ? Nous sommes là !
          </div>
          <h1 className="text-4xl font-black text-gray-950 tracking-tight mb-4">
            Contactez l'équipe <span className="text-orange-500">EduSpark</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 leading-relaxed">
            Que vous soyez étudiant, formateur ou simplement curieux, notre équipe est à votre écoute pour vous accompagner et répondre à toutes vos interrogations.
          </p>
        </div>
      </section>

      {/* 2. Section Principale (Grille 2 Colonnes) */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Colonne Gauche : Informations & Bannière Chatbot (5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="flex gap-1 mb-4" aria-hidden="true">
                <span className="h-1.5 w-12 rounded-full bg-orange-500" />
                <span className="h-1.5 w-2 rounded-full bg-orange-400" />
                <span className="h-1.5 w-2 rounded-full bg-orange-300" />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-950 tracking-tight mb-4">
                Nos coordonnées
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                N'hésitez pas à nous joindre directement par email ou via nos réseaux. Nous nous efforçons de vous répondre sous 24h ouvrées.
              </p>
            </div>

            {/* Liste de contacts physiques/digitaux */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="p-3 rounded-xl bg-orange-50 text-orange-500 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Email</p>
                  <p className="text-sm font-bold text-gray-900">support@eduspark.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="p-3 rounded-xl bg-orange-50 text-orange-500 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Téléphone</p>
                  <p className="text-sm font-bold text-gray-900">+33 1 23 45 67 89</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="p-3 rounded-xl bg-orange-50 text-orange-500 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Bureaux</p>
                  <p className="text-sm font-bold text-gray-900">Paris, France</p>
                </div>
              </div>
            </div>

            {/* Box promo pour le Chatbot d'aide */}
            <div className="p-6 rounded-3xl bg-gray-950 text-white relative overflow-hidden shadow-lg border border-gray-800">
              <div className="absolute top-0 right-0 -translate-y-6 translate-x-6 w-32 h-32 rounded-full bg-orange-500/10 blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-2 text-orange-500 mb-3">
                <MessageSquare className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-wider">Besoin d'une réponse immédiate ?</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Essayez notre Chatbot IA</h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-5">
                Si vous avez une question sur le contenu d'un cours ou une notion à clarifier, notre assistant intelligent est disponible 24/7 sur votre espace d'apprentissage !
              </p>
              <Button asChild size="sm" className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold rounded-xl px-5 py-4 text-xs transition-all">
                <Link href="/courses" className="flex items-center justify-center gap-2">
                  Aller sur l'espace d'étude <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Colonne Droite : Formulaire de contact (7 Cols) */}
          <div className="lg:col-span-7 bg-white border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-sm">
            <h3 className="text-xl font-bold text-gray-950 mb-6">Envoyez-nous un message</h3>
            
            {isSubmitted ? (
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 text-center animate-fade-in">
                <CheckCircle2 className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h4 className="text-lg font-bold text-gray-950 mb-2">Message envoyé avec succès !</h4>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Merci de nous avoir contactés. Un membre de l'équipe EduSpark vous répondra dans les plus brefs délais.
                </p>
                <Button 
                  onClick={() => setIsSubmitted(false)}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-xs"
                >
                  Envoyer un autre message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nom */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Votre nom
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jean Dupont"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-900"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Adresse email
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jean@exemple.com"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-900"
                    />
                  </div>
                </div>

                {/* Objet */}
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Sujet de votre demande
                  </label>
                  <input
                    type="text"
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Comment s'inscrire à un cours..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-900"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Votre message
                    </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Écrivez votre message ici..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none text-gray-900"
                  />
                </div>

                {/* Bouton d'envoi */}
                <Button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold px-6 py-5 rounded-xl shadow-sm hover:shadow-md transition-all text-sm cursor-pointer"
                >
                  <span>Envoyer le message</span>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}