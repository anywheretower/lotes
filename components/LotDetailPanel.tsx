"use client";

import { Lot, statusColors } from "@/data/lots";

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

// ── Component ──────────────────────────────────────────────────────

export default function LotDetailPanel({ lot, onClose }: LotDetailPanelProps) {
  if (!lot) return null;

  const statusColor = statusColors[lot.estado];
  const isVendido = lot.estado === "Vendido";
  const showPrice = lot.estado === "Disponible";
  const showContactButton = lot.estado === "Disponible" || lot.estado === "Reservado";

  return (
    <>
      {/* Mobile overlay backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 lg:static lg:z-auto lg:shadow-lg overflow-y-auto">
        {/* Photo placeholder — gradient with lot number */}
        <div
          className="relative h-44 w-full flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${statusColor}22 0%, ${statusColor}44 100%)`,
          }}
        >
          <span
            className="text-6xl font-black opacity-20 select-none"
            style={{ color: statusColor }}
          >
            {lot.id}
          </span>
          <span
            className="absolute bottom-3 left-4 text-xs font-medium px-2 py-0.5 rounded bg-white/80"
            style={{ color: statusColor }}
          >
            Lote {lot.id}
          </span>
          {/* Close button over photo */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 bg-white/80 hover:bg-white rounded-full transition-colors"
            aria-label="Cerrar panel"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5">
          {/* Status badge */}
          <div className="mb-5">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-white text-sm font-semibold"
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
            <DetailIconRow
              icon={<IconUsers />}
              label="Propietario"
              value={lot.familiaPropietaria ?? "No aplica"}
            />
          </div>

          {/* Financing info — only for available/reserved */}
          {showContactButton && (
            <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">Financiamiento</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Reserva</span>
                  <span className="font-semibold text-gray-900">$1.000.000 CLP</span>
                </div>
                <div className="flex justify-between">
                  <span>Financiamiento propio</span>
                  <span className="font-semibold text-gray-900">Hasta 36 cuotas</span>
                </div>
              </div>

              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide mt-4 mb-2">Proceso de compra</h3>
              <ol className="space-y-1.5 text-xs text-gray-500">
                <li><span className="font-semibold text-gray-700">1. Reserva:</span> $1.000.000 formaliza tu intención</li>
                <li><span className="font-semibold text-gray-700">2. Promesa:</span> Firma y pago del 30% (~15 días)</li>
                <li><span className="font-semibold text-gray-700">3. Escrituración:</span> Firma en notaría</li>
                <li><span className="font-semibold text-gray-700">4. Entrega:</span> Acceso al condominio</li>
              </ol>
            </div>
          )}

          {/* Contact button */}
          {showContactButton && (
            <div className="mt-4">
              <a
                href={`https://wa.me/56966298663?text=${encodeURIComponent(`Hola, me interesa el Lote ${lot.id} (${lot.superficie} m², ${lot.linea ?? "Otros"})`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
                Me interesa este lote
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

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
    <div className="flex items-center gap-3 py-3 border-b border-gray-100">
      <span className="text-gray-400 flex-shrink-0">{icon}</span>
      <span className="text-gray-500 text-sm">{label}</span>
      <span className={`ml-auto text-right font-semibold text-sm ${highlight ? "text-green-700" : "text-gray-900"}`}>
        {value}
      </span>
    </div>
  );
}
