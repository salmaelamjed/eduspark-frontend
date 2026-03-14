'use client';
import { useStepContextHook } from '@/context/use-step-context'
import { useCourseContent } from '@/hooks/blocks/use-blocks';
import { useFormContext } from 'react-hook-form'


const CreationCourseStep=()=>{
      
    const { currentStep } = useStepContextHook();
   const {
       modules,
       addModule,
       addLesson,
       renameLesson,
       deleteModule,
       deleteLesson,
       selectedModuleId,
       selectedLessonId,
       selectModule,
       selectLesson,
       updateBlock,
       addBlock,
       toggleExpand,
     } = useCourseContent();
}