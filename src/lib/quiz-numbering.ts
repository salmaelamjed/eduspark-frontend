import { Block, QuizBlock } from "@/types/block";

interface LessonLike {
  id: number;
  title: string;
  blocks: Block[];
}

interface ModuleLike {
  lessons: LessonLike[];
}

interface CourseLike {
  modules?: ModuleLike[];
}

export interface QuizLocation {
  block: QuizBlock;
  lessonTitle: string;
  lessonId: number;
}

function isQuizBlock(block: Block): block is QuizBlock {
  return block.type === "quiz";
}

/**
 * Construit une map { blockId -> quizNumber } en parcourant
 * tous les modules/leçons/blocks du cours dans l'ordre.
 */
export function buildQuizNumberMap(
  course: CourseLike | null | undefined,
): Map<number, number> {
  const map = new Map<number, number>();
  let counter = 0;

  course?.modules?.forEach((mod) => {
    mod.lessons?.forEach((lesson) => {
      lesson.blocks
        ?.slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .forEach((block) => {
          if (isQuizBlock(block) && block.id != null) {
            counter += 1;
            map.set(block.id, counter);
          }
        });
    });
  });

  return map;
}

/**
 * Retrouve le block quiz correspondant à un numéro global donné.
 */
export function findQuizByNumber(
  course: CourseLike | null | undefined,
  quizNumber: string | number | null,
): QuizLocation | null {
  if (!course || quizNumber == null) return null;
  let counter = 0;

  for (const mod of course.modules ?? []) {
    for (const lesson of mod.lessons ?? []) {
      const sortedBlocks = [...(lesson.blocks ?? [])].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0),
      );
      for (const block of sortedBlocks) {
        if (isQuizBlock(block)) {
          counter += 1;
          if (String(counter) === String(quizNumber)) {
            return { block, lessonTitle: lesson.title, lessonId: lesson.id };
          }
        }
      }
    }
  }
  return null;
}
