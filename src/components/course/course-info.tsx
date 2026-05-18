'use client'

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ErrorMessage } from '@hookform/error-message'
import { useFormContext } from 'react-hook-form'
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox"
import { Textarea } from '../ui/textarea'
import { X, UploadCloud } from 'lucide-react' 
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const levels = ["beginner", "intermediate", "advanced"]
const supportedLanguages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'ar', name: 'العربية (Arabe)' },
]
const CourseInfo = () => {
  const { register, formState: { errors }, watch, setValue } = useFormContext()
  const [preview, setPreview] = useState<string | null>(null)

  const isFreeRaw = watch("is_free", true)
  const isFree = isFreeRaw === true || isFreeRaw === "true"
  const selectedLevel = watch("level")
  const selectedLanguageCode = watch("language")
 const currentLanguage = supportedLanguages.find(lang => lang.code === selectedLanguageCode)
  // Nettoyage de l'URL de l'image uniquement lors du démontage du composant
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      // Révoquer l'ancien aperçu s'il existe
      if (preview) URL.revokeObjectURL(preview)

      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)
    }
  }

  const handleRemoveImage = () => {
    if (preview) URL.revokeObjectURL(preview)
    setValue("thumbnail", null)
    setPreview(null)
  }
  const { onChange: registerOnChange, ...thumbnailRegister } = register("thumbnail")

  return (
    <div className="flex-1">
      <div className="mx-auto px-5 py-8 md:px-8 md:py-12 max-w-7xl animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          <div className="lg:col-span-2 space-y-4">
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
                  render={({ message }) => <p className="text-red-500 text-sm">{message}</p>}
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="level" className="text-base font-medium">
                  Niveau du cours <span className="text-red-500">*</span>
                </Label>
                <Combobox
                  items={levels}
                  value={selectedLevel}
                  onValueChange={(value) => setValue("level", value, { shouldValidate: true })}
                >
                  <ComboboxInput placeholder="Sélectionner un niveau" className="h-11" />
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
                  render={({ message }) => <p className="text-red-500 text-sm">{message}</p>}
                />
              </div>
            </div>

            {/* Language & Description */}
            {/* 3. Section Langue modifiée en Dropdown (Combobox) */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                Langue du cours <span className="text-red-500">*</span>
              </Label>
              <Combobox
                items={supportedLanguages.map(lang => lang.code)} // On passe les codes uniques à la mécanique interne
                value={selectedLanguageCode}
                onValueChange={(value) => setValue("language", value, { shouldValidate: true })}
              >
                {/* On affiche le nom complet dans l'input (ex: "Français") mais la valeur stockée reste "fr" */}
                <ComboboxInput 
                  placeholder="Sélectionner la langue" 
                  className="h-11" 
                  value={currentLanguage ? currentLanguage.name : ""} 
                />
                <ComboboxContent>
                  <ComboboxList>
                    {supportedLanguages.map((lang) => (
                      <ComboboxItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>

            <div className="space-y-3">
              <Label>Description *</Label>
              <Textarea {...register('description')} placeholder="Décrivez votre cours..." className="min-h-32" />
              <ErrorMessage errors={errors} name="description" render={({ message }) => (
                <p className="text-red-500 text-sm mt-1.5">{message}</p>
              )} />
            </div>

            {/* Pricing Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <Label className="text-sm font-medium block">Est-ce que le cours est gratuit ?</Label>
                <div className="flex items-center gap-8">
                  <Label className="flex items-center gap-2 cursor-pointer">
                    <Input type="radio" value="true" {...register("is_free")} className="h-4 w-4" defaultChecked />
                    <span className="text-sm font-medium">Oui, gratuit</span>
                  </Label>
                  <Label className="flex items-center gap-2 cursor-pointer">
                    <Input type="radio" value="false" {...register("is_free")} className="h-4 w-4" />
                    <span className="text-sm font-medium">Non, payant</span>
                  </Label>
                </div>
              </div>

              <div className="space-y-2.5">
              {!isFree && (
              <div className="space-y-3 animate-fade-in">
                <Label htmlFor="price" className="text-sm font-medium">
                  Prix du cours (en €) <span className="text-red-500">*</span>
                </Label>
                <Input 
                  type="number" 
                  id="price" 
                  step="0.01" 
                  placeholder="ex: 49.99" 
                  className="max-w-xs" 
                  {...register("price", {
                    required: "Le prix est requis pour les cours payants",
                    min: {
                      value: 0.01,
                      message: "Le prix doit être supérieur à 0"
                    },
                    valueAsNumber: true
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="price"
                  render={({ message }) => <p className="text-red-500 text-sm">{message}</p>}
                />
              </div>
              )}
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Thumbnail Preview */}
          <div className="hidden lg:flex flex-col space-y-3 lg:mt-8 h-full">
            <div className={`relative border-2 border-dashed border-border rounded-2xl transition-all duration-300 flex-1 bg-muted/30 flex items-center justify-center overflow-hidden ${!preview ? 'hover:border-orange-500/60 hover:bg-orange-500/5' : ''}`}>
              
              {preview ? (
                <div className="relative w-full h-full group">
                  <Image 
                    src={preview} 
                    alt="Preview" 
                    width={150}
                    height={150}
                    className="w-full h-full object-cover animate-in fade-in zoom-in duration-300" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="sm" 
                      onClick={handleRemoveImage}
                      className="gap-2"
                    >
                      <X className="w-4 h-4" /> Supprimer
                    </Button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center space-y-4 w-full h-full cursor-pointer p-8 lg:p-12 text-center">
                   <UploadCloud className="w-10 h-10 text-muted-foreground" />
                   <div className="space-y-2">
                    <p className="text-muted-foreground">
                      Glissez-déposez une image ici<br />
                      <span className="text-xs font-light">(JPEG, PNG, WebP – 1280×720)</span>
                    </p>
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      {...thumbnailRegister}
                      onChange={(e) => {
                        registerOnChange(e); // Exécute le onChange interne de react-hook-form
                        handleFileChange(e); // Exécute notre logique d'aperçu
                      }}
                    />
                    <span className="inline-flex h-9 items-center justify-center rounded-md bg-orange-400 hover:bg-orange-500 px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors ">
                      Choisir un fichier
                    </span>
                   </div>
                </label>
              )}
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