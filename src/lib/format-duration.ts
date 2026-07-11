import { format } from "date-fns";
import { fr } from "date-fns/locale";
export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const paddedSeconds = seconds.toString().padStart(2, "0");

  if (hours > 0) {
    const paddedMinutes = minutes.toString().padStart(2, "0");
    return `${hours}:${paddedMinutes}:${paddedSeconds}`;
  }

  return `${minutes}:${paddedSeconds}`;
}

export const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "Non disponible";
  try {
    return format(new Date(dateString), "dd MMMM yyyy 'à' HH:mm", {
      locale: fr,
    });
  } catch (error) {
    return "Date invalide";
  }
};
