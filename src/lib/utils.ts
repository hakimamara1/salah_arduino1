import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a price in Algerian Dinar using Western digits + "دج". */
export function formatDZD(amount: number): string {
  return `${new Intl.NumberFormat("en-US").format(amount)} دج`;
}
