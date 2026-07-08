import { Block } from '@/types/block';
import Link from 'next/link';
import { 
  Download, 
  FileText, 
  AlertCircle, 
  Info, 
  Lightbulb, 
  Terminal,
  Play,
  HelpCircle,
  Clock,
  ArrowRight,
  Trophy
} from 'lucide-react';
import Image from 'next/image';

// ---- Sous-composant Callout pour la lisibilité ----
const CalloutStyle = {
  success: { bg: 'bg-emerald-50', border: 'border-emerald-500/20', text: 'text-emerald-900', icon: Lightbulb },
  info: { bg: 'bg-blue-50', border: 'border-blue-500/20', text: 'text-blue-900', icon: Info },
  warning: { bg: 'bg-amber-50', border: 'border-amber-500/20', text: 'text-amber-900', icon: AlertCircle },
  danger: { bg: 'bg-rose-50', border: 'border-rose-500/20', text: 'text-rose-900', icon: AlertCircle },
};

// ---- Block Renderers ----
interface BlockRendererProps {
  block: Block;
  courseSlug: string;
   quizNumber?: number;
}
const BlockRenderer = ({ block, courseSlug,quizNumber }: BlockRendererProps) => {
  if (block.is_hidden) return null;

  switch (block.type) {
    case 'heading': {
      const level = block.settings.level ?? "h2";
      const baseClass = "font-bold text-gray-900 tracking-tight mt-8 mb-3";
      if (level === 'h1') return <h1 className={`${baseClass} text-3xl border-b pb-2`}>{block.content}</h1>;
      if (level === 'h3') return <h3 className={`${baseClass} text-xl mt-6`}>{block.content}</h3>;
      if (level === 'h2') return <h2 className={`${baseClass} text-3xl border-b pb-2`}>{block.content}</h2>;
      if (level === 'h4') return <h4 className={`${baseClass} text-xl mt-6`}>{block.content}</h4>;
      if (level === 'h5') return <h5 className={`${baseClass} text-3xl border-b pb-2`}>{block.content}</h5>;
      if (level === 'h6') return <h6 className={`${baseClass} text-xl mt-6`}>{block.content}</h6>;
      

      return <h2 className={`${baseClass} text-2xl mt-7`}>{block.content}</h2>;
    }

    case 'paragraph':
      return (
        <p className="text-gray-600 leading-relaxed text-base mb-4 max-w-none">
          {block.content}
        </p>
      );

    case 'list': {
      const items = block.content.split('\n').filter(item => item.trim() !== '');
      const isOrdered = block.settings.style === 'ordered';
      const ListTag = isOrdered ? 'ol' : 'ul';

      return (
        <div className="flex gap-3 my-4 pl-1">
          <ListTag className={`space-y-2 text-gray-600 flex-1 pl-4 ${isOrdered ? 'list-decimal' : 'list-disc'}`}>
            {items.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {item.replace(/^[-*•\d+.]\s*/, '')}
              </li>
            ))}
          </ListTag>
        </div>
      );
    }

    case 'quote':
      return (
        <figure className="my-6 border-l-4 border-orange-500 pl-4 italic bg-gray-50/80 py-3 pr-4 rounded-r-xl">
          <blockquote className="text-gray-700 text-lg leading-stable">
            « {block.content} »
          </blockquote>
          {block.author && (
            <figcaption className="text-sm text-gray-500 mt-2 font-medium not-italic">
              — {block.author}
            </figcaption>
          )}
        </figure>
      );

    case 'video':
      return (
        <div className="my-6 rounded-2xl overflow-hidden border border-gray-100 bg-gray-950 aspect-video w-full max-h-[65vh] shadow-sm relative group">
          {block.media_url ? (
            <video controls className="w-full h-full object-contain" src={block.media_url} />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-linear-to-b from-gray-900 to-gray-950">
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200 backdrop-blur-sm">
                <Play className="w-6 h-6 text-white fill-white" />
              </div>
              {block.duration_seconds && (
                <span className="absolute top-4 right-4 text-xs font-mono bg-black/40 text-gray-300 px-2 py-1 rounded-md backdrop-blur-sm">
                  {Math.floor(block.duration_seconds / 60)}m {block.duration_seconds % 60}s
                </span>
              )}
            </div>
          )}
        </div>
      );

   case 'image': {
  return (
  <figure className="my-6 w-full rounded-2xl p-1">
    <div 
      className="relative w-full rounded-xl overflow-hidden"
      style={{ height: '70vh', width: '100%' }}
    >
      <Image
        src={block.media_url}
        alt={block.alt_text || "Illustration de la leçon"}
        fill
        sizes="100vw"
        className="object-cover transition-transform duration-300"
        priority={block.is_preview}
      />
    </div>
  </figure>
);
}
    case 'code': {
      const config = block.code_data ?? { language: 'text', code: block.code_data };
      return (
        <div className="my-5 rounded-xl overflow-hidden border border-gray-800 shadow-lg bg-[#0d1117]">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800/60 select-none">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-400 font-mono tracking-wide lowercase">
                {config.language}
              </span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
          </div>
          <pre className="text-gray-100 text-sm p-4 overflow-x-auto font-mono leading-relaxed selection:bg-orange-500/20">
            <code>{config.code}</code>
          </pre>
        </div>
      );
    }

    case 'file': {
      const url = block.file_url ?? '#';
      const name = block.file_name || "Document de cours";
      return (
        <div className="my-4">
          <a
            href={url}
            download
            className="inline-flex items-center gap-4 px-4 py-3.5 rounded-xl border border-orange-200/80 bg-linear-to-r from-orange-50/60 to-orange-50/20 hover:from-orange-50 hover:to-orange-100/60 transition-all duration-200 text-orange-800 text-sm font-medium group w-full sm:w-auto shadow-sm"
          >
            <div className="w-9 h-9 rounded-lg bg-orange-600 flex items-center justify-center shrink-0 shadow-sm shadow-orange-500/20">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col text-left pr-4">
              <span className="font-semibold text-gray-800 group-hover:text-orange-900 transition-colors line-clamp-1">{name}</span>
              {block.file_size && (
                <span className="text-xs text-gray-400 font-normal mt-0.5">
                  {(block.file_size / (1024 * 1024)).toFixed(2)} MB
                </span>
              )}
            </div>
            <Download className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-y-0.5 transition-all ml-auto sm:ml-4" />
          </a>
        </div>
      );
    }

    case 'callout': {
      const type = block.settings.type ?? 'info';
      const styles = CalloutStyle[type];
      const Icon = styles.icon;
      return (
        <div className={`my-5 p-4 rounded-xl border ${styles.bg} ${styles.border} flex gap-3 `}>
          <Icon className={`w-5 h-5 ${styles.text} shrink-0 mt-0.5`} />
          <div className={`text-sm leading-relaxed ${styles.text}`}>
            {block.content}
          </div>
        </div>
      );
    }

    case 'divider': {
      const styleClass = block.style === 'dashed' ? 'border-dashed' : block.style === 'dotted' ? 'border-dotted' : 'border-solid';
      return <hr className={`my-8 border-t-2 ${styleClass} border-gray-100 w-full`} />;
    }

  case 'quiz': {
  const quizData = block.quiz_data ?? {};
  const questions = quizData.questions ?? [];
  const questionsCount = questions.length;
  const passingScore = quizData.settings?.passing_score_percent;

  const title = block.title || "Quiz de vérification";
  const description = questionsCount > 0
    ? `Évaluez vos connaissances avec ${questionsCount} question${questionsCount > 1 ? 's' : ''} sur cette leçon.`
    : "Testez vos connaissances sur cette leçon.";

 

   const quizUrl = `/cours/${courseSlug}/quiz?quiz=${quizNumber ?? block.id}`;


  return (
    <div className="my-6 relative overflow-hidden rounded-2xl border border-orange-200/70 bg-linear-to-br from-orange-50 via-white to-orange-50/40 shadow-sm">
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-orange-100/60 blur-2xl" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-orange-100/40 blur-2xl" />

      <div className="relative flex flex-col sm:flex-row sm:items-center gap-5 p-6">
        <div className="w-14 h-14 rounded-xl bg-orange-600 flex items-center justify-center shrink-0 shadow-md shadow-orange-500/25">
          <Trophy className="w-7 h-7 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
              Quiz
            </span>
            {questionsCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <HelpCircle className="w-3.5 h-3.5" />
                {questionsCount} question{questionsCount > 1 ? 's' : ''}
              </span>
            )}
            {typeof passingScore === 'number' && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <AlertCircle className="w-3.5 h-3.5" />
                Seuil de réussite : {passingScore}%
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>

        <Link
          href={quizUrl}
          className="group inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold shadow-sm shadow-orange-500/25 transition-all duration-200 shrink-0 whitespace-nowrap"
        >
          Passer le quiz
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

    default:
      return null;
  }
};

export default BlockRenderer;