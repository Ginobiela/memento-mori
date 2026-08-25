import type { Metadata } from "next";
import { LifeCalendar } from "./LifeCalendar";

export const metadata: Metadata = {
  title: { absolute: "Memento Mori — Calendario de vida" },
  description: "Una vida de 80 años, semana a semana.",
};

export default function Home() {
  return <LifeCalendar />;
}
