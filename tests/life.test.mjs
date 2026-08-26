import assert from "node:assert/strict";
import test from "node:test";
import {
  TOTAL_WEEKS,
  calculateLifeSnapshot,
  getDaysAlive,
  getWeeksAwake,
  getWeeksAlive,
} from "../app/lib/life.js";

test("a birth today has zero completed weeks", () => {
  assert.equal(getWeeksAlive("2026-08-25", "2026-08-25"), 0);
});

test("seven exact days count as one completed week", () => {
  assert.equal(getWeeksAlive("2026-08-18", "2026-08-25"), 1);
});

test("awake weeks remove eight sleep hours per day", () => {
  assert.equal(getWeeksAwake("2026-07-28", "2026-08-25"), 2);
});

test("the calculation crosses a calendar year using elapsed days", () => {
  assert.equal(getDaysAlive("2025-12-29", "2026-01-05"), 7);
  assert.equal(getWeeksAlive("2025-12-29", "2026-01-05"), 1);
});

test("leap day is included in elapsed time", () => {
  assert.equal(getDaysAlive("2020-02-28", "2020-03-06"), 7);
  assert.equal(getWeeksAlive("2020-02-28", "2020-03-06"), 1);
});

test("life snapshots keep calendar age separate from week count", () => {
  assert.deepEqual(calculateLifeSnapshot("2000-09-01", "2026-08-25"), {
    age: 25,
    daysAlive: 9489,
    weeksAlive: 1355,
    weeksAwake: 903,
    weeksAsleep: 452,
  });
});

test("week count is capped at the 80-year grid", () => {
  assert.equal(getWeeksAlive("1900-01-01", "2026-08-25"), TOTAL_WEEKS);
});

test("awake weeks stay proportional when the 80-year grid is capped", () => {
  const snapshot = calculateLifeSnapshot("1900-01-01", "2026-08-25");
  assert.equal(snapshot.weeksAlive, TOTAL_WEEKS);
  assert.equal(snapshot.weeksAwake, 2773);
  assert.equal(snapshot.weeksAsleep, 1387);
});
