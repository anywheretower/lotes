// ── Database row types (match Supabase columns) ─────────────────────

export type LotStatus = "Disponible" | "Vendido" | "Promesado" | "Reservado";
export type Linea = "1ª Línea" | "2ª Línea" | "3ª Línea";

export interface LotRow {
  id: number;
  superficie: number;
  estado: LotStatus;
  precio: number;
  linea: Linea | null;
  cx: number;
  cy: number;
  fotos: string[];
  forma_pago: string;
  oferta: string | null;
  tiene_casa: boolean;
  descripcion_casa: string | null;
  familia_propietaria: string | null;
  notas_generales: string | null;
  created_at: string;
  updated_at: string;
}

export interface AmenityRow {
  id: string;
  nombre: string;
  inicial: string;
  cx: number;
  cy: number;
  foto: string | null;
  notas: string | null;
  created_at: string;
  updated_at: string;
}

// ── App-level types (used by components) ────────────────────────────

export interface Lot {
  id: number;
  superficie: number;
  estado: LotStatus;
  precio: number;
  linea: Linea | null;
  coords: { cx: number; cy: number };
  fotos: string[];
  formaPago: string;
  oferta: string | null;
  tieneCasa: boolean;
  descripcionCasa: string | null;
  familiaPropietaria: string | null;
  notasGenerales: string | null;
}

export interface Amenity {
  id: string;
  nombre: string;
  inicial: string;
  coords: { cx: number; cy: number };
  foto: string | null;
  notas: string | null;
}

// ── Mappers ─────────────────────────────────────────────────────────

export function lotRowToLot(row: LotRow): Lot {
  return {
    id: row.id,
    superficie: row.superficie,
    estado: row.estado,
    precio: row.precio,
    linea: row.linea,
    coords: { cx: row.cx, cy: row.cy },
    fotos: row.fotos ?? [],
    formaPago: row.forma_pago,
    oferta: row.oferta,
    tieneCasa: row.tiene_casa,
    descripcionCasa: row.descripcion_casa,
    familiaPropietaria: row.familia_propietaria,
    notasGenerales: row.notas_generales,
  };
}

export function amenityRowToAmenity(row: AmenityRow): Amenity {
  return {
    id: row.id,
    nombre: row.nombre,
    inicial: row.inicial,
    coords: { cx: row.cx, cy: row.cy },
    foto: row.foto,
    notas: row.notas,
  };
}
