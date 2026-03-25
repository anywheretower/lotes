"use client";

import type { Lot, LotStatus } from "@/lib/types";
import { statusColors, statusLabels } from "@/lib/constants";

interface LegendProps {
  lots: Lot[];
}

export default function Legend({ lots }: LegendProps) {
  const counts = lots.reduce(
    (acc, lot) => {
      acc[lot.estado] = (acc[lot.estado] || 0) + 1;
      return acc;
    },
    {} as Record<LotStatus, number>
  );

  const statuses: LotStatus[] = ["Promoción", "Disponible", "Vendido", "Reservado"];
  const disponibles = counts["Disponible"] || 0;
  const total = lots.length;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-xs font-medium text-neutral-900">
        {disponibles}/{total} disponibles
      </span>
      <span className="hidden sm:block w-px h-4 bg-neutral-200" />
      {statuses.map((status) => {
        const count = counts[status] || 0;
        return (
          <div key={status} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: statusColors[status] }}
            />
            <span className="text-xs text-neutral-400">
              {statusLabels[status]} ({count})
            </span>
          </div>
        );
      })}
    </div>
  );
}
