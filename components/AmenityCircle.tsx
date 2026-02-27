"use client";

import type { Amenity } from "@/lib/types";
import { AMENITY_COLOR } from "@/lib/constants";

interface AmenityCircleProps {
  amenity: Amenity;
  isSelected: boolean;
  onSelect: (amenity: Amenity) => void;
  onHoverStart?: (amenity: Amenity) => void;
  onHoverEnd?: () => void;
}

const RADIUS = 9;

export default function AmenityCircle({ amenity, isSelected, onSelect, onHoverStart, onHoverEnd }: AmenityCircleProps) {
  const { cx, cy } = amenity.coords;
  const fontSize = amenity.inicial.length > 1 ? 5.5 : 7;

  return (
    <g
      onClick={() => onSelect(amenity)}
      onMouseEnter={() => onHoverStart?.(amenity)}
      onMouseLeave={() => onHoverEnd?.()}
      className="cursor-pointer"
      role="button"
      aria-label={amenity.nombre}
    >
      {isSelected && (
        <circle
          cx={cx}
          cy={cy}
          r={RADIUS + 3}
          fill="none"
          stroke="#fff"
          strokeWidth={2.5}
        />
      )}

      <circle
        cx={cx}
        cy={cy}
        r={RADIUS}
        fill={AMENITY_COLOR}
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
        fontSize={fontSize}
        fontWeight="bold"
        className="pointer-events-none select-none"
      >
        {amenity.inicial}
      </text>
    </g>
  );
}
