'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ErrorMessage } from '@hookform/error-message'
import { useFormContext } from 'react-hook-form'
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox"
import { Textarea } from '../ui/textarea'

const levels = ["beginner", "intermediate", "advanced"]

const CourseInfo = () => {
  const { register, formState: { errors }, watch, setValue } = useFormContext()

  const isFreeRaw = watch("is_free", true)
  const isFree = isFreeRaw === true || isFreeRaw === "true"

  // Pour le Combobox – on écoute la valeur actuelle et on met à jour via setValue
  const selectedLevel = watch("level")

  return (
    <div className="flex-1 ">
      <div className="mx-auto px-5 py-8 md:px-8 md:py-12 max-w-7xl animate-fade-in">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <Label htmlFor="title" className="text-base font-medium">
                  Titre du cours <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="ex: Développement Web Complet 2025"
                  className="h-11"
                  {...register("title")}
                />
                <ErrorMessage
                  errors={errors}
                  name="title"
                  render={({ message }) => (
                    <p className="text-red-500 text-sm">{message}</p>
                  )}
                />
              </div>

              {/* Niveau */}
              <div className="space-y-2.5">
                <Label htmlFor="level" className="text-base font-medium">
                  Niveau du cours <span className="text-red-500">*</span>
                </Label>

                <Combobox
                  items={levels}
                  value={selectedLevel}
                  onValueChange={(value) => setValue("level", value, { shouldValidate: true })}
                >
                  <ComboboxInput
                    placeholder="Sélectionner un niveau"
                    className="h-11"
                  />
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

                <ErrorMessage
                  errors={errors}
                  name="level"
                  render={({ message }) => (
                    <p className="text-red-500 text-sm">{message}</p>
                  )}
                />
              </div>
            </div>

            {/* Thumbnail – sur mobile il sera ici, sur lg il sera à droite */}
            <div className="lg:hidden space-y-3">
              <div className="border-2 border-dashed border-border rounded-xl p-6 md:p-10 text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Glissez-déposez ou cliquez pour uploader
                  </p>
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="max-w-xs mx-auto h-10 cursor-pointer file:cursor-pointer"
                    {...register("thumbnail")}
                  />
                </div>
                <ErrorMessage
                  errors={errors}
                  name="thumbnail"
                  render={({ message }) => (
                    <p className="text-red-500 text-sm mt-3">{message}</p>
                  )}
                />
              </div>
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

          {/* Colonne de droite : Thumbnail (visible seulement sur lg+) */}
          <div className="hidden lg:block sticky top-8 space-y-3 lg:mt-8">
            <div className="border-2 border-dashed border-border rounded-2xl p-8 lg:p-12 text-center hover:border-primary/60 hover:bg-primary/5 hover:shadow-md transition-all duration-300 aspect-video bg-muted/30 flex items-center justify-center">
              <div className="space-y-4 w-full max-w-sm ">
                <p className="text-muted-foreground">
                  Glissez-déposez une image ici<br />
                  <span className="text-xs">(JPEG, PNG, WebP – recommandé 1280×720)</span>
                </p>
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="mx-auto cursor-pointer file:cursor-pointer file:bg-primary file:text-primary-foreground file:border-0 file:hover:bg-primary/90 file:transition-colors"
                  {...register("thumbnail")}
                />
              </div>
            </div>

            <ErrorMessage
              errors={errors}
              name="thumbnail"
              render={({ message }) => (
                <p className="text-red-500 text-sm text-center">{message}</p>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseInfo