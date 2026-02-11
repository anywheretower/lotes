"use client";

import { useState } from "react";
import { lots, Lot } from "@/data/lots";
import LotPolygon from "./LotPolygon";
import LotDetailPanel from "./LotDetailPanel";

export default function LotMap() {
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);

  const handleSelect = (lot: Lot) => {
    setSelectedLot((prev) => (prev?.id === lot.id ? null : lot));
  };

  const handleClose = () => {
    setSelectedLot(null);
  };

  // Street Y positions (h=14 each, between rows)
  const leftStreetYs  = [250, 322, 394, 466, 538, 610];
  const rightStreetYs = [178, 250, 322, 394, 466, 538];

  return (
    <div className="flex flex-col lg:flex-row gap-0 lg:gap-4">
      {/* Map area */}
      <div className="flex-1 min-w-0">
        <div className="relative w-full overflow-x-auto">
          <svg
            viewBox="0 0 1200 780"
            className="w-full h-auto min-w-[700px]"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* ── Lake ────────────────────────────────────────── */}
            <defs>
              <linearGradient id="lakeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.35} />
              </linearGradient>
            </defs>
            <rect x={0} y={0} width={1200} height={68} fill="url(#lakeGradient)" rx={4} />
            <text x={600} y={25} textAnchor="middle" fill="#fff" fontSize={15} fontWeight="bold">
              LAGO COLBUN
            </text>
            <text x={600} y={45} textAnchor="middle" fill="#DBEAFE" fontSize={10} fontStyle="italic">
              Mirador Alto Colbun
            </text>

            {/* ── Pier / ACCESO LAGO ──────────────────────────── */}
            <rect x={200} y={55} width={44} height={55} fill="#9CA3AF" fillOpacity={0.5} rx={2} />
            <rect x={209} y={38} width={26} height={20} fill="#9CA3AF" fillOpacity={0.35} rx={1} />
            <line x1={210} y1={68} x2={234} y2={68} stroke="#6B7280" strokeWidth={0.8} />
            <line x1={210} y1={78} x2={234} y2={78} stroke="#6B7280" strokeWidth={0.8} />
            <line x1={210} y1={88} x2={234} y2={88} stroke="#6B7280" strokeWidth={0.8} />
            <text x={150} y={82} textAnchor="middle" fill="#4B5563" fontSize={8} fontWeight="bold">
              ACCESO
            </text>
            <text x={150} y={93} textAnchor="middle" fill="#4B5563" fontSize={8} fontWeight="bold">
              LAGO
            </text>

            {/* ── Central path ────────────────────────────────── */}
            <rect x={525} y={108} width={35} height={590} fill="#D1D5DB" rx={2} />
            <text
              x={542} y={420}
              textAnchor="middle" fill="#9CA3AF" fontSize={7}
              transform="rotate(-90, 542, 420)"
            >
              CAMINO CENTRAL
            </text>

            {/* ── Interior streets — horizontal ───────────────── */}
            {/* Left block */}
            {leftStreetYs.map((sy) => (
              <rect key={`ls-${sy}`} x={60} y={sy} width={465} height={14} fill="#D1D5DB" rx={1} />
            ))}
            {/* Right block */}
            {rightStreetYs.map((sy) => (
              <rect key={`rs-${sy}`} x={560} y={sy} width={555} height={14} fill="#D1D5DB" rx={1} />
            ))}

            {/* ── Interior streets — vertical connectors ──────── */}
            {/* Left block right-side connector (to central path) */}
            <rect x={521} y={192} width={4} height={490} fill="#D1D5DB" />
            {/* Right block T-connector at row 1 gap */}
            <rect x={930} y={120} width={12} height={72} fill="#D1D5DB" rx={1} />

            {/* Small intersection circles */}
            {[257, 329, 401, 473, 545].map((cy) => (
              <circle key={`lc-${cy}`} cx={527} cy={cy} r={4} fill="#C6CBD2" />
            ))}
            {[185, 257, 329, 401, 473, 545].map((cy) => (
              <circle key={`rc-${cy}`} cx={560} cy={cy} r={4} fill="#C6CBD2" />
            ))}

            {/* ── Line labels — LEFT margin ───────────────────── */}
            {/* 1ª Línea */}
            <line x1={55} y1={192} x2={55} y2={250} stroke="#3B82F6" strokeWidth={3} />
            <text x={46} y={221} textAnchor="middle" fill="#3B82F6" fontSize={7} fontWeight="bold"
              transform="rotate(-90, 46, 221)">
              1ª LINEA
            </text>
            {/* 2ª Línea */}
            <line x1={38} y1={264} x2={38} y2={322} stroke="#3B82F6" strokeWidth={3} />
            <text x={29} y={293} textAnchor="middle" fill="#3B82F6" fontSize={7} fontWeight="bold"
              transform="rotate(-90, 29, 293)">
              2ª LINEA
            </text>
            {/* 3ª Línea */}
            <line x1={21} y1={336} x2={21} y2={682} stroke="#84CC16" strokeWidth={3} />
            <text x={12} y={509} textAnchor="middle" fill="#65A30D" fontSize={7} fontWeight="bold"
              transform="rotate(-90, 12, 509)">
              3ª LINEA
            </text>

            {/* ── Line labels — RIGHT margin ──────────────────── */}
            {/* 1ª Línea */}
            <line x1={1115} y1={120} x2={1115} y2={178} stroke="#3B82F6" strokeWidth={3} />
            <text x={1125} y={149} textAnchor="middle" fill="#3B82F6" fontSize={7} fontWeight="bold"
              transform="rotate(90, 1125, 149)">
              1ª LINEA
            </text>
            {/* 2ª Línea */}
            <line x1={1130} y1={192} x2={1130} y2={250} stroke="#3B82F6" strokeWidth={3} />
            <text x={1140} y={221} textAnchor="middle" fill="#3B82F6" fontSize={7} fontWeight="bold"
              transform="rotate(90, 1140, 221)">
              2ª LINEA
            </text>
            {/* 3ª Línea */}
            <line x1={1145} y1={264} x2={1145} y2={610} stroke="#84CC16" strokeWidth={3} />
            <text x={1155} y={437} textAnchor="middle" fill="#65A30D" fontSize={7} fontWeight="bold"
              transform="rotate(90, 1155, 437)">
              3ª LINEA
            </text>

            {/* ── Access road ─────────────────────────────────── */}
            <rect x={0} y={700} width={1200} height={40} fill="#E5E7EB" rx={4} />
            <text x={600} y={724} textAnchor="middle" fill="#9CA3AF" fontSize={11} fontWeight="bold">
              CAMINO DE ACCESO
            </text>

            {/* ── Lots ────────────────────────────────────────── */}
            {lots.map((lot) => (
              <LotPolygon
                key={lot.id}
                lot={lot}
                isSelected={selectedLot?.id === lot.id}
                onSelect={handleSelect}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Detail panel */}
      {selectedLot && (
        <div className="lg:w-96 lg:flex-shrink-0">
          <LotDetailPanel lot={selectedLot} onClose={handleClose} />
        </div>
      )}
    </div>
  );
}
