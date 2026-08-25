import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Memento Mori onboarding", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Memento Mori — Calendario de vida<\/title>/i);
  assert.match(html, /Memento Mori/i);
  assert.match(html, /Cada cuadrado representa una semana/i);
  assert.match(html, /¿Cuántos años tenés\?/i);
  assert.match(html, /sólo en este dispositivo/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});
