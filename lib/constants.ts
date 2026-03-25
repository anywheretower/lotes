import type { LotStatus } from "./types";

export const statusColors: Record<LotStatus, string> = {
  Disponible: "#16A34A",
  Vendido: "#C62828",
  Promoción: "#EAB308",
  Reservado: "#E65100",
};

export const statusLabels: Record<LotStatus, string> = {
  Disponible: "Disponible",
  Vendido: "Vendido",
  Promoción: "Promoción",
  Reservado: "Reservado",
};

export const AMENITY_COLOR = "#0EA5E9";
