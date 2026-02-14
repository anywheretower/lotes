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
  const pctVendido = Math.round(((total - disponibles) / total) * 100);

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      <div>
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-sm font-semibold text-gray-900">
            {disponibles} de {total} lotes disponibles
          </span>
          <span className="text-xs text-red-600 font-medium">
            {pctVendido}% vendido
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          {statuses.map((status) => {
            const count = counts[status] || 0;
            if (count === 0) return null;
            const width = (count / total) * 100;
            return (
              <div
                key={status}
                className="h-full float-left"
                style={{
                  width: `${width}%`,
                  backgroundColor: statusColors[status],
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Status badges */}
      <div className="flex flex-wrap gap-3 justify-center">
        {statuses.map((status) => {
          const count = counts[status] || 0;
          if (count === 0) return null;
          return (
            <div key={status} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: statusColors[status] }}
              />
              <span className="text-xs text-gray-600">
                {statusLabels[status]} ({count})
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
