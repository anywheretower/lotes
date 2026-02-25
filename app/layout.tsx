import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mirador Alto Colbún - Plano Interactivo",
  description: "Plano interactivo del condominio Mirador Alto Colbún. Explore disponibilidad, superficies y ubicación de cada sitio.",
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
