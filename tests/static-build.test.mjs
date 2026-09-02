import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the production build contains a portable static entry point", async () => {
  const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");

  assert.match(html, /<title>Memento Mori — Calendario de vida<\/title>/i);
  assert.match(html, /<div id="root"><\/div>/i);
  assert.match(html, /<link[^>]+rel="icon"[^>]+href="[^"]*\/favicon\.svg"/i);
  assert.match(html, /<script[^>]+src="[^"]*\/assets\/[^"]+\.js"/i);
  assert.match(html, /<link[^>]+href="[^"]*\/assets\/[^"]+\.css"/i);
  assert.doesNotMatch(html, /_next|_vinext|ginitokun|chatgpt\.site/i);
});
