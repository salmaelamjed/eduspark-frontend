import {  File, FileArchive, FileCode, FileSpreadsheet, FileTextIcon, ImageIcon } from "lucide-react";
import {
  Heading1,
  List,
  Minus,
  Type,
  Film,
  MessageSquareQuote,
  Camera,
  Headphones,
  FileUp,
  Terminal,
  Puzzle,
  Globe,
  AlertCircle,
} from "lucide-react";
export const blockIcons: Record<string, React.ReactNode> = {
  heading: <Heading1 className="h-5 w-5" />,
  paragraph: <Type className="h-5 w-5" />,
  list: <List className="h-5 w-5" />,
  quote: <MessageSquareQuote className="h-5 w-5" />,
  image: <Camera className="h-5 w-5" />,
  video: <Film className="h-5 w-5" />,
  audio: <Headphones className="h-5 w-5" />,
  file: <FileUp className="h-5 w-5" />,
  code: <Terminal className="h-5 w-5" />,
  quiz: <Puzzle className="h-5 w-5" />,
  embed: <Globe className="h-5 w-5" />,
  divider: <Minus className="h-5 w-5" />,
  callout: <AlertCircle className="h-5 w-5" />,
};

export const blockLabels: Record<string, string> = {
  heading: "Titre",
  paragraph: "Paragraphe",
  list: "Liste",
  quote: "Citation",
  image: "Image",
  video: "Vidéo",
  audio: "Audio",
  file: "Fichier",
  code: "Code",
  quiz: "Quiz",
  embed: "Intégration",
  divider: "Séparateur",
  callout: "Encart",
};
export const getFileIcon = (mimeType: string | undefined) => {
  if (!mimeType) return <File className="h-6 w-6" />;
  
  if (mimeType.startsWith('image/')) return <ImageIcon className="h-6 w-6" />;
  if (mimeType === 'application/pdf') return <FileTextIcon className="h-6 w-6" />;
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType === 'text/csv') 
    return <FileSpreadsheet className="h-6 w-6" />;
  if (mimeType.includes('word') || mimeType.includes('document')) return <FileTextIcon className="h-6 w-6" />;
  if (mimeType.includes('zip') || mimeType.includes('rar')) return <FileArchive className="h-6 w-6" />;
  if (mimeType.startsWith('text/') || mimeType.includes('code')) return <FileCode className="h-6 w-6" />;
  
  return <File className="h-6 w-6" />;
};

// Types de fichiers acceptés
export const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];
export const ACCEPTED_AUDIO_TYPES = ["audio/mpeg", "audio/ogg", "audio/wav"];

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
export const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "application/zip",
  "application/x-zip-compressed",
  "application/x-rar-compressed",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
];

// Langages de programmation supportés pour la syntax highlighting
export const codeLanguages = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "sql", label: "SQL" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "php", label: "PHP" },
  { value: "rust", label: "Rust" },
  { value: "go", label: "Go" },
  { value: "ruby", label: "Ruby" },
  { value: "swift", label: "Swift" },
  { value: "bash", label: "Bash" },
];


// Fonction pour obtenir la couleur de fond selon le type de fichier
export const getFileIconBg = (mimeType: string | undefined) => {
  if (!mimeType) return "bg-orange-100 text-orange-600";
  
  if (mimeType.startsWith('image/')) return "bg-emerald-100 text-emerald-600";
  if (mimeType === 'application/pdf') return "bg-red-100 text-red-600";
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType === 'text/csv') 
    return "bg-green-100 text-green-600";
  if (mimeType.includes('word') || mimeType.includes('document')) return "bg-blue-100 text-blue-600";
  if (mimeType.includes('zip') || mimeType.includes('rar')) return "bg-purple-100 text-purple-600";
  if (mimeType.startsWith('text/') || mimeType.includes('code')) return "bg-amber-100 text-amber-600";
  
  return "bg-orange-100 text-orange-600";
};

// Fonction pour formater la taille des fichiers
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};


