import { Num2WordEN } from "./lang/en";

export { Num2WordEN };

// Default instance for English
const defaultConverter = new Num2WordEN();

export function toWords(num: number): string {
  return defaultConverter.toCardinal(num);
}

export function toOrdinal(num: number): string {
  return defaultConverter.toOrdinal(num);
}

export function toOrdinalNum(num: number): string {
  return defaultConverter.toOrdinalNum(num);
}

// Re-export base types
export { Num2WordBase } from "./base";
export type { CurrencyData } from "./base";
