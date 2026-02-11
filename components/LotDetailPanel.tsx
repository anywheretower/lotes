"use client";

import { Lot, statusColors } from "@/data/lots";

interface LotDetailPanelProps {
  lot: Lot | null;
  onClose: () => void;
}

export default function LotDetailPanel({ lot, onClose }: LotDetailPanelProps) {
  if (!lot) return null;

  const statusColor = statusColors[lot.estado];
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
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Lote {lot.id}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Cerrar panel"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Status badge */}
          <div className="mb-6">
            <span
              className="inline-block px-4 py-2 rounded-full text-white text-sm font-semibold"
              style={{ backgroundColor: statusColor }}
            >
              {lot.estado}
            </span>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <DetailRow label="Superficie" value={`${lot.superficie.toLocaleString("es-CL")} m²`} />
            <DetailRow label="Línea" value={lot.linea} />
            {showPrice && (
              <DetailRow
                label="Precio"
                value={`${lot.precio.toLocaleString("es-CL")} UF`}
                highlight
              />
            )}
          </div>

          {/* Contact button */}
          {showContactButton && (
            <div className="mt-8">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Hola, me interesa el Lote ${lot.id} (${lot.superficie} m², ${lot.linea})`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Me interesa este lote
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function DetailRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-100">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className={`font-semibold ${highlight ? "text-green-700 text-lg" : ""}`}>
        {value}
      </span>
    </div>
  );
}
