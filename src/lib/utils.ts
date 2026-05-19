import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function calculateNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = end.getTime() - start.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getDefaultCheckIn(): string {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  return date.toISOString().split("T")[0];
}

export function getDefaultCheckOut(): string {
  const date = new Date();
  date.setDate(date.getDate() + 17);
  return date.toISOString().split("T")[0];
}
