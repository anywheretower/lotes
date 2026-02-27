"use client";

import { useState } from "react";
import type { LotRow } from "@/lib/types";
import { statusColors } from "@/lib/constants";

interface LotesTableProps {
  lotes: LotRow[];
}

type SortField = "id" | "estado" | "superficie" | "precio" | "linea";
type SortDir = "asc" | "desc";

export default function LotesTable({ lotes }: LotesTableProps) {
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sorted = [...lotes].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    if (sortField === "id") return (a.id - b.id) * dir;
    if (sortField === "superficie") return (a.superficie - b.superficie) * dir;
    if (sortField === "precio") return (a.precio - b.precio) * dir;
    if (sortField === "estado") return a.estado.localeCompare(b.estado) * dir;
    if (sortField === "linea") return (a.linea ?? "zzz").localeCompare(b.linea ?? "zzz") * dir;
    return 0;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="text-neutral-300 ml-1">↕</span>;
    return <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <div className="bg-white border border-neutral-200 overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50">
            <th className="text-left px-3 py-2.5 font-medium text-neutral-600 cursor-pointer select-none" onClick={() => toggleSort("id")}>
              # <SortIcon field="id" />
            </th>
            <th className="text-left px-3 py-2.5 font-medium text-neutral-600 cursor-pointer select-none" onClick={() => toggleSort("estado")}>
              Estado <SortIcon field="estado" />
            </th>
            <th className="text-left px-3 py-2.5 font-medium text-neutral-600 cursor-pointer select-none" onClick={() => toggleSort("superficie")}>
              Superficie <SortIcon field="superficie" />
            </th>
            <th className="text-left px-3 py-2.5 font-medium text-neutral-600 cursor-pointer select-none" onClick={() => toggleSort("precio")}>
              Precio <SortIcon field="precio" />
            </th>
            <th className="text-left px-3 py-2.5 font-medium text-neutral-600 cursor-pointer select-none" onClick={() => toggleSort("linea")}>
              Línea <SortIcon field="linea" />
            </th>
            <th className="text-left px-3 py-2.5 font-medium text-neutral-600">Casa</th>
            <th className="text-left px-3 py-2.5 font-medium text-neutral-600">Propietario</th>
            <th className="text-right px-3 py-2.5 font-medium text-neutral-600">Fotos</th>
            <th className="px-3 py-2.5"></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((lot) => (
            <tr key={lot.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
              <td className="px-3 py-2.5 font-semibold text-neutral-900">{lot.id}</td>
              <td className="px-3 py-2.5">
                <span
                  className="inline-block px-2 py-0.5 text-white text-[10px] font-medium"
                  style={{ backgroundColor: statusColors[lot.estado] }}
                >
                  {lot.estado}
                </span>
              </td>
              <td className="px-3 py-2.5 text-neutral-600">{lot.superficie.toLocaleString("es-CL")} m²</td>
              <td className="px-3 py-2.5 text-neutral-600">{lot.precio.toLocaleString("es-CL")} UF</td>
              <td className="px-3 py-2.5 text-neutral-600">{lot.linea ?? "—"}</td>
              <td className="px-3 py-2.5 text-neutral-600">{lot.tiene_casa ? "Sí" : "No"}</td>
              <td className="px-3 py-2.5 text-neutral-600 max-w-[120px] truncate">{lot.familia_propietaria ?? "—"}</td>
              <td className="px-3 py-2.5 text-neutral-400 text-right">{lot.fotos?.length || 0}</td>
              <td className="px-3 py-2.5 text-right">
                <a
                  href={`/admin/lotes/${lot.id}`}
                  className="text-xs text-neutral-500 hover:text-neutral-900 font-medium transition-colors"
                >
                  Editar
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
