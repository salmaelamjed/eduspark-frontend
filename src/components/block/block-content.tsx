import { Download, FileText } from 'lucide-react';
import Image from 'next/image';

interface Block {
  id: number;
  type: 'heading' | 'text' | 'video' | 'image' | 'code' | 'file';
  content: string;
  media_url: string | null;
  duration_seconds: number | null;
  language: string | null;
  order: number;
}

// ---- Block Renderers ----
const BlockRenderer = ({ block }: { block: Block }) => {
  switch (block.type) {
    case 'heading':
      return (
        <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-2">
          {block.content}
        </h2>
      );

    case 'text':
      return (
        <p className="text-gray-500 leading-relaxed">
          {block.content}
        </p>
      );

    case 'video':
      return (
        <div className="rounded-xl h-[70vh] w-full overflow-hidden bg-gray-900 aspect-video flex items-center justify-center my-4">
          {block.media_url ? (
            <video controls className='' src={block.media_url} />
          ) : (
            <div className="text-center text-gray-400">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">▶</span>
              </div>
              <p className="text-sm">{block.content}</p>
              {block.duration_seconds && (
                <p className="text-xs mt-1 text-gray-500">
                  {Math.floor(block.duration_seconds / 60)}min {block.duration_seconds % 60}s
                </p>
              )}
            </div>
          )}
        </div>
      );

    case 'image':
      return (
        <div className="my-4">
          {block.media_url ? (
            <Image
              src={block.media_url}
              alt={block.type}
              width={800}  
              height={400}
              className="rounded-xl w-full object-cover border border-gray-100"
            />
          ) : (
            <div className="rounded-xl bg-gray-100 border border-dashed border-gray-300 h-48 flex items-center justify-center text-gray-400 text-sm">
              {block.content}
            </div>
          )}
        </div>
      );

    case 'code':
      return (
        <div className="my-4 rounded-xl overflow-hidden border border-gray-200">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
            <span className="text-xs text-gray-400 font-mono uppercase tracking-wide">
              {block.language ?? 'code'}
            </span>
          </div>
          <pre className="bg-gray-900 text-green-400 text-sm p-4 overflow-x-auto font-mono leading-relaxed">
            <code>{block.content}</code>
          </pre>
        </div>
      );

    case 'file':
      return (
        <div className="my-3">
          <a
            href={block.media_url ?? '#'}
            download
            className="inline-flex items-center gap-3 px-4 py-3 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100 transition-all duration-200 text-orange-700 text-sm font-medium group"
          >
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="flex-1">{block.content}</span>
            <Download className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      );

    default:
      return null;
  }
};


export default BlockRenderer;