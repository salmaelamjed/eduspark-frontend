import CreationCourseFormStep from "@/components/course/creation-step-form"
import CreateCourseFormProvider from "@/components/course/form-provider"
import ButtonHandler from "@/components/course/handlerButton"
// import { WorkflowStepper } from "@/components/WorkflowStepper"

const Page = () => {
  return (
     <div className=" h-screen overflow-hidden ">
        <CreateCourseFormProvider>
            {/* <WorkflowStepper/> */}
          <div className="flex flex-col h-full ">
            <div className="flex-1 min-h-0 overflow-hidden">
            <CreationCourseFormStep />
          </div>
            
            <ButtonHandler/>
          </div>
        </CreateCourseFormProvider>
      </div>
  )
}

export default Page
