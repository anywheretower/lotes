"use client";

import { Lot, statusColors } from "@/data/lots";

interface LotPolygonProps {
  lot: Lot;
  isSelected: boolean;
  onSelect: (lot: Lot) => void;
}

export default function LotPolygon({ lot, isSelected, onSelect }: LotPolygonProps) {
  const { x, y, w, h } = lot.coords;
  const fill = statusColors[lot.estado];

  return (
    <g
      onClick={() => onSelect(lot)}
      className="cursor-pointer"
      role="button"
      aria-label={`Lote ${lot.id} - ${lot.estado}`}
    >
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={fill}
        fillOpacity={isSelected ? 0.9 : 0.6}
        stroke={isSelected ? "#1a1a1a" : "#fff"}
        strokeWidth={isSelected ? 3 : 1}
        rx={2}
        className="transition-all duration-150 hover:fill-opacity-80"
      />
      <text
        x={x + w / 2}
        y={y + h / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#fff"
        fontSize={11}
        fontWeight={isSelected ? "bold" : "normal"}
        className="pointer-events-none select-none"
      >
        {lot.id}
      </text>
    </g>
  );
}
