import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lotes Lago - Proyecto Inmobiliario",
  description: "Plano interactivo de lotes junto al lago. Explore disponibilidad, superficies y ubicación.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
