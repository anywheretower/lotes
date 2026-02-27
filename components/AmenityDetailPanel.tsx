"use client";

import { Amenity, AMENITY_COLOR } from "@/data/amenities";

interface AmenityDetailPanelProps {
  amenity: Amenity | null;
  onClose: () => void;
}

export default function AmenityDetailPanel({ amenity, onClose }: AmenityDetailPanelProps) {
  if (!amenity) return null;

  return (
    <>
      {/* Mobile overlay backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 lg:static lg:z-auto lg:shadow-lg overflow-y-auto lg:rounded-2xl lg:border lg:border-[var(--color-border)]">
        {/* Header with gradient */}
        <div
          className="relative h-48 w-full flex items-center justify-center overflow-hidden lg:rounded-t-2xl"
          style={{
            background: `linear-gradient(135deg, ${AMENITY_COLOR}18 0%, ${AMENITY_COLOR}35 50%, ${AMENITY_COLOR}55 100%)`,
          }}
        >
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `radial-gradient(${AMENITY_COLOR} 1px, transparent 1px)`, backgroundSize: '16px 16px' }} />
          <span
            className="text-5xl select-none"
            style={{ color: AMENITY_COLOR, opacity: 0.15, fontFamily: 'var(--font-display)', fontWeight: 700 }}
          >
            {amenity.inicial}
          </span>
          <span
            className="absolute bottom-3 left-4 text-xs font-semibold px-3 py-1 rounded-lg bg-white/90 backdrop-blur-sm shadow-sm"
            style={{ color: AMENITY_COLOR }}
          >
            Equipamiento
          </span>
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-xl transition-all shadow-sm hover:shadow"
            aria-label="Cerrar panel"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5">
          {/* Name */}
          <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>{amenity.nombre}</h2>

          {/* Photo */}
          {amenity.foto && (
            <div className="mb-4 rounded-xl overflow-hidden shadow-sm">
              <img
                src={amenity.foto}
                alt={amenity.nombre}
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          {/* Notes */}
          {amenity.notas && (
            <div className="py-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-3 mb-1.5">
                <span className="flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                    <path d="M14 2v6h6" />
                    <path d="M8 13h8" />
                    <path d="M8 17h8" />
                  </svg>
                </span>
                <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Notas</span>
              </div>
              <p className="text-sm leading-relaxed pl-[30px]" style={{ color: 'var(--color-text)' }}>{amenity.notas}</p>
            </div>
          )}

          {/* No photo placeholder */}
          {!amenity.foto && !amenity.notas && (
            <p className="text-sm text-center py-6" style={{ color: '#94a3b8' }}>
              Sin información adicional.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
