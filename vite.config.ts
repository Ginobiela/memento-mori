import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

function normalizeBasePath(value: string | undefined) {
  if (!value) return "/";
  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.endsWith("/")
    ? withLeadingSlash
    : `${withLeadingSlash}/`;
}

const base = normalizeBasePath(process.env.VITE_BASE_PATH);
const siteUrl = (process.env.VITE_SITE_URL ?? "http://localhost:5173/").replace(
  /\/?$/,
  "/",
);

export default defineConfig({
  base,
  plugins: [
    react(),
    {
      name: "site-metadata",
      transformIndexHtml: {
        order: "pre",
        handler(html) {
          return html.replaceAll("%SITE_URL%", siteUrl);
        },
      },
    },
  ],
});
