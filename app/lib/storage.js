import { parseDateInput } from "./life.js";

export const BIRTH_DATE_STORAGE_KEY = "memento-mori.birth-date.v1";

export function readBirthDate(storage = globalThis.localStorage) {
  try {
    const value = storage?.getItem(BIRTH_DATE_STORAGE_KEY);
    return value && parseDateInput(value) ? value : null;
  } catch {
    return null;
  }
}

export function saveBirthDate(value, storage = globalThis.localStorage) {
  if (!parseDateInput(value)) throw new TypeError("Fecha inválida");
  storage?.setItem(BIRTH_DATE_STORAGE_KEY, value);
}

export function clearBirthDate(storage = globalThis.localStorage) {
  try {
    storage?.removeItem(BIRTH_DATE_STORAGE_KEY);
  } catch {
    // The calendar remains usable even when browser storage is unavailable.
  }
}
