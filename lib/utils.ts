import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Compares two objects and returns only the fields that have changed in the current object
 * compared to the original object.
 * 
 * @param original The base object to compare against
 * @param current The modified object
 * @returns A partial object containing only the keys and values that differ from original
 */
export function getChangedFields<T extends Record<string, any>>(
  original: T,
  current: T
): Partial<T> {
  const changedFields: Partial<T> = {};

  Object.keys(current).forEach((key) => {
    const originalValue = original[key];
    const currentValue = current[key];

    // Use JSON.stringify for a robust deep comparison of all value types
    if (JSON.stringify(originalValue) === JSON.stringify(currentValue)) return;

    changedFields[key as keyof T] = currentValue as any;
  });

  return changedFields;
}
