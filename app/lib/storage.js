import { parseDateInput } from "./life.js";

export const BIRTH_DATE_STORAGE_KEY = "memento-mori.birth-date.v1";
export const THEME_STORAGE_KEY = "memento-mori.theme.v1";

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

export function readTheme(storage = globalThis.localStorage) {
  try {
    const value = storage?.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

export function saveTheme(value, storage = globalThis.localStorage) {
  if (value !== "light" && value !== "dark") {
    throw new TypeError("Tema inválido");
  }
  storage?.setItem(THEME_STORAGE_KEY, value);
}
