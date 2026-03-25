"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Lot, Amenity } from "@/lib/types";
import { statusColors } from "@/lib/constants";
import LotCircle from "./LotCircle";
import LotDetailPanel from "./LotDetailPanel";
import AmenityCircle from "./AmenityCircle";
import AmenityDetailPanel from "./AmenityDetailPanel";
import Legend from "./Legend";

/* Cropped viewBox — tight around the lot/amenity content area */
const VB = { x: 70, y: 280, w: 720, h: 700 };

type SimpleFilter = "disponible" | "conCasa" | "comercial";

function matchesFilter(lot: Lot, filters: Set<SimpleFilter>): boolean {
  if (filters.size === 0) return true;
  if (filters.has("disponible") && lot.estado !== "Disponible") return false;
  if (filters.has("conCasa") && !lot.tieneCasa) return false;
  if (filters.has("comercial") && lot.familiaPropietaria !== "COMERCIAL") return false;
  return true;
}

interface LotMapProps {
  lots: Lot[];
  amenities: Amenity[];
}

export default function LotMap({ lots, amenities }: LotMapProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialLotId = searchParams.get("lote");
  const initialLot = initialLotId
    ? lots.find((l) => l.id === Number(initialLotId)) ?? null
    : null;

  const [selectedLot, setSelectedLot] = useState<Lot | null>(initialLot);
  const [hoveredLot, setHoveredLot] = useState<Lot | null>(null);
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);
  const [hoveredAmenity, setHoveredAmenity] = useState<Amenity | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<SimpleFilter>>(new Set());
  const [zoom, setZoom] = useState(1);
  const svgRef = useRef<SVGSVGElement>(null);
  const mapScrollRef = useRef<HTMLDivElement>(null);
  const prevCenterRef = useRef<{ x: number; y: number } | null>(null);

  const handleHoverStart = useCallback((lot: Lot) => setHoveredLot(lot), []);
  const handleHoverEnd = useCallback(() => setHoveredLot(null), []);

  /** Convert SVG coords to % position relative to the inner wrapper div */
  const svgToPercent = useCallback((svgX: number, svgY: number) => {
    const svg = svgRef.current;
    if (!svg) return { left: "0%", top: "0%" };
    const pt = svg.createSVGPoint();
    pt.x = svgX;
    pt.y = svgY;
    const screenPt = pt.matrixTransform(svg.getScreenCTM()!);
    const rect = svg.getBoundingClientRect();
    const pctX = ((screenPt.x - rect.left) / rect.width) * 100;
    const pctY = ((screenPt.y - rect.top) / rect.height) * 100;
    return { left: `${pctX}%`, top: `${pctY}%` };
  }, []);
  const handleAmenityHoverStart = useCallback((a: Amenity) => setHoveredAmenity(a), []);
  const handleAmenityHoverEnd = useCallback(() => setHoveredAmenity(null), []);

  /* Save scroll center before zoom change, restore after render */
  const saveCenterAndZoom = useCallback((fn: (z: number) => number) => {
    const c = mapScrollRef.current;
    if (c && c.scrollWidth > c.clientWidth) {
      prevCenterRef.current = {
        x: (c.scrollLeft + c.clientWidth / 2) / c.scrollWidth,
        y: (c.scrollTop + c.clientHeight / 2) / c.scrollHeight,
      };
    } else {
      prevCenterRef.current = { x: 0.5, y: 0.5 };
    }
    setZoom(fn);
  }, []);

  useEffect(() => {
    const center = prevCenterRef.current;
    const c = mapScrollRef.current;
    if (!center || !c) return;
    prevCenterRef.current = null;
    requestAnimationFrame(() => {
      c.scrollLeft = center.x * c.scrollWidth - c.clientWidth / 2;
      c.scrollTop = center.y * c.scrollHeight - c.clientHeight / 2;
    });
  }, [zoom]);

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

  const toggleFilter = (f: SimpleFilter) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f); else next.add(f);
      return next;
    });
  };

  const hasActiveFilter = activeFilters.size > 0;
  const matchCount = hasActiveFilter ? lots.filter((l) => matchesFilter(l, activeFilters)).length : 0;

  return (
    <div className="lg:h-full lg:flex lg:flex-col lg:overflow-hidden">
      {/* ── Header ── */}
      <header className="sticky top-0 z-30 flex-shrink-0 bg-white border-b border-neutral-100">
        {/* Row 1: Title + Legend */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-neutral-100">
          <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-neutral-900">
              Condominio Mirador Alto Colbún
            </h1>
            <Legend lots={lots} />
          </div>
        </div>

        {/* Row 2: Filters */}
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-screen-2xl mx-auto flex flex-wrap items-center gap-x-6 gap-y-2">
            {/* Filtros */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">Filtrar</span>
              <div className="flex gap-1">
                {([
                  { key: "disponible" as SimpleFilter, label: "Disponibles", activeClass: "bg-[#16A34A] text-white" },
                  { key: "conCasa" as SimpleFilter, label: "Con casa", activeClass: "bg-neutral-900 text-white", icon: (
                    <svg className="w-3 h-3 inline-block mr-1" viewBox="-5 -5 10 10" fill="currentColor"><path d="M0-4L-4 0V3.5H-1.3V0.7H1.3V3.5H4V0Z" /></svg>
                  ) },
                  { key: "comercial" as SimpleFilter, label: "Comercial", activeClass: "bg-neutral-900 text-white", icon: (
                    <svg className="w-3 h-3 inline-block mr-1" viewBox="-5 -5 10 10" fill="currentColor"><path d="M-3.5-1.5H3.5V-3H-3.5ZM-3.5 0H-2V-1H2V0H3.5V-1.5H-3.5ZM-3 3.5H-1V1.5H1V3.5H3V0H-3Z" /></svg>
                  ) },
                ]).map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => toggleFilter(opt.key)}
                    className={`px-3 py-1 text-[11px] font-medium text-center transition-colors ${
                      activeFilters.has(opt.key)
                        ? opt.activeClass
                        : "text-neutral-500 hover:text-neutral-900 border border-neutral-200 hover:border-neutral-900"
                    }`}
                  >
                    {"icon" in opt && opt.icon}{opt.label}
                  </button>
                ))}
              </div>
            </div>

            {hasActiveFilter && (
              <>
                <div className="hidden sm:block w-px h-5 bg-neutral-100" />
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-400">
                    {matchCount} sitio{matchCount !== 1 ? "s" : ""} coinciden
                  </span>
                  <button
                    onClick={() => setActiveFilters(new Set())}
                    className="text-[11px] text-red-500 hover:text-red-600 font-medium transition-colors"
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
      <div className="relative flex-1 min-w-0 max-w-screen-2xl mx-auto w-full lg:h-full">
        {/* Zoom controls — fixed relative to map area, not scrollable content */}
        <div className="absolute top-2 right-5 z-20 flex flex-col gap-1">
          <button
            onClick={() => saveCenterAndZoom((z) => Math.min(z + 0.1, 3))}
            className="w-7 h-7 bg-neutral-900 text-white hover:bg-neutral-700 flex items-center justify-center text-sm font-medium transition-colors shadow-sm"
            aria-label="Acercar"
          >
            +
          </button>
          <button
            onClick={() => saveCenterAndZoom((z) => Math.max(z - 0.1, 1))}
            disabled={zoom <= 1}
            className="w-7 h-7 bg-neutral-900 text-white hover:bg-neutral-700 flex items-center justify-center text-sm font-medium transition-colors shadow-sm disabled:opacity-30 disabled:cursor-default"
            aria-label="Alejar"
          >
            −
          </button>
          {zoom > 1 && (
            <button
              onClick={() => setZoom(1)}
              className="w-7 h-7 bg-neutral-900 text-white hover:bg-neutral-700 flex items-center justify-center transition-colors shadow-sm"
              aria-label="Restablecer zoom"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" /></svg>
            </button>
          )}
        </div>
        <div ref={mapScrollRef} className="w-full h-full overflow-auto">
        <div
          className="relative"
          style={{
            aspectRatio: `${VB.w} / ${VB.h}`,
            width: zoom > 1 ? `${zoom * 100}%` : "100%",
            maxHeight: zoom === 1 ? "100%" : undefined,
          }}
        >
          <svg
            ref={svgRef}
            viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Background image — rendered inside SVG so viewBox crops it */}
            <image href="/plano-base.png" x="0" y="0" width="850" height="1100" />

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

            {/* ── Line labels — LEFT margin ── */}
            <line x1={135} y1={576} x2={135} y2={604} stroke="#2563EB" strokeWidth={3} />
            <text x={127} y={590} textAnchor="middle" fill="#2563EB" fontSize={8} fontWeight="bold"
              transform="rotate(-90, 127, 590)">
              1ª LINEA
            </text>

            <line x1={135} y1={615} x2={135} y2={647} stroke="#2563EB" strokeWidth={3} />
            <text x={127} y={631} textAnchor="middle" fill="#2563EB" fontSize={8} fontWeight="bold"
              transform="rotate(-90, 127, 631)">
              2ª LINEA
            </text>

            <line x1={135} y1={652} x2={135} y2={714} stroke="#65A30D" strokeWidth={3} />
            <text x={127} y={683} textAnchor="middle" fill="#65A30D" fontSize={8} fontWeight="bold"
              transform="rotate(-90, 127, 683)">
              3ª LINEA
            </text>

            {/* ── Line labels — RIGHT margin ── */}
            <line x1={716} y1={502} x2={716} y2={549} stroke="#2563EB" strokeWidth={3} />
            <text x={726} y={526} textAnchor="middle" fill="#2563EB" fontSize={8} fontWeight="bold"
              transform="rotate(90, 726, 526)">
              1ª LINEA
            </text>

            <line x1={716} y1={574} x2={716} y2={610} stroke="#2563EB" strokeWidth={3} />
            <text x={726} y={592} textAnchor="middle" fill="#2563EB" fontSize={8} fontWeight="bold"
              transform="rotate(90, 726, 592)">
              2ª LINEA
            </text>

            <line x1={716} y1={623} x2={716} y2={656} stroke="#65A30D" strokeWidth={3} />
            <text x={726} y={640} textAnchor="middle" fill="#65A30D" fontSize={8} fontWeight="bold"
              transform="rotate(90, 726, 640)">
              3ª LINEA
            </text>

            {/* ── Lot circles ── */}
            <g>
              {lots.map((lot) => (
                <LotCircle
                  key={lot.id}
                  lot={lot}
                  isSelected={selectedLot?.id === lot.id}
                  dimmed={hasActiveFilter && !matchesFilter(lot, activeFilters)}
                  onSelect={handleSelect}
                  onHoverStart={handleHoverStart}
                  onHoverEnd={handleHoverEnd}
                />
              ))}
            </g>

            {/* ── Amenity circles ── */}
            <g>
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

          </svg>

          {/* ── Hover tooltip ── */}
          {hoveredLot && hoveredLot.id !== selectedLot?.id && (() => {
            const pos = svgToPercent(hoveredLot.coords.cx, hoveredLot.coords.cy);
            return (
            <div
              className="absolute pointer-events-none z-30 transition-opacity duration-100"
              style={{
                left: pos.left,
                top: pos.top,
                transform: "translate(-50%, -120%)",
              }}
            >
              <div className="bg-neutral-900 text-white px-3 py-2 text-xs whitespace-nowrap">
                <div className="font-medium text-sm mb-0.5">Sitio {hoveredLot.id}</div>
                <div className="text-neutral-400">{hoveredLot.superficie.toLocaleString("es-CL")} m² · {hoveredLot.linea ?? "Otros"}</div>
                {hoveredLot.estado === "Disponible" && (
                  <div className="text-green-400 font-semibold">{hoveredLot.precio.toLocaleString("es-CL")} UF</div>
                )}
                {hoveredLot.estado !== "Disponible" && (
                  <div style={{ color: statusColors[hoveredLot.estado] }} className="font-semibold">{hoveredLot.estado}</div>
                )}
              </div>
              <div className="w-2 h-2 bg-neutral-900 rotate-45 mx-auto -mt-1" />
            </div>
            );
          })()}

          {/* ── Amenity hover tooltip ── */}
          {hoveredAmenity && hoveredAmenity.id !== selectedAmenity?.id && (() => {
            const pos = svgToPercent(hoveredAmenity.coords.cx, hoveredAmenity.coords.cy);
            return (
            <div
              className="absolute pointer-events-none z-30 transition-opacity duration-100"
              style={{
                left: pos.left,
                top: pos.top,
                transform: "translate(-50%, -120%)",
              }}
            >
              <div className="bg-neutral-900 text-white px-3 py-2 text-xs whitespace-nowrap">
                <div className="font-bold text-sm">{hoveredAmenity.nombre}</div>
              </div>
              <div className="w-2 h-2 bg-neutral-900 rotate-45 mx-auto -mt-1" />
            </div>
            );
          })()}
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
          <div className="border border-neutral-100 overflow-hidden">
            <div className="bg-neutral-900 px-5 py-6 text-white">
              <h2 className="text-sm font-semibold tracking-tight">
                Bienvenido a Mirador Alto Colbún
              </h2>
              <p className="text-xs text-neutral-400 mt-1">Explora los sitios disponibles en el plano interactivo</p>
            </div>

            <div className="p-5 space-y-5">
              <div className="space-y-4">
                <WelcomeStep number={1} title="Explora el plano" description="Pasa el cursor sobre los sitios numerados para ver un resumen con superficie, precio y estado." />
                <WelcomeStep number={2} title="Abre la ficha del sitio" description="Haz clic en un sitio para ver todos sus detalles, fotos y opciones de financiamiento." />
                <WelcomeStep number={3} title="Filtra lo que buscas" description="Usa los filtros para ver solo sitios disponibles, con casa construida o de uso comercial." />
                <WelcomeStep number={4} title="Consulta por WhatsApp" description="Desde la ficha de cada sitio puedes escribirnos directamente para agendar una visita." />
              </div>

              <div className="border border-neutral-100 p-4">
                <h3 className="text-[10px] font-medium uppercase tracking-wider text-neutral-400 mb-3">Colores del plano</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { color: "#16A34A", label: "Disponible" },
                    { color: "#C62828", label: "Vendido" },
                    { color: "#EAB308", label: "Promoción" },
                    { color: "#E65100", label: "Reservado" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-neutral-600">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-neutral-400 text-center">
                Haz clic en un sitio del plano para comenzar
              </p>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* ── Footer ── */}
    <footer className="flex-shrink-0 border-t border-neutral-100">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <div className="flex items-center gap-3">
          <a href="/admin" className="text-neutral-300 hover:text-neutral-500 transition-colors" aria-label="Admin">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><circle cx="12" cy="12" r="3" /></svg>
          </a>
          <span className="text-xs text-neutral-400">
            © {new Date().getFullYear()} Mirador Alto Colbún · Lago Colbún, Región del Maule
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://wa.me/56966298663" target="_blank" rel="noopener noreferrer" className="text-xs text-neutral-400 hover:text-neutral-900 transition-colors">
            +56 9 6629 8663
          </a>
          <div className="w-px h-3.5 bg-neutral-100" />
          <a href="https://wa.me/56966298663" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-neutral-900 transition-colors" aria-label="WhatsApp">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
          <a href="https://www.instagram.com/miradoraltocolbun" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-neutral-900 transition-colors" aria-label="Instagram">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
          <a href="https://miradoraltocolbun.cl" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-neutral-900 transition-colors" aria-label="Sitio web">
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
      <span className="flex-shrink-0 w-5 h-5 bg-neutral-900 text-white text-[9px] font-medium flex items-center justify-center mt-0.5">
        {number}
      </span>
      <div>
        <h3 className="text-xs font-medium text-neutral-900">{title}</h3>
        <p className="text-[11px] text-neutral-400 leading-relaxed mt-0.5">{description}</p>
      </div>
    </div>
  );
}
