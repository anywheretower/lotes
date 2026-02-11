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

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {statuses.map((status) => {
        const count = counts[status] || 0;
        if (count === 0) return null;
        return (
          <div key={status} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: statusColors[status] }}
            />
            <span className="text-sm text-gray-700">
              {statusLabels[status]} ({count})
            </span>
          </div>
        );
      })}
      <div className="flex items-center gap-2 ml-2">
        <span className="text-sm text-gray-500 font-semibold">
          Total: {lots.length} lotes
        </span>
      </div>
    </div>
  );
}
