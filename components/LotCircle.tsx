"use client";

import type { Lot } from "@/lib/types";
import { statusColors } from "@/lib/constants";

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

      {/* House badge */}
      {/* House badge */}
      {lot.tieneCasa && (
        <g
          transform={`translate(${cx + RADIUS * 0.85}, ${cy - RADIUS * 0.85})`}
          className="pointer-events-none"
        >
          <circle r={6.5} fill="#fff" stroke={fill} strokeWidth={1.2} />
          <path
            d="M0-4L-4 0V3.5H-1.3V0.7H1.3V3.5H4V0Z"
            fill={fill}
          />
        </g>
      )}

      {/* Commercial badge */}
      {lot.familiaPropietaria === "COMERCIAL" && (
        <g
          transform={`translate(${cx + RADIUS * 0.85}, ${cy - RADIUS * 0.85})`}
          className="pointer-events-none"
        >
          <circle r={6.5} fill="#fff" stroke={fill} strokeWidth={1.2} />
          {/* Storefront icon */}
          <path
            d="M-3.5-1.5H3.5V-3H-3.5ZM-3.5 0H-2V-1H2V0H3.5V-1.5H-3.5ZM-3 3.5H-1V1.5H1V3.5H3V0H-3Z"
            fill={fill}
          />
        </g>
      )}
    </g>
  );
}
