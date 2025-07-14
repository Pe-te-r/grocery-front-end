import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// utils/timeFormatter.ts
export const formatTime = (timeString: string, is24Hour: boolean) => {
  const [hours, minutes] = timeString.split(':');
  const hourNum = parseInt(hours, 10);

  if (is24Hour) {
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  } else {
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum % 12 || 12; // Convert 0 to 12 for 12-hour format
    return `${displayHour}:${minutes.padStart(2, '0')} ${period}`;
  }
};