
import BlockRenderer from '@/components/block/block-content';


// ---- Types ----
interface Block {
  id: number;
  type: 'heading' | 'text' | 'video' | 'image' | 'code' | 'file';
  content: string;
  media_url: string | null;
  duration_seconds: number | null;
  language: string | null;
  order: number;
}
interface Lesson {
  id: number;
  title: string;
  blocks: Block[];
}



// ---- Lesson Content ----
const LessonContent = ({ lesson }: { lesson: Lesson }) => (
  <div className="w-full mx-auto px-4">
    <h1 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
      {lesson.title}
    </h1>
    <div className="space-y-2">
      {lesson.blocks
        .sort((a, b) => a.order - b.order)
        .map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
    </div>
  </div>
);


export default LessonContent