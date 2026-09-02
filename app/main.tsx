import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LifeCalendar } from "./LifeCalendar";
import "./globals.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("No se encontró el punto de montaje de la aplicación.");
}

createRoot(root).render(
  <StrictMode>
    <LifeCalendar />
  </StrictMode>,
);
