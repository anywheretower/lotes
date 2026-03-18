"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AmenityRow } from "@/lib/types";
import ImageUploader from "./ImageUploader";

interface EquipamientoEditFormProps {
  item: AmenityRow;
}

export default function EquipamientoEditForm({ item }: EquipamientoEditFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showCoords, setShowCoords] = useState(false);

  const [nombre, setNombre] = useState(item.nombre);
  const [inicial, setInicial] = useState(item.inicial);
  const [notas, setNotas] = useState(item.notas ?? "");
  const [cx, setCx] = useState(item.cx);
  const [cy, setCy] = useState(item.cy);
  const [fotos, setFotos] = useState<string[]>(item.fotos ?? []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch(`/api/admin/equipamiento/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          inicial,
          notas: notas || null,
          cx,
          cy,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setMessage(data.error || "Error al guardar");
        return;
      }

      setMessage("Guardado correctamente");
      router.refresh();
    } catch {
      setMessage("Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border border-neutral-200 bg-white p-4">
        <h3 className="text-[10px] font-medium uppercase tracking-wider text-neutral-400 mb-4">Información</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1.5">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1.5">Inicial</label>
              <input
                type="text"
                value={inicial}
                onChange={(e) => setInicial(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900"
                required
                maxLength={3}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1.5">Notas</label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Foto */}
      <div className="border border-neutral-200 bg-white p-4">
        <h3 className="text-[10px] font-medium uppercase tracking-wider text-neutral-400 mb-4">Fotos</h3>
        <ImageUploader
          images={fotos}
          entityType="equipamiento"
          entityId={item.id}
          multiple
          onUploadComplete={setFotos}
        />
      </div>

      {/* Coordenadas (colapsable) */}
      <div className="border border-neutral-200 bg-white">
        <button
          type="button"
          onClick={() => setShowCoords(!showCoords)}
          className="w-full px-4 py-3 flex items-center justify-between text-xs font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
        >
          Coordenadas SVG
          <span className="text-neutral-400">{showCoords ? "▲" : "▼"}</span>
        </button>
        {showCoords && (
          <div className="px-4 pb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1.5">cx</label>
              <input
                type="number"
                step="0.1"
                value={cx}
                onChange={(e) => setCx(Number(e.target.value))}
                className="w-full px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1.5">cy</label>
              <input
                type="number"
                step="0.1"
                value={cy}
                onChange={(e) => setCy(Number(e.target.value))}
                className="w-full px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-neutral-900 text-white px-6 py-2 text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar"}
        </button>
        <a
          href="/admin/equipamiento"
          className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          Volver
        </a>
        {message && (
          <span className={`text-xs ${message.includes("Error") ? "text-red-600" : "text-green-600"}`}>
            {message}
          </span>
        )}
      </div>
    </form>
  );
}
