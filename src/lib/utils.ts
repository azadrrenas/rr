import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind sınıflarını koşullu olarak birleştirir ve çakışan sınıfları düzgün eritir. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Basit slug üretici (kategori/arama gibi alanlar için). */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Tarihi "gg.aa.yyyy" formatında gösterir. */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
