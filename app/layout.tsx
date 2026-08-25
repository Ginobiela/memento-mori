import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host?.startsWith("localhost") ? "http" : "https");
  const socialImage = host ? `${protocol}://${host}/og.png` : undefined;

  return {
    title: {
      default: "Memento Mori",
      template: "%s · Memento Mori",
    },
    description: "Una vida de 80 años, semana a semana.",
    openGraph: {
      title: "Memento Mori",
      description: "80 años · 4.160 semanas",
      images: socialImage
        ? [{ url: socialImage, width: 1536, height: 1024, alt: "Memento Mori — calendario de vida" }]
        : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Memento Mori",
      description: "80 años · 4.160 semanas",
      images: socialImage ? [socialImage] : undefined,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
