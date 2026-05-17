'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, AlertCircle } from 'lucide-react';

import { useGetDomains } from '@/hooks/domains/use-domain';
import { useCreateTeacherRequest } from '@/hooks/teacher-requests/use-teacher-requests';
import { useAuth } from '@/context/auth-context';

export default function RequestForm() {
  const { domains, loading } = useGetDomains();
  const { token } = useAuth();
  const { form, onSubmit, isSubmitting } = useCreateTeacherRequest();

  return (
    <div className="w-full bg-white border border-slate-200 p-8 rounded-xl shadow-sm">
      <div className="mb-6 pb-4 border-b border-slate-100">
        <h3 className="text-lg font-semibold text-slate-900">Candidature Formateur</h3>
        <p className="text-xs text-slate-500 mt-1">Renseignez vos informations pour que notre équipe étudie votre profil.</p>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-5">
          
          {/* Domaine */}
          <FormField
            control={form.control}
            name="domain_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 text-xs font-semibold uppercase tracking-wider">Domaine d'expertise</FormLabel>
                <Select
                  onValueChange={(v) => field.onChange(v ? Number(v) : undefined)}
                  disabled={loading || isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger className="w-full h-10 border-slate-200 bg-slate-50/50 focus:bg-white rounded-md text-sm">
                      <SelectValue placeholder="Sélectionnez votre domaine" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {loading ? (
                      <div className="p-3 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" /> Chargement...
                      </div>
                    ) : domains.length === 0 ? (
                      <div className="p-3 text-center text-xs text-slate-400">
                        Aucun domaine disponible
                      </div>
                    ) : (
                      domains.map((domain) => (
                        <SelectItem key={domain.id} value={domain.id.toString()} className="text-sm cursor-pointer">
                          {domain.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* LinkedIn */}
          <FormField
            control={form.control}
            name="linkedin_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 text-xs font-semibold uppercase tracking-wider">
                  Profil LinkedIn <span className="text-slate-400 font-normal lowercase">(optionnel)</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://linkedin.com/in/..." 
                    className="h-10 border-slate-200 bg-slate-50/50 focus:bg-white rounded-md text-sm"
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Portfolio / Projet */}
          <FormField
            control={form.control}
            name="project_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 text-xs font-semibold uppercase tracking-wider">
                  Lien projet / portfolio <span className="text-slate-400 font-normal lowercase">(optionnel)</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://github.com/..." 
                    className="h-10 border-slate-200 bg-slate-50/50 focus:bg-white rounded-md text-sm"
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Motivation */}
          <FormField
            control={form.control}
            name="motivation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 text-xs font-semibold uppercase tracking-wider">
                  Motivation <span className="text-slate-400 font-normal lowercase">(min. 100 car.)</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Expliquez pourquoi vous souhaitez rejoindre l'équipe pédagogique..."
                    className="min-h-[110px] border-slate-200 bg-slate-50/50 focus:bg-white rounded-md text-sm resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Message d'erreur si l'utilisateur n'est pas connecté */}
          {!token && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-800 rounded-lg text-xs border border-amber-200">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Veuillez vous connecter pour soumettre votre demande.</span>
            </div>
          )}

          {/* Bouton d'action */}
          <Button
            type="submit"
            className="w-full h-11 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-500 transition-colors text-sm shadow-sm hover:cursor-pointer"
            disabled={isSubmitting || loading || !token}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Envoi en cours...
              </span>
            ) : (
              'Envoyer la demande'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}