'use client'

import { getApiErrorMessage, SaveButton, SectionStatus } from "../../../app/profile/page";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { format, parseISO, isValid, setMonth, setYear } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "@/schema/profile.schema";
import { useEffect, useState, FormEvent } from "react";
import { toFieldErrors } from "@/constants/zod-errors-convert";
import { profileApi } from "@/api/profile";
import { toast } from "sonner";
import { useDirtyCheck } from "@/hooks/use-dirty-check";

// Liste des pays (ISO Alpha-2)
const COUNTRIES = [
  { code: "AF", name: "Afghanistan" },
  { code: "ZA", name: "Afrique du Sud" },
  { code: "AL", name: "Albanie" },
  { code: "DZ", name: "Algérie" },
  { code: "DE", name: "Allemagne" },
  { code: "AD", name: "Andorre" },
  { code: "AO", name: "Angola" },
  { code: "SA", name: "Arabie Saoudite" },
  { code: "AR", name: "Argentine" },
  { code: "AM", name: "Arménie" },
  { code: "AU", name: "Australie" },
  { code: "AT", name: "Autriche" },
  { code: "AZ", name: "Azerbaïdjan" },
  { code: "BE", name: "Belgique" },
  { code: "BJ", name: "Bénin" },
  { code: "BR", name: "Brésil" },
  { code: "BG", name: "Bulgarie" },
  { code: "BF", name: "Burkina Faso" },
  { code: "CA", name: "Canada" },
  { code: "CL", name: "Chili" },
  { code: "CN", name: "Chine" },
  { code: "CY", name: "Chypre" },
  { code: "CO", name: "Colombie" },
  { code: "CG", name: "Congo-Brazzaville" },
  { code: "CD", name: "Congo-Kinshasa" },
  { code: "KR", name: "Corée du Sud" },
  { code: "CI", name: "Côte d'Ivoire" },
  { code: "HR", name: "Croatie" },
  { code: "DK", name: "Danemark" },
  { code: "EG", name: "Égypte" },
  { code: "AE", name: "Émirats Arabes Unis" },
  { code: "ES", name: "Espagne" },
  { code: "EE", name: "Estonie" },
  { code: "US", name: "États-Unis" },
  { code: "FI", name: "Finlande" },
  { code: "FR", name: "France" },
  { code: "GA", name: "Gabon" },
  { code: "GR", name: "Grèce" },
  { code: "GN", name: "Guinée" },
  { code: "HT", name: "Haïti" },
  { code: "HU", name: "Hongrie" },
  { code: "IN", name: "Inde" },
  { code: "ID", name: "Indonésie" },
  { code: "IQ", name: "Irak" },
  { code: "IR", name: "Iran" },
  { code: "IE", name: "Irlande" },
  { code: "IS", name: "Islande" },
  { code: "IL", name: "Israël" },
  { code: "IT", name: "Italie" },
  { code: "JP", name: "Japon" },
  { code: "JO", name: "Jordanie" },
  { code: "QA", name: "Qatar" },
  { code: "KE", name: "Kenya" },
  { code: "KW", name: "Koweït" },
  { code: "LB", name: "Liban" },
  { code: "LY", name: "Libye" },
  { code: "LU", name: "Luxembourg" },
  { code: "MA", name: "Maroc" },
  { code: "MX", name: "Mexique" },
  { code: "MC", name: "Monaco" },
  { code: "NO", name: "Norvège" },
  { code: "NZ", name: "Nouvelle-Zélande" },
  { code: "OM", name: "Oman" },
  { code: "PK", name: "Pakistan" },
  { code: "NL", name: "Pays-Bas" },
  { code: "PL", name: "Pologne" },
  { code: "PT", name: "Portugal" },
  { code: "RO", name: "Roumanie" },
  { code: "GB", name: "Royaume-Uni" },
  { code: "RU", name: "Russie" },
  { code: "SN", name: "Sénégal" },
  { code: "SE", name: "Suède" },
  { code: "CH", name: "Suisse" },
  { code: "TN", name: "Tunisie" },
  { code: "TR", name: "Turquie" },
  { code: "UA", name: "Ukraine" },
  { code: "VN", name: "Viêt Nam" },
];

const EXPERTISE_LEVELS = [
  { value: "beginner", label: "Débutant" },
  { value: "intermediate", label: "Intermédiaire" },
  { value: "advanced", label: "Avancé" },
  { value: "expert", label: "Expert" },
];

interface ProfileLike {
  name?: string;
  headline?: string;
  bio?: string;
  country?: string;
  date_of_birth?: string;
  expertise_level?: UpdateProfileInput["expertise_level"];
}

const EMPTY_VALUES: UpdateProfileInput = {
  name: "",
  headline: "",
  bio: "",
  country: "",
  date_of_birth: "",
  expertise_level: "",
};

export function BasicInfoSection({
  profile,
  token,
  onSaved,
}: {
  profile: ProfileLike | null | undefined;
  token: string | null | undefined;
  onSaved: (updates: Partial<UpdateProfileInput>) => void;
}) {
  const [values, setValues] = useState<UpdateProfileInput>(EMPTY_VALUES);
  // Snapshot des valeurs telles que reçues du serveur — référence pour le dirty check.
  const [initialValues, setInitialValues] = useState<UpdateProfileInput>(EMPTY_VALUES);

  const [errors, setErrors] = useState<Partial<Record<keyof UpdateProfileInput, string>>>({});
  const [status, setStatus] = useState<SectionStatus>("idle");
  const [apiError, setApiError] = useState<string | null>(null);

  const [openCountry, setOpenCountry] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());

  useEffect(() => {
    if (!profile) return;
    const next: UpdateProfileInput = {
      name: profile.name ?? "",
      headline: profile.headline ?? "",
      bio: profile.bio ?? "",
      country: profile.country ?? "",
      date_of_birth: profile.date_of_birth ?? "",
      expertise_level: profile.expertise_level ?? "",
    };

    // Hydratation du formulaire depuis une prop qui arrive de manière
    // asynchrone (fetch du profil géré par le parent via useProfile()).
    // `profile` ne change de référence qu'au chargement/refetch, donc pas
    // de boucle de re-render — ce n'est pas un effet redondant à éliminer.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValues(next);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInitialValues(next);

    if (profile.date_of_birth && isValid(parseISO(profile.date_of_birth))) {
      setCalendarMonth(parseISO(profile.date_of_birth));
    }
  }, [profile]);

  const setField = <K extends keyof UpdateProfileInput>(key: K, value: UpdateProfileInput[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  // Recalculé à chaque render : si l'utilisateur revient à la valeur d'origine,
  // isDirty repasse à false et le bouton se redésactive automatiquement.
  const isDirty = useDirtyCheck(values, initialValues);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Rien à envoyer si aucun champ n'a réellement changé.
    if (!isDirty) return;

    const result = updateProfileSchema.safeParse(values);
    if (!result.success) {
      setErrors(toFieldErrors(result.error));
      return;
    }
    if (!token) return;

    setErrors({});
    setApiError(null);
    setStatus("saving");
    try {
      const response = await profileApi.update(result.data, token);

      onSaved(result.data);
      setInitialValues(values); // nouveau snapshot après sauvegarde réussie
      setStatus("success");
      toast.success(response.message);
      window.setTimeout(() => setStatus("idle"), 1500);
    } catch (error) {
      setStatus("error");
      setApiError(getApiErrorMessage(error, "Échec de la mise à jour du profil."));
    }
  };

  const selectedDate = values.date_of_birth && isValid(parseISO(values.date_of_birth))
    ? parseISO(values.date_of_birth)
    : undefined;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1930 + 1 }, (_, i) => currentYear - i);
  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const selectedCountryObj = COUNTRIES.find((c) => c.code === values.country);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Nom */}
        <div className="space-y-2">
          <Label htmlFor="profile-name">Nom complet</Label>
          <Input
            id="profile-name"
            value={values.name}
            onChange={(e) => setField("name", e.target.value)}
            className="h-11 rounded-2xl border-border/60 bg-background/60 px-4"
            autoComplete="name"
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>

        {/* PAYS */}
        <div className="space-y-2 flex flex-col">
          <Label htmlFor="profile-country">Pays</Label>
          <Popover open={openCountry} onOpenChange={setOpenCountry}>
            <PopoverTrigger asChild>
              <Button
                id="profile-country"
                variant="outline"
                role="combobox"
                aria-expanded={openCountry}
                className={cn(
                  "h-11 w-full justify-between rounded-2xl border-border/60 bg-background/60 px-4 font-normal",
                  !values.country && "text-muted-foreground"
                )}
              >
                {selectedCountryObj
                  ? `${selectedCountryObj.name} (${selectedCountryObj.code})`
                  : "Sélectionner un pays..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0 rounded-2xl" align="start">
              <Command className="rounded-2xl">
                <CommandInput placeholder="Rechercher un pays..." className="h-11" />
                <CommandList className="max-h-60 overflow-y-auto p-1">
                  <CommandEmpty>Aucun pays trouvé.</CommandEmpty>
                  <CommandGroup>
                    {COUNTRIES.map((c) => (
                      <CommandItem
                        key={c.code}
                        value={`${c.name} ${c.code}`}
                        onSelect={() => {
                          setField("country", c.code);
                          setOpenCountry(false);
                        }}
                        className="rounded-xl cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            values.country === c.code ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {c.name} ({c.code})
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {errors.country && <p className="text-xs text-red-500">{errors.country}</p>}
        </div>

        {/* NIVEAU D'EXPERTISE */}
        <div className="space-y-2 ">
          <Label htmlFor="profile-expertise">Niveau d&apos;expertise</Label>
          <Select
            value={values.expertise_level || ""}
            onValueChange={(val) =>
              setField("expertise_level", val as UpdateProfileInput["expertise_level"])
            }
          >
            <SelectTrigger
              id="profile-expertise"
              className="h-11 w-full rounded-2xl border-border/60 bg-background/60 px-4"
            >
              <SelectValue placeholder="Sélectionner un niveau d'expertise" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              {EXPERTISE_LEVELS.map((exp) => (
                <SelectItem key={exp.value} value={exp.value} className="rounded-xl">
                  {exp.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.expertise_level && <p className="text-xs text-red-500">{errors.expertise_level}</p>}
        </div>

        {/* Date de naissance */}
        <div className="space-y-2 flex flex-col">
          <Label htmlFor="profile-dob">Date de naissance</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="profile-dob"
                variant="outline"
                className={cn(
                  "h-11 w-full justify-start text-left font-normal rounded-2xl border-border/60 bg-background/60 px-4",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                {selectedDate ? (
                  format(selectedDate, "dd MMMM yyyy", { locale: fr })
                ) : (
                  <span>Choisir une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3 rounded-2xl space-y-3" align="start">
              <div className="flex gap-2">
                <Select
                  value={calendarMonth.getMonth().toString()}
                  onValueChange={(val) => setCalendarMonth(setMonth(calendarMonth, parseInt(val)))}
                >
                  <SelectTrigger className="h-9 w-[130px] rounded-xl text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-48 rounded-xl">
                    {months.map((m, idx) => (
                      <SelectItem key={m} value={idx.toString()} className="text-xs">
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={calendarMonth.getFullYear().toString()}
                  onValueChange={(val) => setCalendarMonth(setYear(calendarMonth, parseInt(val)))}
                >
                  <SelectTrigger className="h-9 w-[100px] rounded-xl text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-48 rounded-xl">
                    {years.map((y) => (
                      <SelectItem key={y} value={y.toString()} className="text-xs">
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Calendar
                mode="single"
                month={calendarMonth}
                onMonthChange={setCalendarMonth}
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setField("date_of_birth", format(date, "yyyy-MM-dd"));
                  } else {
                    setField("date_of_birth", "");
                  }
                }}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.date_of_birth && <p className="text-xs text-red-500">{errors.date_of_birth}</p>}
        </div>

        {/* Titre / Headline */}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="profile-headline">Titre / Headline</Label>
          <Input
            id="profile-headline"
            value={values.headline}
            onChange={(e) => setField("headline", e.target.value)}
            placeholder="ex: Développeur Full Stack"
            className="h-11 rounded-2xl border-border/60 bg-background/60 px-4"
          />
          {errors.headline && <p className="text-xs text-red-500">{errors.headline}</p>}
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="profile-bio">Bio</Label>
        <Textarea
          id="profile-bio"
          value={values.bio}
          onChange={(e) => setField("bio", e.target.value)}
          rows={4}
          maxLength={2000}
          className="rounded-2xl border-border/60 bg-background/60 px-4 py-3 text-sm"
          placeholder="Décrivez votre rôle, vos intérêts ou vos projets..."
        />
        <p className="text-right text-xs text-muted-foreground">
          {(values.bio ?? "").length}/2000 caractères
        </p>
        {errors.bio && <p className="text-xs text-red-500">{errors.bio}</p>}
      </div>

      {apiError && <p className="text-xs text-red-500">{apiError}</p>}

      <div className="flex justify-end">
        <SaveButton status={status} label="Enregistrer les infos" disabled={!isDirty} />
      </div>
    </form>
  );
}