"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, AlertCircle, Send, GraduationCap } from "lucide-react";

import { useGetDomains } from "@/hooks/domains/use-domain";
import { useCreateTeacherRequest } from "@/hooks/teacher-requests/use-teacher-requests";
import { useAuth } from "@/context/auth-context";

export default function RequestForm() {
  const { domains, loading } = useGetDomains();
  const { token } = useAuth();
  const { form, onSubmit, isSubmitting } = useCreateTeacherRequest();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full bg-white/90 backdrop-blur-md border border-slate-200/80 p-8 sm:p-10 rounded-2xl  "
    >
      <div className="mb-8 pb-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Candidature Formateur
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complétez ce formulaire pour faire étudier votre profil par notre équipe.
          </p>
        </div>
        <div className="hidden sm:flex w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 items-center justify-center shrink-0">
          <GraduationCap className="w-5 h-5" />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Domaine */}
          <FormField
            control={form.control}
            name="domain_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 text-xs font-bold uppercase tracking-wider">
                  Domaine {"d'expertise"} <span className="text-orange-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={(v) => field.onChange(v ? Number(v) : undefined)}
                  disabled={loading || isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger className="w-full h-11 border-slate-200/80 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 rounded-xl text-sm transition-all">
                      <SelectValue placeholder="Sélectionnez votre domaine" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl border-slate-200">
                    {loading ? (
                      <div className="p-3 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-orange-500" /> Chargement des domaines...
                      </div>
                    ) : domains.length === 0 ? (
                      <div className="p-3 text-center text-xs text-slate-400">
                        Aucun domaine disponible
                      </div>
                    ) : (
                      domains.map((domain) => (
                        <SelectItem
                          key={domain.id}
                          value={domain.id.toString()}
                          className="text-sm cursor-pointer rounded-lg focus:bg-orange-50 focus:text-orange-600"
                        >
                          {domain.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />

          {/* Grid pour les URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* LinkedIn */}
            <FormField
              control={form.control}
              name="linkedin_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 text-xs font-bold uppercase tracking-wider">
                    Profil LinkedIn <span className="text-slate-400 font-normal lowercase">(optionnel)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://linkedin.com/in/..."
                      className="h-11 border-slate-200/80 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 rounded-xl text-sm transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            {/* Portfolio / Projet */}
            <FormField
              control={form.control}
              name="project_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 text-xs font-bold uppercase tracking-wider">
                    Portfolio / Github <span className="text-slate-400 font-normal lowercase">(optionnel)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/..."
                      className="h-11 border-slate-200/80 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 rounded-xl text-sm transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
          </div>

          {/* Motivation */}
          <FormField
            control={form.control}
            name="motivation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 text-xs font-bold uppercase tracking-wider">
                  Motivation <span className="text-orange-500">*</span> <span className="text-slate-400 font-normal lowercase">(min. 100 car.)</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Présentez votre parcours et vos motivations pour rejoindre EduSpark..."
                    className="min-h-[120px] border-slate-200/80 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 rounded-xl text-sm resize-none transition-all"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />

          {/* Message si déconnecté */}
          {!token && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-3.5 bg-amber-500/10 text-amber-900 rounded-xl text-xs border border-amber-500/20"
            >
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Veuillez vous connecter pour pouvoir soumettre votre dossier.</span>
            </motion.div>
          )}

          {/* Bouton d'action */}
          <Button
            type="submit"
            className="w-full h-12 font-semibold rounded-xl text-white bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 transition-all text-sm shadow-lg shadow-orange-500/20 active:scale-[0.99] disabled:opacity-50 hover:cursor-pointer"
            disabled={isSubmitting || loading || !token}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Traitement du dossier...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Envoyer ma candidature
              </span>
            )}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}