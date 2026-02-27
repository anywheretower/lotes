"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { lots, Lot, Linea, statusColors } from "@/data/lots";
import { amenities, Amenity, AMENITY_COLOR } from "@/data/amenities";
import LotCircle from "./LotCircle";
import LotDetailPanel from "./LotDetailPanel";
import AmenityCircle from "./AmenityCircle";
import AmenityDetailPanel from "./AmenityDetailPanel";
import Legend from "./Legend";

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
    : null;

  const [selectedLot, setSelectedLot] = useState<Lot | null>(initialLot);
  const [hoveredLot, setHoveredLot] = useState<Lot | null>(null);
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);
  const [hoveredAmenity, setHoveredAmenity] = useState<Amenity | null>(null);
  const [filterLinea, setFilterLinea] = useState<LineaFilter>("all");
  const [filterPrice, setFilterPrice] = useState<PriceFilter>("all");
  const [debugCoord, setDebugCoord] = useState<{ x: number; y: number } | null>(null);
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleHoverStart = useCallback((lot: Lot) => setHoveredLot(lot), []);
  const handleHoverEnd = useCallback(() => setHoveredLot(null), []);
  const handleAmenityHoverStart = useCallback((a: Amenity) => setHoveredAmenity(a), []);
  const handleAmenityHoverEnd = useCallback(() => setHoveredAmenity(null), []);

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
    setSelectedAmenity(null);
    setSelectedLot((prev) => (prev?.id === lot.id ? null : lot));
  };

  const handleSelectAmenity = (amenity: Amenity) => {
    setSelectedLot(null);
    setSelectedAmenity((prev) => (prev?.id === amenity.id ? null : amenity));
  };

  const handleClose = () => {
    setSelectedLot(null);
    setSelectedAmenity(null);
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
    <div className="lg:h-full lg:flex lg:flex-col lg:overflow-hidden">
      {/* ── Header ── */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 flex-shrink-0">
        {/* Row 1: Title + Legend */}
        <div className="px-4 sm:px-6 lg:px-8 py-5 border-b border-gray-100">
          <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              Mirador Alto Colbún
            </h1>
            <Legend />
          </div>
        </div>

        {/* Row 2: Filters */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 bg-gray-50">
          <div className="max-w-screen-2xl mx-auto flex flex-wrap items-center gap-x-6 gap-y-2">
            {/* Ubicación */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Ubicación</span>
              <div className="flex gap-1">
                {LINEA_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFilterLinea(filterLinea === opt.value ? "all" : opt.value)}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium text-center transition-colors ${
                      filterLinea === opt.value
                        ? "bg-[#3771b3] text-white"
                        : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Separador */}
            <div className="hidden sm:block w-px h-5 bg-gray-200" />

            {/* Precio */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Precio</span>
              <div className="flex gap-1">
                {PRICE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFilterPrice(filterPrice === opt.value ? "all" : opt.value)}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium text-center transition-colors ${
                      filterPrice === opt.value
                        ? "bg-[#3771b3] text-white"
                        : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Active filter indicator */}
            {hasActiveFilter && (
              <>
                <div className="hidden sm:block w-px h-5 bg-gray-200" />
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-500">
                    {matchCount} sitio{matchCount !== 1 ? "s" : ""} coinciden
                  </span>
                  <button
                    onClick={() => { setFilterLinea("all"); setFilterPrice("all"); }}
                    className="text-[11px] text-red-600 hover:text-red-700 font-medium"
                  >
                    Limpiar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

    <div className="flex flex-col lg:flex-row gap-0 lg:gap-4 px-4 py-4 sm:px-6 lg:px-8 lg:flex-1 lg:min-h-0 lg:overflow-hidden">
      {/* Map area */}
      <div className="flex-1 min-w-0 max-w-screen-2xl mx-auto w-full lg:h-full lg:overflow-y-auto">
        <div className="w-full lg:h-full">
        <div
          className="relative w-full aspect-[850/1100] -mt-[28%] -mb-[18%]"
        >
          {/* Background image */}
          <img
            src="/plano-base.png"
            alt="Plano Mirador Alto Colbún"
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
            {/* ── Lago label ──────────────────────────────── */}
            <text
              x={500}
              y={345}
              textAnchor="middle"
              fill="white"
              fontSize={18}
              fontWeight="bold"
              opacity={0.6}
              letterSpacing={6}
              className="pointer-events-none select-none"
            >
              LAGO COLBÚN
            </text>

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

            {/* ── Amenity circles ─────────────────────────── */}
            <g opacity={DEBUG_COORDS ? 0.3 : 1}>
              {amenities.map((amenity) => (
                <AmenityCircle
                  key={amenity.id}
                  amenity={amenity}
                  isSelected={selectedAmenity?.id === amenity.id}
                  onSelect={handleSelectAmenity}
                  onHoverStart={handleAmenityHoverStart}
                  onHoverEnd={handleAmenityHoverEnd}
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
                <div className="font-bold text-sm mb-0.5">Sitio {hoveredLot.id}</div>
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

          {/* ── Amenity hover tooltip ──────────────────────── */}
          {hoveredAmenity && hoveredAmenity.id !== selectedAmenity?.id && (
            <div
              className="absolute pointer-events-none z-30 transition-opacity duration-100"
              style={{
                left: `${(hoveredAmenity.coords.cx / 850) * 100}%`,
                top: `${(hoveredAmenity.coords.cy / 1100) * 100}%`,
                transform: "translate(-50%, -120%)",
              }}
            >
              <div className="bg-gray-900/90 text-white rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-lg backdrop-blur-sm">
                <div className="font-bold text-sm">{hoveredAmenity.nombre}</div>
              </div>
              <div className="w-2 h-2 bg-gray-900/90 rotate-45 mx-auto -mt-1" />
            </div>
          )}

          {/* ── Debug coordinate overlay ──────────────────── */}
          {DEBUG_COORDS && (
            <div className="fixed bottom-4 left-4 z-[9999] bg-black/90 text-white rounded-lg p-3 text-xs font-mono max-w-[260px]">
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

      {/* Detail panel or welcome card */}
      <div className="lg:w-96 lg:flex-shrink-0 lg:overflow-y-auto">
        {selectedLot ? (
          <LotDetailPanel lot={selectedLot} onClose={handleClose} />
        ) : selectedAmenity ? (
          <AmenityDetailPanel amenity={selectedAmenity} onClose={handleClose} />
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#3771b3] to-[#2a5a8f] px-5 py-6 text-white">
              <h2 className="text-lg font-bold">Bienvenido a Mirador Alto Colbún</h2>
              <p className="text-sm text-white/80 mt-1">Explora los sitios disponibles en el plano interactivo</p>
            </div>

            <div className="p-5 space-y-5">
              {/* Steps */}
              <div className="space-y-4">
                <WelcomeStep
                  number={1}
                  title="Explora el plano"
                  description="Pasa el cursor sobre los círculos numerados para ver un resumen rápido de cada sitio."
                />
                <WelcomeStep
                  number={2}
                  title="Selecciona un sitio"
                  description="Haz clic en cualquier sitio para ver su ficha completa con superficie, precio, ubicación y más."
                />
                <WelcomeStep
                  number={3}
                  title="Filtra por ubicación o precio"
                  description="Usa los filtros de arriba del plano para encontrar sitios según tu preferencia. Los que no coincidan se atenúan."
                />
                <WelcomeStep
                  number={4}
                  title="Consulta por WhatsApp"
                  description="¿Te interesa un sitio? Desde su ficha puedes contactarnos directamente por WhatsApp."
                />
              </div>

              {/* Color legend */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">Colores del plano</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#3771b3]" />
                    <span className="text-xs text-gray-600">Vendido</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#16A34A]" />
                    <span className="text-xs text-gray-600">Disponible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#C62828]" />
                    <span className="text-xs text-gray-600">Promesado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#E65100]" />
                    <span className="text-xs text-gray-600">Reservado</span>
                  </div>
                </div>
              </div>

              {/* Tip */}
              <p className="text-xs text-gray-400 text-center">
                Haz clic en un sitio del plano para comenzar →
              </p>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* ── Footer ── */}
    <footer className="text-gray-400 text-xs border-t border-gray-200 flex-shrink-0">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-7 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <span>© {new Date().getFullYear()} Mirador Alto Colbún · Lago Colbún, Región del Maule</span>
        <div className="flex items-center gap-4">
          <a href="https://wa.me/56966298663" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">+56 9 6629 8663</a>
          <a href="https://www.instagram.com/miradoraltocolbun" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors" aria-label="Instagram">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
          <a href="https://miradoraltocolbun.cl" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors" aria-label="Sitio web">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
          </a>
        </div>
      </div>
    </footer>
    </div>
  );
}

function WelcomeStep({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex gap-3">
      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#3771b3] text-white text-xs font-bold flex items-center justify-center mt-0.5">
        {number}
      </span>
      <div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{description}</p>
      </div>
    </div>
  );
}
