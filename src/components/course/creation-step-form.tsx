"use client";
import { useStepContextHook } from '@/context/use-step-context'
import { useFormContext } from 'react-hook-form'
import { ContentEditor } from './ContentEditor'
import { ModuleSidebar } from '@/components/course/ModuleSidebar'
import { PublishView } from './PublishView'
import { Course } from '@/types/course'
import { useSharedCourseContent } from '@/context/create-course-context';
import CourseInfo from './course-info';

const CreationCourseFormStep = () => {

  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext()
  
  const { currentStep } = useStepContextHook();

  const {
    modules,
    addModule,
    addLesson,
    renameModule,
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
  } = useSharedCourseContent();

  const selectedModule = modules.find((m) => m.id === selectedModuleId);
  const selectedLesson = selectedModule?.lessons.find((l) => l.id === selectedLessonId);

  const formValues = watch();
    const course: Course = {
    id:0,
    title: formValues.title || "",
    description: formValues.description || "",
    level: formValues.level,
    language: formValues.language || "",
    is_free: formValues.is_free === true || formValues.is_free === "true",
    price: formValues.is_free ? 0 : (formValues.price || 0),
    thumbnail: formValues.thumbnail || "",
    status: "draft",
    createdAt: new Date(),
    updatedAt: new Date(),
    modules: modules.map(module => (
      {
      id: typeof module.id === "string" && module.id.startsWith("temp-")
      ? 0  
      : Number(module.id),
      title: module.title,
      description: module.description || "",
      order: module.order || 0,
      lessons: module.lessons.map(lesson => ({
        id: typeof lesson.id === "string" && lesson.id.startsWith("temp-")
        ? 0 
        : Number(lesson.id),
        title: lesson.title,
        description: "",
        order: lesson.order || 0,
        duration_minutes: 0,
        is_preview: lesson.is_preview || false,
        type: lesson.type, 
        media_url: lesson.media_url || "",
        content: "",
        blocks: lesson.blocks || [],
      }))
    })),
    instructor: {
      id: "",
      name: "",
      avatar: "",
    },
    rating: 0,
    total_students: 0,
    total_lessons: modules.reduce((acc, m) => acc + m.lessons.length, 0),
    total_modules: modules.length,
  };



  switch(currentStep){
    case 1:
      return(
        <CourseInfo
          register={register}
          errors={errors}
        />
      );
    
    case 2:
      return (
        <div className="flex flex-1 mt-6 h-screen border-t">
          <ModuleSidebar
            modules={modules}
            selectedModuleId={selectedModuleId}
            selectedLessonId={selectedLessonId}
            onSelectModule={selectModule}
            onSelectLesson={selectLesson}
            onAddModule={addModule}
            onAddLesson={addLesson}
            onDeleteModule={deleteModule}
            onDeleteLesson={deleteLesson}
            onToggleExpand={toggleExpand}
            onRenameModule={renameModule}
            onRenameLesson={renameLesson}
          />

          <ContentEditor
            lesson={selectedLesson}
            module={selectedModule}
            onAddBlock={(moduleId, lessonId, type, initialData) =>
              addBlock(moduleId, lessonId, type, initialData)
            }
            onUpdateBlock={updateBlock}
          />

          
        </div>
      );

    case 3:
      return (
        <PublishView
      course={course}
    />
      );

    default:
      return (
        <></>
      );
  }
};

export default CreationCourseFormStep;