import { Course } from '@/types/course';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Save, Globe, FileEdit, ArrowLeft } from 'lucide-react';

interface CourseHeaderProps {
  course: Course;
  onPublish: () => void;
  onUnpublish: () => void;
  onSave?: () => void;
}

export function CourseHeader({ course, onPublish, onUnpublish, onSave }: CourseHeaderProps) {
  const isPublished = course.status === 'published';

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-card   shadow-soft">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        
        <div className="flex flex-col">
          <h1 className="text-lg font-display font-semibold text-foreground line-clamp-1">
            {course.title || 'Untitled Course'}
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge 
              variant={isPublished ? "default" : "secondary"}
              className={isPublished ? "bg-success text-success-foreground" : ""}
            >
              {isPublished ? 'Published' : 'Draft'}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Last saved {course.updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button 
        className='hover:cursor-pointer'
        variant="outline" size="sm" onClick={onSave}>
          <Save className="w-4 h-4" />
          <span className="hidden sm:inline ml-2">Save</span>
        </Button>
        
        {isPublished ? (
          <Button  
          className='hover:cursor-pointer'
          size="sm" onClick={onUnpublish}>
            <FileEdit className="w-4 h-4" />
            <span className="hidden sm:inline ml-2">Unpublish</span>
          </Button>
        ) : (
          <Button 
          className='bg-orange-500 hover:bg-orange-400 hover:cursor-pointer'
          size="sm" onClick={onPublish}>
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline ml-2">Publish</span>
          </Button>
        )}
      </div>
    </header>
  );
}