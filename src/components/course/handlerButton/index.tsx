"use client"
import { useStepContextHook } from '@/context/use-step-context'
import { Button } from '../../ui/button'
import { useFormContext } from 'react-hook-form'
import { useSharedCourseContent } from '@/context/create-course-context'
import { UseCourses } from '@/hooks/courses/use-course'
import { Loader2 } from 'lucide-react'

const ButtonHandler = () => {
  const { currentStep, setCurrentStep } = useStepContextHook()
  const { watch, formState: { errors }, getValues } = useFormContext() 
  const { modules, getModulesForBackend } = useSharedCourseContent()
  const { loading, createCourse } = UseCourses({ getModulesForBackend }) 

  const formValues = watch();
  
  const canProceedToStep2 = (() => {
    const hasTitle = formValues.title?.trim().length > 0;
    const hasDescription = formValues.description?.trim().length > 0;
    const hasLevel = formValues.level && formValues.level !== "";
    const hasLanguage = formValues.language?.trim().length > 0;
    const hasIsFree = formValues.is_free !== undefined;
    const hasThumbnail = formValues.thumbnail && formValues.thumbnail.length > 0;
    const hasNoErrors = !errors.title && !errors.description && !errors.level && 
                       !errors.language && !errors.is_free && !errors.thumbnail;
    return hasTitle && hasDescription && hasLevel && hasLanguage && 
           hasIsFree && hasThumbnail && hasNoErrors;
  })();

  const canProceedToStep3 = (() => {
    if (modules.length === 0) {
      return false;
    }

    for (const module of modules) {
      if (module.lessons.length === 0) {
        return false;
      }

      for (const lesson of module.lessons) {
        if (!lesson.blocks || lesson.blocks.length === 0) {
          return false;
        }

        for (const block of lesson.blocks) {
          switch (block.type) {
            case "paragraph":
            case "heading":
              if (!block.content_text?.trim()) {
                return false;
              }
              break;
            case "video":
              if (!block.media_url) {
                return false;
              }
              break;
            case "file":
              if (!block.file_url) {
                return false;
              }
              break;
            case "code":
              if (!block.code_data?.code?.trim()) {
                return false;
              }
              break;
          }
        }
      }
    }

    return true;
  })();

  
  const canPublish = currentStep === 3 && canProceedToStep2 && canProceedToStep3;

  // Fonction de publication directe
  const handlePublish = async () => {
    console.log("🟢 handlePublish appelé");
    console.log("canPublish:", canPublish);
    console.log("loading:", loading);
    
    if (!canPublish || loading) {
      console.log("❌ Publication bloquée");
      return;
    }

    try {
      // Récupérer les valeurs actuelles du formulaire
      const currentValues = getValues();
      console.log("📋 Valeurs du formulaire:", currentValues);
      
      // Appeler createCourse directement avec les valeurs
      await createCourse(currentValues);
      
    } catch (error) {
      console.error("❌ Erreur dans handlePublish:", error);
    }
  };

  if (currentStep === 1) {
    return (
      <div className="flex flex-col gap-3 items-end">
        <Button
          type="button"
          disabled={!canProceedToStep2}
          className="px-10 py-6 bg-orange-500 hover:bg-orange-600 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick={() => setCurrentStep(2)}
        >
          Continue
        </Button>
      </div>
    )
  }

  if (currentStep === 2) {
    return (
      <div className="min-h-20 flex flex-col items-end justify-end gap-3">
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="px-12 py-6 border-orange-500 text-orange-500 hover:bg-orange-50 transition-colors hover:cursor-pointer"
            onClick={() => setCurrentStep(1)}
          >
            Retour
          </Button>
          
          <Button
            type="button"
            disabled={!canProceedToStep3}
            className="px-10 py-6 bg-orange-500 hover:bg-orange-600 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={() => setCurrentStep(3)}
          >
            Continue
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-20 flex gap-3 items-end justify-end">
      <Button
        type="button"
        variant="outline"
        className="px-12 py-6 border-orange-500 text-orange-500 hover:bg-orange-50 transition-colors hover:cursor-pointer"
        onClick={() => setCurrentStep(2)}
      >
        Retour
      </Button>
      <Button
        type="button"
        onClick={handlePublish}
        disabled={!canPublish || loading}
        className="px-10 py-6 bg-orange-500 hover:bg-orange-600 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? <Loader2 className="animate-spin" /> : "Publier le cours"}
      </Button>
    </div>
  );
};

export default ButtonHandler;