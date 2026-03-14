import { X } from "lucide-react";

interface ImagePreviewProps {
  imageUrl: string;
  fileName: string;
  onRemove: () => void;
}

const ImagePreview = ({ imageUrl, fileName, onRemove }: ImagePreviewProps) => {
  return (
    <div className="flex items-center gap-3 p-2 bg-chat-image-preview-bg rounded-lg border border-border animate-scale-in">
      <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0">
        <img
          src={imageUrl}
          alt={fileName}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {fileName}
        </p>
        <p className="text-xs text-muted-foreground">Image attached</p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ImagePreview;