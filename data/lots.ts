export type LotStatus = "Disponible" | "Vendido" | "Promesado" | "Reservado";

export type Linea = "1ª Línea" | "2ª Línea" | "3ª Línea";

export interface Lot {
  id: number;
  superficie: number; // m²
  estado: LotStatus;
  precio: number; // UF (solo se muestra para Disponible)
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

// ── SVG overlay (viewBox 850×1100, matches plano-base.png 5100×6600) ──
// Calibrated from 10 reference clicks on 2026-02-14

// Row Y centers (from click calibration)
const Y_A = 527; // RIGHT 1ª línea only (71-76)
const Y_B = 590; // LEFT 1ª (35-40)  + RIGHT 2ª (65-70)
const Y_C = 633; // LEFT 2ª (29-34)  + RIGHT 3ª r1 (59-64)
const Y_D = 698; // LEFT 3ª r1 (22-28) + RIGHT 3ª r2 (53-58)
const Y_E = 734; // LEFT 3ª r2 (16-21) + RIGHT 3ª r3 (47-52)
const Y_F = 770; // LEFT 3ª r3 (lot 15 solo)
const Y_G = 806; // LEFT 3ª r4 (8-14) + RIGHT 3ª r4 (41-46)
const Y_H = 864; // LEFT 3ª r5 (1-7) only

// Left block — 6-column centers (lot40→lot35: 190→400, spacing ≈42)
const L6cx = [190, 232, 274, 316, 358, 400];

// Left block — 7-column centers (lot7→lot1: 185→404, spacing ≈37)
const L7cx = [185, 222, 258, 295, 331, 368, 404];

// Right block — 6-column centers (lot76/41→…: 465→645, spacing =36)
const R6cx = [465, 501, 537, 573, 609, 645];

// ── Línea assignment ───────────────────────────────────────────────
function getLinea(id: number): Linea | null {
  if ((id >= 35 && id <= 40) || (id >= 71 && id <= 76)) return "1ª Línea";
  if ((id >= 29 && id <= 34) || (id >= 65 && id <= 70)) return "2ª Línea";
  if ((id >= 22 && id <= 28) || (id >= 59 && id <= 64)) return "3ª Línea";
  return null;
}

// ── Explicit lot positions (cx, cy) ────────────────────────────────
const lotPositions: Record<number, { cx: number; cy: number }> = {
  // ═══ LEFT BLOCK ═══════════════════════════════════════════════════

  // Row B — 1ª Línea: 40, 39, 38, 37, 36, 35
  40: { cx: L6cx[0], cy: Y_B },
  39: { cx: L6cx[1], cy: Y_B },
  38: { cx: L6cx[2], cy: Y_B },
  37: { cx: L6cx[3], cy: Y_B },
  36: { cx: L6cx[4], cy: Y_B },
  35: { cx: L6cx[5], cy: Y_B },

  // Row C — 2ª Línea: 29, 30, 31, 32, 33, 34
  29: { cx: 199, cy: 629 },
  30: { cx: L6cx[1], cy: Y_C },
  31: { cx: L6cx[2], cy: Y_C },
  32: { cx: L6cx[3], cy: Y_C },
  33: { cx: L6cx[4], cy: Y_C },
  34: { cx: L6cx[5], cy: Y_C },

  // Row D — 3ª Línea: 28*, 27, 26, 25, 24, 23, 22
  28: { cx: 178, cy: 666 },
  27: { cx: 192, cy: 700 },
  26: { cx: 238, cy: 695 },
  25: { cx: 276, cy: 697 },
  24: { cx: 316, cy: 697 },
  23: { cx: 361, cy: 697 },
  22: { cx: 402, cy: 695 },

  // Row E — 3ª Línea: 16, 17, 18, 19, 20, 21
  16: { cx: 199, cy: 735 },
  17: { cx: 239, cy: 739 },
  18: { cx: 278, cy: 741 },
  19: { cx: 321, cy: 738 },
  20: { cx: 360, cy: 738 },
  21: { cx: 403, cy: 741 },

  // Row F — 3ª Línea: 15* (esquina grande, solo)
  15: { cx: 175, cy: 769 },

  // Row G — 3ª Línea: 14*, 13, 12, 11, 10, 9, 8
  14: { cx: 182, cy: 816 },
  13: { cx: 225, cy: 809 },
  12: { cx: 263, cy: 807 },
  11: { cx: L7cx[3], cy: Y_G },
  10: { cx: L7cx[4], cy: Y_G },
   9: { cx: L7cx[5], cy: Y_G },
   8: { cx: L7cx[6], cy: Y_G },

  // Row H — 3ª Línea: 7*, 6, 5, 4, 3, 2, 1
   7: { cx: L7cx[0], cy: Y_H },
   6: { cx: 227, cy: 851 },
   5: { cx: 262, cy: 852 },
   4: { cx: 296, cy: 852 },
   3: { cx: 334, cy: 851 },
   2: { cx: 369, cy: 853 },
   1: { cx: 403, cy: 853 },

  // ═══ RIGHT BLOCK ═════════════════════════════════════════════════

  // Row A — 1ª Línea: 76, 75, 74, 73, _gap_, 72, 71 (individual calibration)
  76: { cx: 465, cy: 535 },
  75: { cx: 518, cy: 535 },
  74: { cx: 562, cy: 532 },
  73: { cx: 600, cy: 526 },
  72: { cx: 633, cy: 520 },
  71: { cx: 669, cy: 516 },

  // Row B — 2ª Línea: 65, 66, 67, 68, 69, 70 (individual calibration)
  65: { cx: 468, cy: 596 },
  66: { cx: 513, cy: 596 },
  67: { cx: 556, cy: 596 },
  68: { cx: 595, cy: 596 },
  69: { cx: 634, cy: 595 },
  70: { cx: 676, cy: 588 },

  // Row C — 3ª Línea: 64, 63, 62, 61, 60, 59 (individual calibration)
  64: { cx: 465, cy: 638 },
  63: { cx: 503, cy: 637 },
  62: { cx: 545, cy: 638 },
  61: { cx: 588, cy: 641 },
  60: { cx: 629, cy: 639 },
  59: { cx: 675, cy: 642 },

  // Row D — 3ª Línea: 53, 54, 55, 56, 57, 58 (individual calibration)
  53: { cx: 465, cy: 701 },
  54: { cx: 506, cy: 701 },
  55: { cx: 545, cy: 702 },
  56: { cx: 589, cy: 701 },
  57: { cx: 628, cy: 702 },
  58: { cx: 673, cy: 698 },

  // Row E — 3ª Línea: 52, 51, 50, 49, 48, 47 (individual calibration)
  52: { cx: 463, cy: 744 },
  51: { cx: 504, cy: 746 },
  50: { cx: 545, cy: 745 },
  49: { cx: 588, cy: 745 },
  48: { cx: 627, cy: 745 },
  47: { cx: 672, cy: 750 },

  // Row G — 3ª Línea: 41, 42, 43, 44, 45, 46* (individual calibration)
  41: { cx: 467, cy: 809 },
  42: { cx: 498, cy: 811 },
  43: { cx: 531, cy: 812 },
  44: { cx: 565, cy: 813 },
  45: { cx: 599, cy: 812 },
  46: { cx: 645, cy: 800 },
};

// ── Extra fields data ──────────────────────────────────────────────

const familias: Record<number, string> = {
  8: "Familia González", 16: "Familia Muñoz", 22: "Familia Soto",
  23: "Familia Rojas", 24: "Familia Díaz", 25: "Familia Pérez",
  26: "Familia Silva", 28: "Familia Martínez", 29: "Familia López",
  30: "Familia Hernández", 31: "Familia Torres", 32: "Familia Vargas",
  34: "Familia Ramírez", 35: "Familia Flores", 37: "Familia Castro",
  38: "Familia Morales", 39: "Familia Figueroa", 40: "Familia Contreras",
  51: "Familia Reyes", 52: "Familia Gutiérrez", 53: "Familia Araya",
  54: "Familia Bravo", 55: "Familia Espinoza", 60: "Familia Fuentes",
  61: "Familia Valenzuela", 62: "Familia Tapia", 63: "Familia Olivares",
  64: "Familia Campos", 65: "Familia Núñez", 66: "Familia Sandoval",
  67: "Familia Pizarro", 68: "Familia Vera", 69: "Familia Riquelme",
  71: "Familia Lagos", 72: "Familia Bustos", 73: "Familia Carrasco",
  74: "Familia Avendaño",
};

const casasSet = new Set([22, 25, 29, 35, 38, 51, 62, 66, 71, 73]);

function buildLot(base: { id: number; superficie: number; estado: LotStatus; precio: number }): Lot {
  const isVendido = base.estado === "Vendido";
  const isDisponible = base.estado === "Disponible";
  return {
    ...base,
    linea: getLinea(base.id),
    coords: lotPositions[base.id],
    fotos: ["/placeholder-lote.jpg"],
    formaPago: isVendido
      ? "Pagado"
      : "Contado · Crédito hipotecario · 36 cuotas",
    oferta: isDisponible ? "5% desc. pago contado" : null,
    tieneCasa: casasSet.has(base.id),
    descripcionCasa: "Por definir",
    familiaPropietaria: isVendido ? (familias[base.id] ?? null) : null,
    notasGenerales: "Por definir",
  };
}

export const lots: Lot[] = [
  buildLot({ id: 1,  superficie: 1520.0, estado: "Disponible", precio: 1990 }),
  buildLot({ id: 2,  superficie: 1520.0, estado: "Disponible", precio: 1990 }),
  buildLot({ id: 3,  superficie: 1520.0, estado: "Disponible", precio: 1990 }),
  buildLot({ id: 4,  superficie: 1520.0, estado: "Disponible", precio: 1990 }),
  buildLot({ id: 5,  superficie: 1520.0, estado: "Disponible", precio: 1990 }),
  buildLot({ id: 6,  superficie: 1567.0, estado: "Disponible", precio: 1990 }),
  buildLot({ id: 7,  superficie: 2241.8, estado: "Disponible", precio: 1990 }),
  buildLot({ id: 8,  superficie: 1520.0, estado: "Vendido",    precio: 1990 }),
  buildLot({ id: 9,  superficie: 1520.0, estado: "Disponible", precio: 1990 }),
  buildLot({ id: 10, superficie: 1520.0, estado: "Disponible", precio: 1990 }),
  buildLot({ id: 11, superficie: 1551.0, estado: "Promesado",  precio: 1873 }),
  buildLot({ id: 12, superficie: 1584.0, estado: "Disponible", precio: 1990 }),
  buildLot({ id: 13, superficie: 1541.0, estado: "Disponible", precio: 1990 }),
  buildLot({ id: 14, superficie: 2034.9, estado: "Disponible", precio: 1990 }),
  buildLot({ id: 15, superficie: 1555.0, estado: "Disponible", precio: 1990 }),
  buildLot({ id: 16, superficie: 1510.3, estado: "Vendido",    precio: 1990 }),
  buildLot({ id: 17, superficie: 1522.8, estado: "Disponible", precio: 1990 }),
  buildLot({ id: 18, superficie: 1503.6, estado: "Disponible", precio: 1990 }),
  buildLot({ id: 19, superficie: 1500.0, estado: "Disponible", precio: 1990 }),
  buildLot({ id: 20, superficie: 1500.0, estado: "Disponible", precio: 1990 }),
  buildLot({ id: 21, superficie: 1500.0, estado: "Promesado",  precio: 1990 }),
  buildLot({ id: 22, superficie: 1500.0, estado: "Vendido",    precio: 1990 }),
  buildLot({ id: 23, superficie: 1500.0, estado: "Vendido",    precio: 1990 }),
  buildLot({ id: 24, superficie: 1500.0, estado: "Vendido",    precio: 1990 }),
  buildLot({ id: 25, superficie: 1503.6, estado: "Vendido",    precio: 1685 }),
  buildLot({ id: 26, superficie: 1501.8, estado: "Vendido",    precio: 1592 }),
  buildLot({ id: 27, superficie: 1500.0, estado: "Disponible", precio: 1990 }),
  buildLot({ id: 28, superficie: 1505.4, estado: "Vendido",    precio: 1464 }),
  buildLot({ id: 29, superficie: 1502.5, estado: "Vendido",    precio: 1971 }),
  buildLot({ id: 30, superficie: 1501.8, estado: "Vendido",    precio: 1862 }),
  buildLot({ id: 31, superficie: 1503.6, estado: "Vendido",    precio: 2290 }),
  buildLot({ id: 32, superficie: 1500.0, estado: "Vendido",    precio: 2290 }),
  buildLot({ id: 33, superficie: 1500.0, estado: "Disponible", precio: 2290 }),
  buildLot({ id: 34, superficie: 1500.0, estado: "Vendido",    precio: 2290 }),
  buildLot({ id: 35, superficie: 1500.0, estado: "Vendido",    precio: 1960 }),
  buildLot({ id: 36, superficie: 1501.8, estado: "Disponible", precio: 1592 }),
  buildLot({ id: 37, superficie: 1500.0, estado: "Vendido",    precio: 1912 }),
  buildLot({ id: 38, superficie: 1501.0, estado: "Vendido",    precio: 2122 }),
  buildLot({ id: 39, superficie: 1525.8, estado: "Vendido",    precio: 1912 }),
  buildLot({ id: 40, superficie: 1852.0, estado: "Vendido",    precio: 1852 }),
  buildLot({ id: 41, superficie: 1500.0, estado: "Disponible", precio: 1990 }),
  buildLot({ id: 42, superficie: 1500.0, estado: "Disponible", precio: 1990 }),
  buildLot({ id: 43, superficie: 1500.0, estado: "Disponible", precio: 1990 }),
  buildLot({ id: 44, superficie: 1529.0, estado: "Disponible", precio: 1990 }),
  buildLot({ id: 45, superficie: 1560.0, estado: "Disponible", precio: 1990 }),
  buildLot({ id: 46, superficie: 2518.1, estado: "Disponible", precio: 1990 }),
  buildLot({ id: 47, superficie: 1760.7, estado: "Disponible", precio: 1990 }),
  buildLot({ id: 48, superficie: 1503.0, estado: "Disponible", precio: 1990 }),
  buildLot({ id: 49, superficie: 1575.3, estado: "Disponible", precio: 1990 }),
  buildLot({ id: 50, superficie: 1500.0, estado: "Disponible", precio: 1990 }),
  buildLot({ id: 51, superficie: 1500.0, estado: "Vendido",    precio: 1891 }),
  buildLot({ id: 52, superficie: 1500.0, estado: "Vendido",    precio: 1788 }),
  buildLot({ id: 53, superficie: 1500.0, estado: "Vendido",    precio: 1990 }),
  buildLot({ id: 54, superficie: 1500.0, estado: "Vendido",    precio: 1990 }),
  buildLot({ id: 55, superficie: 1500.0, estado: "Vendido",    precio: 1990 }),
  buildLot({ id: 56, superficie: 1575.5, estado: "Disponible", precio: 1990 }),
  buildLot({ id: 57, superficie: 1503.0, estado: "Disponible", precio: 1990 }),
  buildLot({ id: 58, superficie: 1731.4, estado: "Disponible", precio: 1990 }),
  buildLot({ id: 59, superficie: 1701.0, estado: "Disponible", precio: 1990 }),
  buildLot({ id: 60, superficie: 1502.8, estado: "Vendido",    precio: 1990 }),
  buildLot({ id: 61, superficie: 1575.5, estado: "Vendido",    precio: 2090 }),
  buildLot({ id: 62, superficie: 1500.0, estado: "Vendido",    precio: 1990 }),
  buildLot({ id: 63, superficie: 1500.0, estado: "Vendido",    precio: 1990 }),
  buildLot({ id: 64, superficie: 1500.0, estado: "Vendido",    precio: 1791 }),
  buildLot({ id: 65, superficie: 1500.0, estado: "Vendido",    precio: 1791 }),
  buildLot({ id: 66, superficie: 1500.0, estado: "Vendido",    precio: 2290 }),
  buildLot({ id: 67, superficie: 1500.0, estado: "Vendido",    precio: 1650 }),
  buildLot({ id: 68, superficie: 1500.0, estado: "Vendido",    precio: 1567 }),
  buildLot({ id: 69, superficie: 1534.7, estado: "Vendido",    precio: 1356 }),
  buildLot({ id: 70, superficie: 1705.2, estado: "Disponible", precio: 2190 }),
  buildLot({ id: 71, superficie: 1747.8, estado: "Vendido",    precio: 2390 }),
  buildLot({ id: 72, superficie: 1538.4, estado: "Vendido",    precio: 1955 }),
  buildLot({ id: 73, superficie: 1477.3, estado: "Vendido",    precio: 1955 }),
  buildLot({ id: 74, superficie: 1505.7, estado: "Vendido",    precio: 1955 }),
  buildLot({ id: 75, superficie: 1523.9, estado: "Disponible", precio: 2490 }),
  buildLot({ id: 76, superficie: 1500.0, estado: "Disponible", precio: 2490 }),
];

export const statusColors: Record<LotStatus, string> = {
  Disponible: "#16A34A",
  Vendido:    "#C62828",
  Promesado:  "#E65100",
  Reservado:  "#1565C0",
};

export const statusLabels: Record<LotStatus, string> = {
  Disponible: "Disponible",
  Vendido:    "Vendido",
  Promesado:  "Promesado",
  Reservado:  "Reservado",
};
