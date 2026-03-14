

import CreationCourseFormStep from '@/components/course/creation-step-form'
import CreateCourseFormProvider from '@/components/course/form-provider'
import ButtonHandler from '@/components/course/handlerButton'
import { WorkflowStepper } from '@/components/WorkflowStepper'

const CreateCourse = () => {
  return (
    <div className="max-h-screen ">
      <div className="  ">
        <CreateCourseFormProvider>
            <WorkflowStepper/>
          <div className="flex flex-col ">
            <CreationCourseFormStep/>
            <ButtonHandler/>
          </div>
        </CreateCourseFormProvider>
      </div>
   </div>
  )
}

export default CreateCourse
