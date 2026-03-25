"use client";

import { useState } from "react";
import Image from "next/image";
import type { Amenity } from "@/lib/types";
import { AMENITY_COLOR } from "@/lib/constants";

interface AmenityDetailPanelProps {
  amenity: Amenity | null;
  onClose: () => void;
}

function PhotoCarousel({ photos, nombre, onClose }: {
  photos: string[];
  nombre: string;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const current = photos[idx];

  return (
    <div className="relative w-full bg-neutral-100" style={{ aspectRatio: "16/9" }}>
      <Image
        src={current}
        alt={`${nombre} - foto ${idx + 1}`}
        fill
        sizes="(max-width: 1024px) 100vw, 384px"
        className="object-cover"
        quality={75}
        priority={idx === 0}
      />
      {photos.length > 1 && (
        <>
          <button
            onClick={() => setIdx((i) => (i - 1 + photos.length) % photos.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Foto anterior"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setIdx((i) => (i + 1) % photos.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Foto siguiente"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {photos.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${i === idx ? "bg-white" : "bg-white/50"}`}
              />
            ))}
          </div>
        </>
      )}
      <span
        className="absolute bottom-3 left-4 text-xs font-medium px-2 py-0.5 bg-white/80"
        style={{ color: AMENITY_COLOR }}
      >
        Equipamiento
      </span>
      <button
        onClick={onClose}
        className="absolute top-3 right-3 p-1.5 bg-white/80 hover:bg-white transition-colors"
        aria-label="Cerrar panel"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function AmenityDetailPanel({ amenity, onClose }: AmenityDetailPanelProps) {
  if (!amenity) return null;

  const hasPhotos = amenity.fotos.length > 0;

  return (
    <>
      {/* Mobile overlay backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white z-50 lg:static lg:z-auto overflow-y-auto lg:border lg:border-neutral-100">
        {/* Header with photos or tint */}
        {hasPhotos ? (
          <PhotoCarousel photos={amenity.fotos} nombre={amenity.nombre} onClose={onClose} />
        ) : (
          <div
            className="relative w-full flex items-center justify-center"
            style={{
              aspectRatio: "16/9",
              background: `linear-gradient(135deg, ${AMENITY_COLOR}15 0%, ${AMENITY_COLOR}30 100%)`,
            }}
          >
            <span
              className="text-5xl font-black opacity-20 select-none"
              style={{ color: AMENITY_COLOR }}
            >
              {amenity.inicial}
            </span>
            <span
              className="absolute bottom-3 left-4 text-xs font-medium px-2 py-0.5 bg-white/80"
              style={{ color: AMENITY_COLOR }}
            >
              Equipamiento
            </span>
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 bg-white/80 hover:bg-white transition-colors"
              aria-label="Cerrar panel"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="p-5">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">{amenity.nombre}</h2>

          {amenity.notas && (
            <div className="py-3 border-b border-neutral-100">
              <div className="flex items-center gap-3 mb-1.5">
                <span className="text-neutral-400 flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                    <path d="M14 2v6h6" />
                    <path d="M8 13h8" />
                    <path d="M8 17h8" />
                  </svg>
                </span>
                <span className="text-neutral-600 text-sm">Notas</span>
              </div>
              <p className="text-sm text-neutral-900 leading-relaxed pl-[30px]">{amenity.notas}</p>
            </div>
          )}

          {!hasPhotos && !amenity.notas && (
            <p className="text-sm text-neutral-400 text-center py-6">
              Sin información adicional.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
