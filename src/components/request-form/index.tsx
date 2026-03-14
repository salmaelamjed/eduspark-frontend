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

import { useGetDomains } from '@/hooks/domains/use-domain';
import { useCreateTeacherRequest } from '@/hooks/teacher-requests/use-teacher-requests';
import { useAuth } from '@/context/auth-context';

export default function RequestForm() {
  const { domains, loading } = useGetDomains();
  const {token}=useAuth()

  const { form, onSubmit, isSubmitting } = useCreateTeacherRequest();

  return (
    <div className=" mx-auto p-6 bg-white border rounded-lg ">

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Domaine */}
          <FormField
            control={form.control}
            name="domain_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Domaine {"d'expertise"}</FormLabel>
                <Select
                  onValueChange={(v) => field.onChange(v ? Number(v) : undefined)}
                  disabled={loading || isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder="Sélectionnez votre domaine" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className='w-125'>
                    {loading ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        Chargement des domaines...
                      </div>
                    ) : domains.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        Aucun domaine disponible
                      </div>
                    ) : (
                      domains.map((domain) => (
                        <SelectItem key={domain.id} value={domain.id.toString()}>
                          {domain.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linkedin_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profil LinkedIn (optionnel)</FormLabel>
                <FormControl>
                  <Input placeholder="https://linkedin.com/in/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="project_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lien vers un projet / portfolio (optionnel)</FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="motivation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Motivation (min. 100 caractères)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Expliquez pourquoi vous souhaitez rejoindre l'équipe pédagogique..."
                    className="max-h-30"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full hover:cursor-pointer bg-orange-500 hover:bg-orange-400"
            disabled={isSubmitting || loading || !token}
          >
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}
          </Button>
        </form>
      </Form>
    </div>
  );
}