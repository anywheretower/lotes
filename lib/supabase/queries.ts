import { createServerClient } from "./server";
import { LotRow, AmenityRow, lotRowToLot, amenityRowToAmenity, Lot, Amenity } from "../types";

export async function getLotes(): Promise<Lot[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("lotes")
    .select("*")
    .order("id", { ascending: true });

  if (error) throw error;
  return (data as LotRow[]).map(lotRowToLot);
}

export async function getEquipamiento(): Promise<Amenity[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("equipamiento")
    .select("*")
    .order("nombre", { ascending: true });

  if (error) throw error;
  return (data as AmenityRow[]).map(amenityRowToAmenity);
}
