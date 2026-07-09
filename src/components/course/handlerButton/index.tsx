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
    const isFree = formValues.is_free === true || formValues.is_free === "true";

  const canProceedToStep2 = (() => {
    const hasTitle = formValues.title?.trim().length > 0;
    const hasDescription = formValues.description?.trim().length > 0;
    const hasLevel = formValues.level && formValues.level !== "";
    const hasLanguage = formValues.language?.trim().length > 0;
    // FIX: Validate price only when course is NOT free
    let hasValidPrice = true;
    if (!isFree) {
      // Check if price exists and is greater than 0
      const price = formValues.price;
      hasValidPrice = price && Number(price) > 0;
    }

     const hasThumbnail = formValues.thumbnail && formValues.thumbnail.length > 0;
     const hasNoErrors = !errors.title && !errors.description && !errors.level && 
                       !errors.language && !errors.thumbnail;
      // Also check for price errors when not free
    const hasNoPriceErrors = isFree ? true : !errors.price;                 
    
    return hasTitle && hasDescription && hasLevel && hasLanguage && 
           hasThumbnail && hasValidPrice && hasNoErrors && hasNoPriceErrors;
  })();
  const canProceedToStep3 = (() => {
    if (modules.length === 0) {
      return false;
    }

    for (const courseModule of modules) {
      if (courseModule.lessons.length === 0) {
        return false;
      }

      for (const lesson of courseModule.lessons) {
        if (!lesson.blocks || lesson.blocks.length === 0) {
          return false;
        }

        for (const block of lesson.blocks) {
          switch (block.type) {
           case "paragraph":
            case "heading":
            case "quote":
            case "list":
            case "callout":
              if (!block.content?.trim()) {
                return false;
              }
              break;
            case "video":
            case "image":
            case "audio":
            case "embed":
              if (!block.media_url?.trim()) {
                return false;
              }
              break;
            case "file":
              // Validation basée sur la structure de ton hook (file_url)
              if (!(block).file_url?.trim()) {
                return false;
              }
              break;
            case "code":
              if (!block.code_data?.code?.trim()) {
                return false;
              }
              break;
              case "divider":
              // Un divider est purement visuel (généralement pré-rempli avec un style 'solid')
              // On s'assure juste qu'il a une propriété de style valide définie
              if (!(block).style) {
                return false;
              }
              break;
              case "quiz": {
              const questions = block.quiz_data?.questions;
              
              // Le quiz doit contenir au moins une question
              if (!questions || !Array.isArray(questions) || questions.length === 0) {
                return false;
              }

              // Itération et validation de chaque question présente dans le bloc de quiz
              for (const q of questions) {
                // 1. L'énoncé de la question ne doit pas être vide
                if (!q.question_text?.trim()) {
                  return false;
                }
                // 2. Il doit y avoir au moins 2 options de réponses proposées
                if (!q.options || !Array.isArray(q.options) || q.options.length < 2) {
                  return false;
                }
                // 3. Toutes les options textuelles doivent être remplies
                if (q.options.some((opt: string) => !opt?.trim())) {
                  return false;
                }
                // 4. Il doit y avoir au moins un index de bonne réponse valide sélectionné
                if (!q.correct_answers || !Array.isArray(q.correct_answers) || q.correct_answers.length === 0) {
                  return false;
                }
              }
              break;
          }
          default:
              // Sécurité critique : Bloque la soumission si un type non supporté atterrit ici
              return false;
        }
        }
      }
    }

    return true;
  })();

  
  const canPublish = currentStep === 3 && canProceedToStep2 && canProceedToStep3;

  const handlePublish = async () => {
    if (!canPublish || loading) {
      return;
    }

    try {
      const currentValues = getValues()
      currentValues.is_free = String(currentValues.is_free) === "true"
      
      await createCourse(currentValues)
    } catch (error) {
      console.error(" Erreur dans handlePublish:", error)
    }
  }

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
      <div className=" flex flex-col items-end justify-end gap-3">
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
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="animate-spin h-4 w-4" />
            Publication en cours...
          </span>
        ) : (
          "Publier le cours"
        )}      
        </Button>
            </div>
  );
};

export default ButtonHandler;