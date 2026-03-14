'use client';
import { CourseContentContext } from '@/context/create-course-context';
import { StepContextProvider } from '@/context/use-step-context';
import { UseCourses } from '@/hooks/courses/use-course';
import { useCourseContent } from '@/hooks/courses/useCourseContent';
import { FormProvider } from 'react-hook-form';

type Props = {
    children: React.ReactNode;
}

const CreateCourseFormProvider = ({ children }: Props) => {
    const courseContent = useCourseContent()
    
    const { methods} = UseCourses({
        getModulesForBackend: courseContent.getModulesForBackend
    })
    
    return (
        <StepContextProvider>
            <FormProvider {...methods}>
                <CourseContentContext.Provider value={courseContent}>
                    {children}
                </CourseContentContext.Provider>
            </FormProvider>
        </StepContextProvider>
    )
}

export default CreateCourseFormProvider;