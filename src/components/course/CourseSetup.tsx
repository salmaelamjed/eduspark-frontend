'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { FieldErrors, UseFormRegister, FieldValues } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { useFormContext } from 'react-hook-form'
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox"

type Props = {
  register: UseFormRegister<FieldValues>
  errors: FieldErrors<FieldValues>
}

export function CourseSetup({ register, errors }: Props) {
const {  watch } = useFormContext()  
  const isFreeRaw = watch("is_free", true)
  const isFree = isFreeRaw === true || isFreeRaw === "true"

  const levels = ["beginner", "intermediate", "advanced"]

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-12 animate-slide-up">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-display font-bold text-foreground mb-3">
            Créer votre cours
          </h1>
          <p className="text-muted-foreground">
            Commençons par les bases. Vous pourrez tout modifier plus tard.
          </p>
        </div>

        <div className="space-y-8">

          {/* Thumbnail */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Miniature du cours</Label>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-colors">
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                {...register('thumbnail')}
                className="mt-4 max-w-xs mx-auto"
              />
              <ErrorMessage errors={errors} name="thumbnail" render={({ message }) => (
                <p className="text-red-500 text-sm mt-3">{message}</p>
              )} />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-3">
            <Label htmlFor="title">Titre du cours *</Label>
            <Input {...register('title')} placeholder="ex: Développement Web Complet 2025" />
            <ErrorMessage errors={errors} name="title" render={({ message }) => (
              <p className="text-red-500 text-sm mt-1.5">{message}</p>
            )} />
          </div>

          {/* Level */}
          <div className="space-y-3">
            <Label>Niveau du cours *</Label>
            <Combobox items={levels} {...register('level')}>
              <ComboboxInput placeholder="Sélectionner un niveau" />
              <ComboboxContent>
                <ComboboxList>
                  {levels.map((level) => (
                    <ComboboxItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            <ErrorMessage errors={errors} name="level" render={({ message }) => (
              <p className="text-red-500 text-sm mt-1.5">{message}</p>
            )} />
          </div>

          {/* Language */}
          <div className="space-y-3">
            <Label>Langue du cours *</Label>
            <Input {...register('language')} placeholder="ex: Français, Anglais..." />
            <ErrorMessage errors={errors} name="language" render={({ message }) => (
              <p className="text-red-500 text-sm mt-1.5">{message}</p>
            )} />
          </div>

          {/* Description */}
          <div className="space-y-3">
            <Label>Description *</Label>
            <Textarea {...register('description')} placeholder="Décrivez votre cours..." className="min-h-32" />
            <ErrorMessage errors={errors} name="description" render={({ message }) => (
              <p className="text-red-500 text-sm mt-1.5">{message}</p>
            )} />
          </div>

<div className="space-y-6">
  <div>
    <Label className="text-sm font-medium block mb-3">
      Est-ce que le cours est gratuit ?
    </Label>

    <div className="flex items-center gap-8">
      <Label className="flex items-center gap-2 cursor-pointer">
        <Input
          type="radio"
          id="is_free_true"
          value="true"
          {...register("is_free")}
          className="h-4 w-4 text-orange-500 border-gray-300 focus:ring-orange-500"
          defaultChecked
        />
        <span className="text-sm font-medium">Oui, gratuit</span>
      </Label>

      <Label className="flex items-center gap-2 cursor-pointer">
        <Input
          type="radio"
          id="is_free_false"
          value="false"
          {...register("is_free")}
          className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
        />
        <span className="text-sm font-medium">Non, payant</span>
      </Label>
    </div>

    <ErrorMessage
      errors={errors}
      name="is_free"
      render={({ message }) => (
        <p className="text-red-500 text-sm mt-1.5">{message}</p>
      )}
    />
  </div>

  {/* Prix – apparaît seulement si is_free = false */}
  {!isFree && (
    <div className="space-y-3 pt-2 animate-fade-in">
      <Label htmlFor="price" className="text-sm font-medium">
        Prix du cours (en €) *
      </Label>
      <Input
        type="number"
        id="price"
        step="0.00"
        placeholder="ex: 49.99"
        className="max-w-xs"
        {...register("price", {
          required: !isFree ? "Le prix est requis pour un cours payant" : false,
          min: {
            value: 0.01,
            message: "Le prix doit être supérieur à 0",
          },
          valueAsNumber: true,
        })}
      />
      <ErrorMessage
        errors={errors}
        name="price"
        render={({ message }) => (
          <p className="text-red-500 text-sm">{message}</p>
        )}
      />
    </div>
  )}
</div>

        </div>
      </div>
    </div>
  )
}