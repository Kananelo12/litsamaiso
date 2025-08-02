import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function makeSignature(fullName: string): string {
  const parts = fullName.trim().toLowerCase().split(/\s+/);

  if (parts.length < 2) return fullName.toLowerCase(); // fallback if no surname

  const initial = parts[0][0];
  const surname = parts[parts.length - 1];

  return `${initial}.${surname}`;
}