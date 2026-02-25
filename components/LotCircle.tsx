"use client";

import { Lot, statusColors } from "@/data/lots";

interface LotCircleProps {
  lot: Lot;
  isSelected: boolean;
  dimmed?: boolean;
  onSelect: (lot: Lot) => void;
  onHoverStart?: (lot: Lot) => void;
  onHoverEnd?: () => void;
}

const RADIUS = 12;

export default function LotCircle({ lot, isSelected, dimmed, onSelect, onHoverStart, onHoverEnd }: LotCircleProps) {
  const { cx, cy } = lot.coords;
  const fill = statusColors[lot.estado];

  return (
    <g
      onClick={() => onSelect(lot)}
      onMouseEnter={() => onHoverStart?.(lot)}
      onMouseLeave={() => onHoverEnd?.()}
      className="cursor-pointer"
      role="button"
      aria-label={`Sitio ${lot.id} - ${lot.estado}`}
      opacity={dimmed ? 0.2 : 1}
      style={{ transition: "opacity 0.2s" }}
    >
      {/* Selection ring */}
      {isSelected && (
        <circle
          cx={cx}
          cy={cy}
          r={RADIUS + 4}
          fill="none"
          stroke="#fff"
          strokeWidth={3}
        />
      )}

      {/* Main circle */}
      <circle
        cx={cx}
        cy={cy}
        r={RADIUS}
        fill={fill}
        fillOpacity={isSelected ? 1 : 0.85}
        stroke="#fff"
        strokeWidth={1.5}
        className="transition-all duration-150 hover:fill-opacity-100"
      />

      {/* Lot number */}
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#fff"
        fontSize={8.5}
        fontWeight="bold"
        className="pointer-events-none select-none"
      >
        {lot.id}
      </text>
    </g>
  );
}
