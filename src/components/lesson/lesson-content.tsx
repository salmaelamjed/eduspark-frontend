import BlockRenderer from '@/components/block/block-content';
import { Block } from '@/types/block';

interface Lesson {
  id: number;
  title: string;
  slug: string;
  blocks: Block[];
}

interface LessonContentProps {
  lesson: Lesson;
  courseSlug: string;
  quizNumberMap: Map<number, number>;
}

const LessonContent = ({ lesson, courseSlug,quizNumberMap }: LessonContentProps) => (
  <div className="w-full mx-auto px-4">
    <h1 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
      {lesson.title}
    </h1>
    <div className="space-y-2">
      {lesson.blocks
        .sort((a, b) => a.order! - b.order!)
        .map((block) => (
          <BlockRenderer
            key={block.order}
            block={block}
            courseSlug={courseSlug}
            quizNumber={quizNumberMap.get(block.id!)}
          />
        ))}
    </div>
  </div>
);

export default LessonContent;