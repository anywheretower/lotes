export interface Amenity {
  id: string;
  nombre: string;
  inicial: string; // label shown inside circle
  coords: { cx: number; cy: number };
  foto: string | null;
  notas: string | null;
}

// ── Amenities (viewBox 850×1100, placeholder coords — calibrate with DEBUG_COORDS) ──

export const amenities: Amenity[] = [
  {
    id: "terraza",
    nombre: "Terraza",
    inicial: "T",
    coords: { cx: 174, cy: 397 },
    foto: null,
    notas: "Terraza comunitaria con vista al lago.",
  },
  {
    id: "rotonda",
    nombre: "Rotonda",
    inicial: "R",
    coords: { cx: 188, cy: 419 },
    foto: null,
    notas: "Rotonda de acceso vehicular al condominio.",
  },
  {
    id: "estacionamiento",
    nombre: "Estacionamiento",
    inicial: "E",
    coords: { cx: 187, cy: 468 },
    foto: null,
    notas: "Estacionamientos de visitas.",
  },
  {
    id: "paseo-peatonal",
    nombre: "Paseo peatonal",
    inicial: "Pp",
    coords: { cx: 501, cy: 864 },
    foto: null,
    notas: "Paseo peatonal con acceso al borde del lago.",
  },
  {
    id: "muelle",
    nombre: "Muelle",
    inicial: "M",
    coords: { cx: 188, cy: 367 },
    foto: null,
    notas: "Muelle para embarcaciones menores.",
  },
  {
    id: "juegos-ninos",
    nombre: "Juegos niños",
    inicial: "J",
    coords: { cx: 171, cy: 508 },
    foto: null,
    notas: "Área de juegos infantiles.",
  },
  {
    id: "kiosko-mirador",
    nombre: "Kiosko mirador",
    inicial: "K",
    coords: { cx: 173, cy: 532 },
    foto: null,
    notas: "Kiosko mirador con vista panorámica al lago.",
  },
  {
    id: "cancha-infantil",
    nombre: "Cancha infantil",
    inicial: "Ci",
    coords: { cx: 548, cy: 847 },
    foto: null,
    notas: "Cancha deportiva infantil.",
  },
  {
    id: "piscina",
    nombre: "Piscina",
    inicial: "Pi",
    coords: { cx: 474, cy: 865 },
    foto: null,
    notas: "Piscina comunitaria.",
  },
  {
    id: "portal-acceso",
    nombre: "Portal acceso",
    inicial: "A",
    coords: { cx: 455, cy: 893 },
    foto: null,
    notas: "Portal de acceso principal al condominio.",
  },
  {
    id: "cancha-padel",
    nombre: "Cancha pádel",
    inicial: "Cp",
    coords: { cx: 356, cy: 903 },
    foto: null,
    notas: "Cancha de pádel.",
  },
  {
    id: "fogon",
    nombre: "Fogón",
    inicial: "F",
    coords: { cx: 293, cy: 914 },
    foto: null,
    notas: "Fogón comunitario para asados y reuniones.",
  },
];

export const AMENITY_COLOR = "#0EA5E9";
