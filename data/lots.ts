export type LotStatus = "Disponible" | "Vendido" | "Promesado" | "Reservado";

export type Linea = "1ª Línea" | "2ª Línea" | "3ª Línea";

export interface Lot {
  id: number;
  superficie: number; // m²
  estado: LotStatus;
  precio: number; // UF (solo se muestra para Disponible)
  linea: Linea;
  coords: { x: number; y: number; w: number; h: number };
}

// ── SVG grid (viewBox 1200×780) ────────────────────────────────────
// Right block starts one row HIGHER than left block (matches real plan)
const H = 58; // lot height

// Y positions — 8 rows total, 72px apart (58 lot + 14 street)
const Y_A = 120; // RIGHT 1ª línea only (71-76)
const Y_B = 192; // LEFT 1ª (35-40)  + RIGHT 2ª (65-70)
const Y_C = 264; // LEFT 2ª (29-34)  + RIGHT 3ª row1 (59-64)
const Y_D = 336; // LEFT 3ª r1 (22-28) + RIGHT 3ª r2 (53-58)
const Y_E = 408; // LEFT 3ª r2 (16-21) + RIGHT 3ª r3 (47-52)
const Y_F = 480; // LEFT 3ª r3 (lot 15 solo)
const Y_G = 552; // LEFT 3ª r4 (8-14) + RIGHT 3ª r4 (41-46)
const Y_H = 624; // LEFT 3ª r5 (1-7) only

// Left block: 7-column layout [corner, col1…col6]
const L7 = [65, 148, 211, 274, 337, 400, 463];
const LCW = 78;  // corner lot width (lots 7, 14, 15, 28)
const LW  = 58;  // standard left lot width

// Left block: 6-column layout (cols 1-6 of L7)
const L6 = [148, 211, 274, 337, 400, 463];

// Right block: 6-column standard layout
const R6 = [580, 659, 738, 817, 896, 975];
const RW = 73; // standard right lot width

// ── Línea assignment ───────────────────────────────────────────────
function getLinea(id: number): Linea {
  if ((id >= 35 && id <= 40) || (id >= 71 && id <= 76)) return "1ª Línea";
  if ((id >= 29 && id <= 34) || (id >= 65 && id <= 70)) return "2ª Línea";
  return "3ª Línea";
}

// ── Explicit lot positions ─────────────────────────────────────────
const lotPositions: Record<number, { x: number; y: number; w: number; h: number }> = {
  // ═══ LEFT BLOCK ═══════════════════════════════════════════════════

  // Row B — 1ª Línea: 40, 39, 38, 37, 36, 35
  40: { x: L6[0], y: Y_B, w: LW, h: H },
  39: { x: L6[1], y: Y_B, w: LW, h: H },
  38: { x: L6[2], y: Y_B, w: LW, h: H },
  37: { x: L6[3], y: Y_B, w: LW, h: H },
  36: { x: L6[4], y: Y_B, w: LW, h: H },
  35: { x: L6[5], y: Y_B, w: LW, h: H },

  // Row C — 2ª Línea: 29, 30, 31, 32, 33, 34
  29: { x: L6[0], y: Y_C, w: LW, h: H },
  30: { x: L6[1], y: Y_C, w: LW, h: H },
  31: { x: L6[2], y: Y_C, w: LW, h: H },
  32: { x: L6[3], y: Y_C, w: LW, h: H },
  33: { x: L6[4], y: Y_C, w: LW, h: H },
  34: { x: L6[5], y: Y_C, w: LW, h: H },

  // Row D — 3ª Línea: 28*, 27, 26, 25, 24, 23, 22
  28: { x: L7[0], y: Y_D, w: LCW, h: H },
  27: { x: L7[1], y: Y_D, w: LW,  h: H },
  26: { x: L7[2], y: Y_D, w: LW,  h: H },
  25: { x: L7[3], y: Y_D, w: LW,  h: H },
  24: { x: L7[4], y: Y_D, w: LW,  h: H },
  23: { x: L7[5], y: Y_D, w: LW,  h: H },
  22: { x: L7[6], y: Y_D, w: LW,  h: H },

  // Row E — 3ª Línea: 16, 17, 18, 19, 20, 21
  16: { x: L6[0], y: Y_E, w: LW, h: H },
  17: { x: L6[1], y: Y_E, w: LW, h: H },
  18: { x: L6[2], y: Y_E, w: LW, h: H },
  19: { x: L6[3], y: Y_E, w: LW, h: H },
  20: { x: L6[4], y: Y_E, w: LW, h: H },
  21: { x: L6[5], y: Y_E, w: LW, h: H },

  // Row F — 3ª Línea: 15* (esquina grande, solo)
  15: { x: 65, y: Y_F, w: 140, h: H },

  // Row G — 3ª Línea: 14*, 13, 12, 11, 10, 9, 8
  14: { x: L7[0], y: Y_G, w: LCW, h: H },
  13: { x: L7[1], y: Y_G, w: LW,  h: H },
  12: { x: L7[2], y: Y_G, w: LW,  h: H },
  11: { x: L7[3], y: Y_G, w: LW,  h: H },
  10: { x: L7[4], y: Y_G, w: LW,  h: H },
   9: { x: L7[5], y: Y_G, w: LW,  h: H },
   8: { x: L7[6], y: Y_G, w: LW,  h: H },

  // Row H — 3ª Línea: 7*, 6, 5, 4, 3, 2, 1
   7: { x: L7[0], y: Y_H, w: LCW, h: H },
   6: { x: L7[1], y: Y_H, w: LW,  h: H },
   5: { x: L7[2], y: Y_H, w: LW,  h: H },
   4: { x: L7[3], y: Y_H, w: LW,  h: H },
   3: { x: L7[4], y: Y_H, w: LW,  h: H },
   2: { x: L7[5], y: Y_H, w: LW,  h: H },
   1: { x: L7[6], y: Y_H, w: LW,  h: H },

  // ═══ RIGHT BLOCK ═════════════════════════════════════════════════

  // Row A — 1ª Línea: 76, 75, 74, 73, _gap_, 72, 71
  76: { x: R6[0], y: Y_A, w: RW, h: H },
  75: { x: R6[1], y: Y_A, w: RW, h: H },
  74: { x: R6[2], y: Y_A, w: RW, h: H },
  73: { x: R6[3], y: Y_A, w: RW, h: H },
  // gap at col4 position
  72: { x: 950,   y: Y_A, w: RW, h: H },
  71: { x: 1030,  y: Y_A, w: RW, h: H },

  // Row B — 2ª Línea: 65, 66, 67, 68, 69, 70
  65: { x: R6[0], y: Y_B, w: RW, h: H },
  66: { x: R6[1], y: Y_B, w: RW, h: H },
  67: { x: R6[2], y: Y_B, w: RW, h: H },
  68: { x: R6[3], y: Y_B, w: RW, h: H },
  69: { x: R6[4], y: Y_B, w: RW, h: H },
  70: { x: R6[5], y: Y_B, w: RW, h: H },

  // Row C — 3ª Línea: 64, 63, 62, 61, 60, 59
  64: { x: R6[0], y: Y_C, w: RW, h: H },
  63: { x: R6[1], y: Y_C, w: RW, h: H },
  62: { x: R6[2], y: Y_C, w: RW, h: H },
  61: { x: R6[3], y: Y_C, w: RW, h: H },
  60: { x: R6[4], y: Y_C, w: RW, h: H },
  59: { x: R6[5], y: Y_C, w: RW, h: H },

  // Row D — 3ª Línea: 53, 54, 55, 56, 57, 58
  53: { x: R6[0], y: Y_D, w: RW, h: H },
  54: { x: R6[1], y: Y_D, w: RW, h: H },
  55: { x: R6[2], y: Y_D, w: RW, h: H },
  56: { x: R6[3], y: Y_D, w: RW, h: H },
  57: { x: R6[4], y: Y_D, w: RW, h: H },
  58: { x: R6[5], y: Y_D, w: RW, h: H },

  // Row E — 3ª Línea: 52, 51, 50, 49, 48, 47
  52: { x: R6[0], y: Y_E, w: RW, h: H },
  51: { x: R6[1], y: Y_E, w: RW, h: H },
  50: { x: R6[2], y: Y_E, w: RW, h: H },
  49: { x: R6[3], y: Y_E, w: RW, h: H },
  48: { x: R6[4], y: Y_E, w: RW, h: H },
  47: { x: R6[5], y: Y_E, w: RW, h: H },

  // Row G — 3ª Línea: 41, 42, 43, 44, 45, _gap_, 46*
  41: { x: R6[0], y: Y_G, w: RW, h: H },
  42: { x: R6[1], y: Y_G, w: RW, h: H },
  43: { x: R6[2], y: Y_G, w: RW, h: H },
  44: { x: R6[3], y: Y_G, w: RW, h: H },
  45: { x: R6[4], y: Y_G, w: RW, h: H },
  // gap
  46: { x: 1010,  y: Y_G, w: 93, h: H }, // corner lot, wider
};

export const lots: Lot[] = [
  { id: 1,  superficie: 1520.0, estado: "Disponible", precio: 1990, linea: getLinea(1),  coords: lotPositions[1] },
  { id: 2,  superficie: 1520.0, estado: "Disponible", precio: 1990, linea: getLinea(2),  coords: lotPositions[2] },
  { id: 3,  superficie: 1520.0, estado: "Disponible", precio: 1990, linea: getLinea(3),  coords: lotPositions[3] },
  { id: 4,  superficie: 1520.0, estado: "Disponible", precio: 1990, linea: getLinea(4),  coords: lotPositions[4] },
  { id: 5,  superficie: 1520.0, estado: "Disponible", precio: 1990, linea: getLinea(5),  coords: lotPositions[5] },
  { id: 6,  superficie: 1567.0, estado: "Disponible", precio: 1990, linea: getLinea(6),  coords: lotPositions[6] },
  { id: 7,  superficie: 2241.8, estado: "Disponible", precio: 1990, linea: getLinea(7),  coords: lotPositions[7] },
  { id: 8,  superficie: 1520.0, estado: "Vendido",    precio: 1990, linea: getLinea(8),  coords: lotPositions[8] },
  { id: 9,  superficie: 1520.0, estado: "Disponible", precio: 1990, linea: getLinea(9),  coords: lotPositions[9] },
  { id: 10, superficie: 1520.0, estado: "Disponible", precio: 1990, linea: getLinea(10), coords: lotPositions[10] },
  { id: 11, superficie: 1551.0, estado: "Promesado",  precio: 1873, linea: getLinea(11), coords: lotPositions[11] },
  { id: 12, superficie: 1584.0, estado: "Disponible", precio: 1990, linea: getLinea(12), coords: lotPositions[12] },
  { id: 13, superficie: 1541.0, estado: "Disponible", precio: 1990, linea: getLinea(13), coords: lotPositions[13] },
  { id: 14, superficie: 2034.9, estado: "Disponible", precio: 1990, linea: getLinea(14), coords: lotPositions[14] },
  { id: 15, superficie: 1555.0, estado: "Disponible", precio: 1990, linea: getLinea(15), coords: lotPositions[15] },
  { id: 16, superficie: 1510.3, estado: "Vendido",    precio: 1990, linea: getLinea(16), coords: lotPositions[16] },
  { id: 17, superficie: 1522.8, estado: "Disponible", precio: 1990, linea: getLinea(17), coords: lotPositions[17] },
  { id: 18, superficie: 1503.6, estado: "Disponible", precio: 1990, linea: getLinea(18), coords: lotPositions[18] },
  { id: 19, superficie: 1500.0, estado: "Disponible", precio: 1990, linea: getLinea(19), coords: lotPositions[19] },
  { id: 20, superficie: 1500.0, estado: "Disponible", precio: 1990, linea: getLinea(20), coords: lotPositions[20] },
  { id: 21, superficie: 1500.0, estado: "Promesado",  precio: 1990, linea: getLinea(21), coords: lotPositions[21] },
  { id: 22, superficie: 1500.0, estado: "Vendido",    precio: 1990, linea: getLinea(22), coords: lotPositions[22] },
  { id: 23, superficie: 1500.0, estado: "Vendido",    precio: 1990, linea: getLinea(23), coords: lotPositions[23] },
  { id: 24, superficie: 1500.0, estado: "Vendido",    precio: 1990, linea: getLinea(24), coords: lotPositions[24] },
  { id: 25, superficie: 1503.6, estado: "Vendido",    precio: 1685, linea: getLinea(25), coords: lotPositions[25] },
  { id: 26, superficie: 1501.8, estado: "Vendido",    precio: 1592, linea: getLinea(26), coords: lotPositions[26] },
  { id: 27, superficie: 1500.0, estado: "Disponible", precio: 1990, linea: getLinea(27), coords: lotPositions[27] },
  { id: 28, superficie: 1505.4, estado: "Vendido",    precio: 1464, linea: getLinea(28), coords: lotPositions[28] },
  { id: 29, superficie: 1502.5, estado: "Vendido",    precio: 1971, linea: getLinea(29), coords: lotPositions[29] },
  { id: 30, superficie: 1501.8, estado: "Vendido",    precio: 1862, linea: getLinea(30), coords: lotPositions[30] },
  { id: 31, superficie: 1503.6, estado: "Vendido",    precio: 2290, linea: getLinea(31), coords: lotPositions[31] },
  { id: 32, superficie: 1500.0, estado: "Vendido",    precio: 2290, linea: getLinea(32), coords: lotPositions[32] },
  { id: 33, superficie: 1500.0, estado: "Disponible", precio: 2290, linea: getLinea(33), coords: lotPositions[33] },
  { id: 34, superficie: 1500.0, estado: "Vendido",    precio: 2290, linea: getLinea(34), coords: lotPositions[34] },
  { id: 35, superficie: 1500.0, estado: "Vendido",    precio: 1960, linea: getLinea(35), coords: lotPositions[35] },
  { id: 36, superficie: 1501.8, estado: "Disponible", precio: 1592, linea: getLinea(36), coords: lotPositions[36] },
  { id: 37, superficie: 1500.0, estado: "Vendido",    precio: 1912, linea: getLinea(37), coords: lotPositions[37] },
  { id: 38, superficie: 1501.0, estado: "Vendido",    precio: 2122, linea: getLinea(38), coords: lotPositions[38] },
  { id: 39, superficie: 1525.8, estado: "Vendido",    precio: 1912, linea: getLinea(39), coords: lotPositions[39] },
  { id: 40, superficie: 1852.0, estado: "Vendido",    precio: 1852, linea: getLinea(40), coords: lotPositions[40] },
  { id: 41, superficie: 1500.0, estado: "Disponible", precio: 1990, linea: getLinea(41), coords: lotPositions[41] },
  { id: 42, superficie: 1500.0, estado: "Disponible", precio: 1990, linea: getLinea(42), coords: lotPositions[42] },
  { id: 43, superficie: 1500.0, estado: "Disponible", precio: 1990, linea: getLinea(43), coords: lotPositions[43] },
  { id: 44, superficie: 1529.0, estado: "Disponible", precio: 1990, linea: getLinea(44), coords: lotPositions[44] },
  { id: 45, superficie: 1560.0, estado: "Disponible", precio: 1990, linea: getLinea(45), coords: lotPositions[45] },
  { id: 46, superficie: 2518.1, estado: "Disponible", precio: 1990, linea: getLinea(46), coords: lotPositions[46] },
  { id: 47, superficie: 1760.7, estado: "Disponible", precio: 1990, linea: getLinea(47), coords: lotPositions[47] },
  { id: 48, superficie: 1503.0, estado: "Disponible", precio: 1990, linea: getLinea(48), coords: lotPositions[48] },
  { id: 49, superficie: 1575.3, estado: "Disponible", precio: 1990, linea: getLinea(49), coords: lotPositions[49] },
  { id: 50, superficie: 1500.0, estado: "Disponible", precio: 1990, linea: getLinea(50), coords: lotPositions[50] },
  { id: 51, superficie: 1500.0, estado: "Vendido",    precio: 1891, linea: getLinea(51), coords: lotPositions[51] },
  { id: 52, superficie: 1500.0, estado: "Vendido",    precio: 1788, linea: getLinea(52), coords: lotPositions[52] },
  { id: 53, superficie: 1500.0, estado: "Vendido",    precio: 1990, linea: getLinea(53), coords: lotPositions[53] },
  { id: 54, superficie: 1500.0, estado: "Vendido",    precio: 1990, linea: getLinea(54), coords: lotPositions[54] },
  { id: 55, superficie: 1500.0, estado: "Vendido",    precio: 1990, linea: getLinea(55), coords: lotPositions[55] },
  { id: 56, superficie: 1575.5, estado: "Disponible", precio: 1990, linea: getLinea(56), coords: lotPositions[56] },
  { id: 57, superficie: 1503.0, estado: "Disponible", precio: 1990, linea: getLinea(57), coords: lotPositions[57] },
  { id: 58, superficie: 1731.4, estado: "Disponible", precio: 1990, linea: getLinea(58), coords: lotPositions[58] },
  { id: 59, superficie: 1701.0, estado: "Disponible", precio: 1990, linea: getLinea(59), coords: lotPositions[59] },
  { id: 60, superficie: 1502.8, estado: "Vendido",    precio: 1990, linea: getLinea(60), coords: lotPositions[60] },
  { id: 61, superficie: 1575.5, estado: "Vendido",    precio: 2090, linea: getLinea(61), coords: lotPositions[61] },
  { id: 62, superficie: 1500.0, estado: "Vendido",    precio: 1990, linea: getLinea(62), coords: lotPositions[62] },
  { id: 63, superficie: 1500.0, estado: "Vendido",    precio: 1990, linea: getLinea(63), coords: lotPositions[63] },
  { id: 64, superficie: 1500.0, estado: "Vendido",    precio: 1791, linea: getLinea(64), coords: lotPositions[64] },
  { id: 65, superficie: 1500.0, estado: "Vendido",    precio: 1791, linea: getLinea(65), coords: lotPositions[65] },
  { id: 66, superficie: 1500.0, estado: "Vendido",    precio: 2290, linea: getLinea(66), coords: lotPositions[66] },
  { id: 67, superficie: 1500.0, estado: "Vendido",    precio: 1650, linea: getLinea(67), coords: lotPositions[67] },
  { id: 68, superficie: 1500.0, estado: "Vendido",    precio: 1567, linea: getLinea(68), coords: lotPositions[68] },
  { id: 69, superficie: 1534.7, estado: "Vendido",    precio: 1356, linea: getLinea(69), coords: lotPositions[69] },
  { id: 70, superficie: 1705.2, estado: "Disponible", precio: 2190, linea: getLinea(70), coords: lotPositions[70] },
  { id: 71, superficie: 1747.8, estado: "Vendido",    precio: 2390, linea: getLinea(71), coords: lotPositions[71] },
  { id: 72, superficie: 1538.4, estado: "Vendido",    precio: 1955, linea: getLinea(72), coords: lotPositions[72] },
  { id: 73, superficie: 1477.3, estado: "Vendido",    precio: 1955, linea: getLinea(73), coords: lotPositions[73] },
  { id: 74, superficie: 1505.7, estado: "Vendido",    precio: 1955, linea: getLinea(74), coords: lotPositions[74] },
  { id: 75, superficie: 1523.9, estado: "Disponible", precio: 2490, linea: getLinea(75), coords: lotPositions[75] },
  { id: 76, superficie: 1500.0, estado: "Disponible", precio: 2490, linea: getLinea(76), coords: lotPositions[76] },
];

export const statusColors: Record<LotStatus, string> = {
  Disponible: "#4CAF50",
  Vendido:    "#9E9E9E",
  Promesado:  "#FF9800",
  Reservado:  "#2196F3",
};

export const statusLabels: Record<LotStatus, string> = {
  Disponible: "Disponible",
  Vendido:    "Vendido",
  Promesado:  "Promesado",
  Reservado:  "Reservado",
};
