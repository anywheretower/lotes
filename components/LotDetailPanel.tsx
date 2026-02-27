"use client";

import { useState } from "react";
import type { Lot } from "@/lib/types";
import { statusColors } from "@/lib/constants";

interface LotDetailPanelProps {
  lot: Lot | null;
  onClose: () => void;
}

// ── Inline SVG icons (18×18, stroke-only, monocolor) ──────────────

function IconRulers() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 5v14" />
      <path d="M21 5v14" />
      <path d="M3 12h18" />
      <path d="M8 5v3" />
      <path d="M13 5v3" />
      <path d="M18 5v3" />
      <path d="M8 16v3" />
      <path d="M13 16v3" />
      <path d="M18 16v3" />
    </svg>
  );
}

function IconMapPin() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconBanknotes() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M6 12h.01" />
      <path d="M18 12h.01" />
    </svg>
  );
}

function IconCreditCard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}

function IconTag() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.42 0l6.58-6.58a1 1 0 0 0 0-1.42L12 2Z" />
      <circle cx="7" cy="7" r="1.5" />
    </svg>
  );
}

function IconHome() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconHomeDetail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V9l9-7 9 7v10a2 2 0 0 1-2 2h-4" />
      <path d="M9 21v-6h6v6" />
      <path d="M3 10h18" />
    </svg>
  );
}

function IconNotes() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h8" />
    </svg>
  );
}

// ── Component ──────────────────────────────────────────────────────

export default function LotDetailPanel({ lot, onClose }: LotDetailPanelProps) {
  if (!lot) return null;

  const statusColor = statusColors[lot.estado];
  const showPrice = lot.estado === "Disponible";
  const showContactButton = lot.estado === "Disponible" || lot.estado === "Reservado";
  const realPhotos = lot.fotos.filter((f) => f && !f.includes("placeholder"));

  return (
    <>
      {/* Mobile overlay backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white z-50 lg:static lg:z-auto overflow-y-auto lg:border lg:border-neutral-100">
        {/* Photo or placeholder */}
        {realPhotos.length > 0 ? (
          <PhotoCarousel photos={realPhotos} lotId={lot.id} statusColor={statusColor} onClose={onClose} />
        ) : (
          <div
            className="relative h-44 w-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${statusColor}15 0%, ${statusColor}30 100%)`,
            }}
          >
            <span
              className="text-5xl font-black opacity-20 select-none"
              style={{ color: statusColor }}
            >
              {lot.id}
            </span>
            <span
              className="absolute bottom-3 left-4 text-xs font-medium px-2 py-0.5 bg-white/80"
              style={{ color: statusColor }}
            >
              Sitio {lot.id}
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
          {/* Status badge */}
          <div className="mb-5">
            <span
              className="inline-block px-3 py-1 text-white text-xs font-medium"
              style={{ backgroundColor: statusColor }}
            >
              {lot.estado}
            </span>
          </div>

          {/* Detail rows with icons */}
          <div className="space-y-0">
            <DetailIconRow icon={<IconRulers />} label="Superficie" value={`${lot.superficie.toLocaleString("es-CL")} m²`} />
            <DetailIconRow icon={<IconMapPin />} label="Ubicación" value={lot.linea ?? "Otros"} />
            <DetailIconRow
              icon={<IconBanknotes />}
              label="Precio"
              value={showPrice ? `${lot.precio.toLocaleString("es-CL")} UF` : "No aplica"}
              highlight={showPrice}
            />
            <DetailIconRow icon={<IconCreditCard />} label="Forma de pago" value={lot.formaPago} />
            <DetailIconRow
              icon={<IconTag />}
              label="Oferta"
              value={lot.oferta ?? "Sin oferta"}
              highlight={!!lot.oferta}
            />
            <DetailIconRow icon={<IconHome />} label="Casa" value={lot.tieneCasa ? "Sí" : "No"} />
            {lot.descripcionCasa && (
              <DetailTextRow icon={<IconHomeDetail />} label="Descripción casa" value={lot.descripcionCasa} />
            )}
            <DetailIconRow
              icon={<IconUsers />}
              label="Propietario"
              value={lot.familiaPropietaria ?? "No aplica"}
            />
            {lot.notasGenerales && (
              <DetailTextRow icon={<IconNotes />} label="Notas generales" value={lot.notasGenerales} />
            )}
          </div>

          {/* Financing info */}
          {showContactButton && (
            <div className="mt-5 border border-neutral-100 p-4">
              <h3 className="text-[10px] font-medium uppercase tracking-wider text-neutral-400 mb-3">Financiamiento</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Reserva</span>
                  <span className="font-semibold text-neutral-900">$1.000.000 CLP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Financiamiento propio</span>
                  <span className="font-semibold text-neutral-900">Hasta 36 cuotas</span>
                </div>
              </div>

              <div className="h-px bg-neutral-100 my-4" />

              <h3 className="text-[10px] font-medium uppercase tracking-wider text-neutral-400 mb-2">Proceso de compra</h3>
              <ol className="space-y-1.5 text-xs text-neutral-600">
                <li><span className="font-semibold text-neutral-900">1. Reserva:</span> $1.000.000 formaliza tu intención</li>
                <li><span className="font-semibold text-neutral-900">2. Promesa:</span> Firma y pago del 30% (~15 días)</li>
                <li><span className="font-semibold text-neutral-900">3. Escrituración:</span> Firma en notaría</li>
                <li><span className="font-semibold text-neutral-900">4. Entrega:</span> Acceso al condominio</li>
              </ol>
            </div>
          )}

          {/* Contact button */}
          {showContactButton && (
            <div className="mt-4">
              <a
                href={`https://wa.me/56966298663?text=${encodeURIComponent(`Hola, me interesa el Sitio ${lot.id} de Mirador Alto Colbún (${lot.superficie} m², ${lot.linea ?? "Otros"})`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-2.5 px-6 text-xs transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
                Me interesa este sitio
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Photo carousel ──────────────────────────────────────────────────

function PhotoCarousel({ photos, lotId, statusColor, onClose }: {
  photos: string[];
  lotId: number;
  statusColor: string;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const current = photos[idx];

  return (
    <div className="relative h-44 w-full bg-neutral-100">
      <img
        src={current}
        alt={`Sitio ${lotId} - foto ${idx + 1}`}
        className="w-full h-full object-cover"
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
        style={{ color: statusColor }}
      >
        Sitio {lotId}
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

// ── Detail row helpers ──────────────────────────────────────────────

function DetailIconRow({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-neutral-100">
      <span className="text-neutral-400 flex-shrink-0">{icon}</span>
      <span className="text-neutral-600 text-xs">{label}</span>
      <span className={`ml-auto text-right font-semibold text-xs ${highlight ? "text-neutral-900" : "text-neutral-900"}`}>
        {value}
      </span>
    </div>
  );
}

function DetailTextRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="py-2.5 border-b border-neutral-100">
      <div className="flex items-center gap-3 mb-1">
        <span className="text-neutral-400 flex-shrink-0">{icon}</span>
        <span className="text-neutral-600 text-xs">{label}</span>
      </div>
      <p className="text-xs text-neutral-900 leading-relaxed pl-[30px]">{value}</p>
    </div>
  );
}
