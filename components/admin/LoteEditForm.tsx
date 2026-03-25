"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LotRow, LotStatus, Linea } from "@/lib/types";
import ImageUploader from "./ImageUploader";

interface LoteEditFormProps {
  lote: LotRow;
}

const ESTADOS: LotStatus[] = ["Disponible", "Vendido", "Promoción", "Reservado"];
const LINEAS: (Linea | "")[] = ["", "1ª Línea", "2ª Línea", "3ª Línea"];

export default function LoteEditForm({ lote }: LoteEditFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showCoords, setShowCoords] = useState(false);

  const [estado, setEstado] = useState(lote.estado);
  const [superficie, setSuperficie] = useState(lote.superficie);
  const [precio, setPrecio] = useState(lote.precio);
  const [linea, setLinea] = useState(lote.linea ?? "");
  const [formaPago, setFormaPago] = useState(lote.forma_pago);
  const [oferta, setOferta] = useState(lote.oferta ?? "");
  const [tieneCasa, setTieneCasa] = useState(lote.tiene_casa);
  const [descripcionCasa, setDescripcionCasa] = useState(lote.descripcion_casa ?? "");
  const [familiaPropietaria, setFamiliaPropietaria] = useState(lote.familia_propietaria ?? "");
  const [notasGenerales, setNotasGenerales] = useState(lote.notas_generales ?? "");
  const [cx, setCx] = useState(lote.cx);
  const [cy, setCy] = useState(lote.cy);
  const [fotos, setFotos] = useState<string[]>(lote.fotos ?? []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch(`/api/admin/lotes/${lote.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estado,
          superficie,
          precio,
          linea: linea || null,
          forma_pago: formaPago,
          oferta: oferta || null,
          tiene_casa: tieneCasa,
          descripcion_casa: descripcionCasa || null,
          familia_propietaria: familiaPropietaria || null,
          notas_generales: notasGenerales || null,
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
      {/* General */}
      <Section title="General">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Estado">
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value as LotStatus)}
              className="w-full px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900"
            >
              {ESTADOS.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </Field>
          <Field label="Superficie (m²)">
            <input
              type="number"
              step="0.1"
              value={superficie}
              onChange={(e) => setSuperficie(Number(e.target.value))}
              className="w-full px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900"
            />
          </Field>
          <Field label="Precio (UF)">
            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(Number(e.target.value))}
              className="w-full px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900"
            />
          </Field>
          <Field label="Línea">
            <select
              value={linea}
              onChange={(e) => setLinea(e.target.value as Linea | "")}
              className="w-full px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900"
            >
              {LINEAS.map((l) => (
                <option key={l} value={l}>{l || "Sin línea"}</option>
              ))}
            </select>
          </Field>
        </div>
      </Section>

      {/* Comercial */}
      <Section title="Comercial">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Forma de pago">
            <input
              type="text"
              value={formaPago}
              onChange={(e) => setFormaPago(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900"
            />
          </Field>
          <Field label="Oferta">
            <input
              type="text"
              value={oferta}
              onChange={(e) => setOferta(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900"
              placeholder="Ej: 5% desc. pago contado"
            />
          </Field>
        </div>
      </Section>

      {/* Propiedad */}
      <Section title="Propiedad">
        <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={tieneCasa}
              onChange={(e) => setTieneCasa(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-neutral-700">Tiene casa</span>
          </label>
          <Field label="Descripción casa">
            <textarea
              value={descripcionCasa}
              onChange={(e) => setDescripcionCasa(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900 resize-none"
            />
          </Field>
          <Field label="Familia propietaria">
            <input
              type="text"
              value={familiaPropietaria}
              onChange={(e) => setFamiliaPropietaria(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900"
            />
          </Field>
          <Field label="Notas generales">
            <textarea
              value={notasGenerales}
              onChange={(e) => setNotasGenerales(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900 resize-none"
            />
          </Field>
        </div>
      </Section>

      {/* Fotos */}
      <Section title="Fotos">
        <ImageUploader
          images={fotos}
          entityType="lotes"
          entityId={lote.id}
          multiple
          onUploadComplete={setFotos}
        />
      </Section>

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
            <Field label="cx">
              <input
                type="number"
                step="0.1"
                value={cx}
                onChange={(e) => setCx(Number(e.target.value))}
                className="w-full px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900"
              />
            </Field>
            <Field label="cy">
              <input
                type="number"
                step="0.1"
                value={cy}
                onChange={(e) => setCy(Number(e.target.value))}
                className="w-full px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900"
              />
            </Field>
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
          href="/admin"
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-neutral-200 bg-white p-4">
      <h3 className="text-[10px] font-medium uppercase tracking-wider text-neutral-400 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-neutral-600 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
