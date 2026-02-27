"use client";

import { lots, statusColors, statusLabels, LotStatus } from "@/data/lots";

export default function Legend() {
  const counts = lots.reduce(
    (acc, lot) => {
      acc[lot.estado] = (acc[lot.estado] || 0) + 1;
      return acc;
    },
    {} as Record<LotStatus, number>
  );

  const statuses: LotStatus[] = ["Disponible", "Promesado", "Reservado", "Vendido"];
  const disponibles = counts["Disponible"] || 0;
  const total = lots.length;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
        {disponibles}/{total} disponibles
      </span>
      <span className="hidden sm:block w-px h-4" style={{ backgroundColor: 'var(--color-border)' }} />
      {statuses.map((status) => {
        const count = counts[status] || 0;
        if (count === 0) return null;
        return (
          <div key={status} className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full ring-1 ring-white shadow-sm"
              style={{ backgroundColor: statusColors[status] }}
            />
            <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
              {statusLabels[status]} ({count})
            </span>
          </div>
        );
      })}
    </div>
  );
}
