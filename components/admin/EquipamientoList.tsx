"use client";

import type { AmenityRow } from "@/lib/types";

interface EquipamientoListProps {
  items: AmenityRow[];
}

export default function EquipamientoList({ items }: EquipamientoListProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {items.map((item) => (
        <a
          key={item.id}
          href={`/admin/equipamiento/${item.id}`}
          className="bg-white border border-neutral-200 p-4 hover:border-neutral-400 transition-colors group"
        >
          {item.foto ? (
            <img
              src={item.foto}
              alt={item.nombre}
              className="w-full h-24 object-cover mb-3"
            />
          ) : (
            <div className="w-full h-24 bg-neutral-100 flex items-center justify-center mb-3">
              <span className="text-2xl font-bold text-sky-400">{item.inicial}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="inline-block px-1.5 py-0.5 bg-sky-100 text-sky-600 text-[10px] font-semibold">
              {item.inicial}
            </span>
            <span className="text-xs font-medium text-neutral-900 group-hover:text-neutral-600 transition-colors truncate">
              {item.nombre}
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}
