import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(timestamp: string | number) {
  if (typeof timestamp === 'string' && timestamp.includes('.')) {
    // Handle "10.12.03" format by converting to ISO format
    const [hours, minutes, seconds] = timestamp.split('.').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds);
    return format(date, 'HH:mm:ss');
  }
  
  // If it's a unix timestamp
  if (typeof timestamp === 'number' || !isNaN(Number(timestamp))) {
    return format(new Date(Number(timestamp)), 'HH:mm:ss');
  }
  
  // If it's already a formatted date string
  return timestamp;
}

export function formatDateTime(timestamp: string | number) {
  if (typeof timestamp === 'string' && timestamp.includes('.')) {
    // Handle "10.12.03" format by converting to ISO format
    const [hours, minutes, seconds] = timestamp.split('.').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds);
    return format(date, 'MMM dd, yyyy HH:mm:ss');
  }
  
  // If it's a unix timestamp
  if (typeof timestamp === 'number' || !isNaN(Number(timestamp))) {
    return format(new Date(Number(timestamp)), 'MMM dd, yyyy HH:mm:ss');
  }
  
  // If it's already a formatted date string
  return timestamp;
}

export function formatHour(timestamp: string | number) {
  if (typeof timestamp === 'string' && timestamp.includes('.')) {
    // Handle "10.12.03" format by converting to ISO format
    const [hours, minutes, seconds] = timestamp.split('.').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds);
    return format(date, 'HH:00');
  }
  
  // If it's a unix timestamp
  if (typeof timestamp === 'number' || !isNaN(Number(timestamp))) {
    return format(new Date(Number(timestamp)), 'HH:00');
  }
  
  // If it's already a formatted date string
  return timestamp;
}