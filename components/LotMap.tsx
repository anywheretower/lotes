"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { lots, Lot, Linea, statusColors } from "@/data/lots";
import LotCircle from "./LotCircle";
import LotDetailPanel from "./LotDetailPanel";

// ── DEBUG MODE — set to false after calibration ──
const DEBUG_COORDS = false;

type LineaFilter = "all" | Linea | "otros";
type PriceFilter = "all" | "low" | "mid" | "high";

const LINEA_OPTIONS: { value: LineaFilter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "1ª Línea", label: "1ª Línea" },
  { value: "2ª Línea", label: "2ª Línea" },
  { value: "3ª Línea", label: "3ª Línea" },
  { value: "otros", label: "Otros" },
];

const PRICE_OPTIONS: { value: PriceFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "low", label: "≤ 2.000 UF" },
  { value: "mid", label: "2.000 – 2.300 UF" },
  { value: "high", label: "> 2.300 UF" },
];

function matchesFilter(lot: Lot, linea: LineaFilter, price: PriceFilter): boolean {
  // Line filter
  if (linea !== "all") {
    if (linea === "otros") {
      if (lot.linea !== null) return false;
    } else {
      if (lot.linea !== linea) return false;
    }
  }
  // Price filter (only applies to Disponible lots; non-disponible always pass)
  if (price !== "all" && lot.estado === "Disponible") {
    if (price === "low" && lot.precio > 2000) return false;
    if (price === "mid" && (lot.precio <= 2000 || lot.precio > 2300)) return false;
    if (price === "high" && lot.precio <= 2300) return false;
  }
  return true;
}

export default function LotMap() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read ?lote= from URL on mount
  const initialLotId = searchParams.get("lote");
  const initialLot = initialLotId
    ? lots.find((l) => l.id === Number(initialLotId)) ?? null
    : lots.find((l) => l.id === 1) ?? null;

  const [selectedLot, setSelectedLot] = useState<Lot | null>(initialLot);
  const [hoveredLot, setHoveredLot] = useState<Lot | null>(null);
  const [filterLinea, setFilterLinea] = useState<LineaFilter>("all");
  const [filterPrice, setFilterPrice] = useState<PriceFilter>("all");
  const [debugCoord, setDebugCoord] = useState<{ x: number; y: number } | null>(null);
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleHoverStart = useCallback((lot: Lot) => setHoveredLot(lot), []);
  const handleHoverEnd = useCallback(() => setHoveredLot(null), []);

  // Sync URL when selected lot changes
  useEffect(() => {
    const currentParam = searchParams.get("lote");
    const newParam = selectedLot ? String(selectedLot.id) : null;
    if (currentParam !== newParam) {
      const url = newParam ? `?lote=${newParam}` : "/";
      router.replace(url, { scroll: false });
    }
  }, [selectedLot, searchParams, router]);

  const handleSelect = (lot: Lot) => {
    setSelectedLot((prev) => (prev?.id === lot.id ? null : lot));
  };

  const handleClose = () => {
    setSelectedLot(null);
  };

  // ── Debug click handler — converts screen coords to SVG viewBox coords ──
  const handleDebugClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!DEBUG_COORDS) return;
    const svg = svgRef.current;
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const svgPt = pt.matrixTransform(ctm.inverse());
    const x = Math.round(svgPt.x);
    const y = Math.round(svgPt.y);
    setDebugCoord({ x, y });
    setDebugLog((prev) => [`cx: ${x}, cy: ${y}`, ...prev].slice(0, 20));
  };

  const hasActiveFilter = filterLinea !== "all" || filterPrice !== "all";
  const matchCount = hasActiveFilter ? lots.filter((l) => matchesFilter(l, filterLinea, filterPrice)).length : 0;

  return (
    <div className="flex flex-col lg:flex-row gap-0 lg:gap-4">
      {/* Map area */}
      <div className="flex-1 min-w-0">
        {/* ── Filters ────────────────────────────────────── */}
        <div className="mb-3 space-y-2">
          {/* Línea filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mr-1">Ubicación</span>
            {LINEA_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilterLinea(filterLinea === opt.value ? "all" : opt.value)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filterLinea === opt.value
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Price filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mr-1">Precio</span>
            {PRICE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilterPrice(filterPrice === opt.value ? "all" : opt.value)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filterPrice === opt.value
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Active filter indicator */}
          {hasActiveFilter && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {matchCount} lote{matchCount !== 1 ? "s" : ""} coinciden
              </span>
              <button
                onClick={() => { setFilterLinea("all"); setFilterPrice("all"); }}
                className="text-xs text-red-600 hover:text-red-700 font-medium"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        <div className="w-full overflow-hidden">
        <div
          className="relative w-full"
          style={{ aspectRatio: "850 / 1100", marginTop: "-33%", marginBottom: "-8%" }}
        >
          {/* Background image */}
          <img
            src="/plano-base.png"
            alt="Plano de lotes"
            className="absolute inset-0 w-full h-full object-contain"
            draggable={false}
          />

          {/* SVG overlay */}
          <svg
            ref={svgRef}
            viewBox="0 0 850 1100"
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMid meet"
            onClick={DEBUG_COORDS ? handleDebugClick : undefined}
            style={DEBUG_COORDS ? { cursor: "crosshair" } : undefined}
          >
            {/* ── Line labels — LEFT margin (x=135, text x=127) ── */}
            {/* 1ª Línea (lots 35-40, y≈590) */}
            <line x1={135} y1={576} x2={135} y2={604} stroke="#2563EB" strokeWidth={3} />
            <text x={127} y={590} textAnchor="middle" fill="#2563EB" fontSize={8} fontWeight="bold"
              transform="rotate(-90, 127, 590)">
              1ª LINEA
            </text>

            {/* 2ª Línea (lots 29-34, y≈629-633) */}
            <line x1={135} y1={615} x2={135} y2={647} stroke="#2563EB" strokeWidth={3} />
            <text x={127} y={631} textAnchor="middle" fill="#2563EB" fontSize={8} fontWeight="bold"
              transform="rotate(-90, 127, 631)">
              2ª LINEA
            </text>

            {/* 3ª Línea (lots 22-28, y≈666-700) */}
            <line x1={135} y1={652} x2={135} y2={714} stroke="#65A30D" strokeWidth={3} />
            <text x={127} y={683} textAnchor="middle" fill="#65A30D" fontSize={8} fontWeight="bold"
              transform="rotate(-90, 127, 683)">
              3ª LINEA
            </text>

            {/* ── Line labels — RIGHT margin (x=716, text x=726) ── */}
            {/* 1ª Línea (lots 71-76, y≈516-535) */}
            <line x1={716} y1={502} x2={716} y2={549} stroke="#2563EB" strokeWidth={3} />
            <text x={726} y={526} textAnchor="middle" fill="#2563EB" fontSize={8} fontWeight="bold"
              transform="rotate(90, 726, 526)">
              1ª LINEA
            </text>

            {/* 2ª Línea (lots 65-70, y≈588-596) */}
            <line x1={716} y1={574} x2={716} y2={610} stroke="#2563EB" strokeWidth={3} />
            <text x={726} y={592} textAnchor="middle" fill="#2563EB" fontSize={8} fontWeight="bold"
              transform="rotate(90, 726, 592)">
              2ª LINEA
            </text>

            {/* 3ª Línea (lots 59-64, y≈637-642) */}
            <line x1={716} y1={623} x2={716} y2={656} stroke="#65A30D" strokeWidth={3} />
            <text x={726} y={640} textAnchor="middle" fill="#65A30D" fontSize={8} fontWeight="bold"
              transform="rotate(90, 726, 640)">
              3ª LINEA
            </text>

            {/* ── Lot circles ──────────────────────────────── */}
            <g opacity={DEBUG_COORDS ? 0.3 : 1}>
              {lots.map((lot) => (
                <LotCircle
                  key={lot.id}
                  lot={lot}
                  isSelected={selectedLot?.id === lot.id}
                  dimmed={hasActiveFilter && !matchesFilter(lot, filterLinea, filterPrice)}
                  onSelect={handleSelect}
                  onHoverStart={handleHoverStart}
                  onHoverEnd={handleHoverEnd}
                />
              ))}
            </g>

            {/* ── Debug crosshair at last click ───────────── */}
            {DEBUG_COORDS && debugCoord && (
              <g pointerEvents="none">
                <line x1={debugCoord.x - 12} y1={debugCoord.y} x2={debugCoord.x + 12} y2={debugCoord.y} stroke="red" strokeWidth={2} />
                <line x1={debugCoord.x} y1={debugCoord.y - 12} x2={debugCoord.x} y2={debugCoord.y + 12} stroke="red" strokeWidth={2} />
                <circle cx={debugCoord.x} cy={debugCoord.y} r={3} fill="red" />
              </g>
            )}
          </svg>

          {/* ── Hover tooltip ──────────────────────────────── */}
          {hoveredLot && hoveredLot.id !== selectedLot?.id && (
            <div
              className="absolute pointer-events-none z-30 transition-opacity duration-100"
              style={{
                left: `${(hoveredLot.coords.cx / 850) * 100}%`,
                top: `${(hoveredLot.coords.cy / 1100) * 100}%`,
                transform: "translate(-50%, -120%)",
              }}
            >
              <div className="bg-gray-900/90 text-white rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-lg backdrop-blur-sm">
                <div className="font-bold text-sm mb-0.5">Lote {hoveredLot.id}</div>
                <div className="text-gray-300">{hoveredLot.superficie.toLocaleString("es-CL")} m² · {hoveredLot.linea ?? "Otros"}</div>
                {hoveredLot.estado === "Disponible" && (
                  <div className="text-green-400 font-semibold">{hoveredLot.precio.toLocaleString("es-CL")} UF</div>
                )}
                {hoveredLot.estado !== "Disponible" && (
                  <div style={{ color: statusColors[hoveredLot.estado] }} className="font-semibold">{hoveredLot.estado}</div>
                )}
              </div>
              <div className="w-2 h-2 bg-gray-900/90 rotate-45 mx-auto -mt-1" />
            </div>
          )}

          {/* ── Debug coordinate overlay ──────────────────── */}
          {DEBUG_COORDS && (
            <div className="absolute top-12 left-2 z-50 bg-black/80 text-white rounded-lg p-3 text-xs font-mono max-w-[260px] pointer-events-none">
              <div className="text-yellow-300 font-bold mb-1">DEBUG: Click en el mapa para obtener coordenadas</div>
              {debugCoord && (
                <div className="text-green-300 text-sm font-bold mb-2">
                  cx: {debugCoord.x}, cy: {debugCoord.y}
                </div>
              )}
              {debugLog.length > 0 && (
                <div className="border-t border-white/20 pt-1 mt-1 space-y-0.5">
                  {debugLog.map((entry, i) => (
                    <div key={i} className={i === 0 ? "text-green-300" : "text-gray-400"}>
                      {entry}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
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
