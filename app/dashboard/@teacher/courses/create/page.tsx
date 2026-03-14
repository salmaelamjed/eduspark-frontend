import CreateCourseFormProvider from "@/components/course/form-provider"
import CourseInfo from "@/components/courses/course-info"
import ButtonHandler from "@/components/courses/handle-btn/index"
import { WorkflowStepper } from "@/components/WorkflowStepper"

const Page = () => {
  return (
     <div className="h-screen ">
      <div className="  ">
        <CreateCourseFormProvider>
            <WorkflowStepper/>
          <div className="flex flex-col ">
            <CourseInfo/>
            {/* <CreationCourseFormStep/> */}
            <ButtonHandler/>
          </div>
        </CreateCourseFormProvider>
      </div>
   </div>
  )
}

export default Page
