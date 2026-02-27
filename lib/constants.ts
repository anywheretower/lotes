import type { LotStatus } from "./types";

export const statusColors: Record<LotStatus, string> = {
  Disponible: "#16A34A",
  Vendido: "#3771b3",
  Promesado: "#C62828",
  Reservado: "#E65100",
};

export const statusLabels: Record<LotStatus, string> = {
  Disponible: "Disponible",
  Vendido: "Vendido",
  Promesado: "Promesado",
  Reservado: "Reservado",
};

export const AMENITY_COLOR = "#0EA5E9";
