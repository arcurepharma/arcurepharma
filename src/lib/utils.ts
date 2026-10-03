import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: string | number): string {
  return `Rs. ${Number(price).toFixed(0)}`;
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatFormula(formula?: string | null): string {
  if (!formula || !formula.trim()) return "";
  return formula
    .split(/[,+]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .join(" + ");
}
