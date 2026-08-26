import assert from "node:assert/strict";
import test from "node:test";
import {
  BIRTH_DATE_STORAGE_KEY,
  clearBirthDate,
  readBirthDate,
  saveBirthDate,
} from "../app/lib/storage.js";

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, value),
  };
}

test("birth dates persist and can be read back", () => {
  const storage = memoryStorage();
  saveBirthDate("2001-03-12", storage);
  assert.equal(readBirthDate(storage), "2001-03-12");
});

test("invalid stored values are ignored", () => {
  const storage = memoryStorage();
  storage.setItem(BIRTH_DATE_STORAGE_KEY, "2001-02-31");
  assert.equal(readBirthDate(storage), null);
});

test("reset removes the locally stored date", () => {
  const storage = memoryStorage();
  saveBirthDate("2001-03-12", storage);
  clearBirthDate(storage);
  assert.equal(readBirthDate(storage), null);
});
