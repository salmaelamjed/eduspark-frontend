import { Course } from '@/types/course';
import { 
  Globe, 
  BookOpen,
  Clock,
  Users,
  Rocket
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PublishViewProps {
  course: Course;
}

export function PublishView({ course }: PublishViewProps) {
  const isPublished = course.status === 'published';
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <div className="flex-1 overflow-y-auto min-h-[70vh]">
      <div className="max-w-3xl mx-auto px-6 justify-center  animate-slide-up">
        <div className="text-center ">
          <div className={cn(
            "w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-soft",
            isPublished ? "bg-success" : "gradient-primary"
          )}>
            {isPublished ? (
              <Globe className="w-10 h-10 text-success-foreground" />
            ) : (
              <Rocket className="w-10 h-10 text-primary-foreground" />
            )}
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-3">
            {isPublished ? 'Course Published!' : 'Ready to Publish?'}
          </h1>
          <p className="text-muted-foreground">
            {isPublished 
              ? 'Your course is live and students can now enroll.'
              : 'Review the checklist below before publishing your course.'
            }
          </p>
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <BookOpen className="w-5 h-5 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-display font-bold text-foreground">
              {course.modules.length}
            </p>
            <p className="text-xs text-muted-foreground">Modules</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <Clock className="w-5 h-5 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-display font-bold text-foreground">
              {totalLessons}
            </p>
            <p className="text-xs text-muted-foreground">Lessons</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <Users className="w-5 h-5 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-display font-bold text-foreground">0</p>
            <p className="text-xs text-muted-foreground">Enrolled</p>
          </div>
        </div>
      </div>
    </div>
  );
}
