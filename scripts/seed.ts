/**
 * Seed script: migrates static data from data/lots.ts and data/amenities.ts
 * into Supabase tables `lotes` and `equipamiento`.
 *
 * Usage: npm run seed
 * Requires .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import { lots } from "../data/lots";
import { amenities } from "../data/amenities";

// Load env vars from .env.local
import { readFileSync } from "fs";
import { resolve } from "path";

const envPath = resolve(__dirname, "../.env.local");
const envContent = readFileSync(envPath, "utf-8");
const env: Record<string, string> = {};
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  env[trimmed.slice(0, eqIdx)] = trimmed.slice(eqIdx + 1);
}

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function seedLotes() {
  console.log(`Seeding ${lots.length} lotes...`);

  const rows = lots.map((lot) => ({
    id: lot.id,
    superficie: lot.superficie,
    estado: lot.estado,
    precio: lot.precio,
    linea: lot.linea,
    cx: lot.coords.cx,
    cy: lot.coords.cy,
    fotos: [],
    forma_pago: lot.formaPago,
    oferta: lot.oferta,
    tiene_casa: lot.tieneCasa,
    descripcion_casa: lot.descripcionCasa,
    familia_propietaria: lot.familiaPropietaria,
    notas_generales: lot.notasGenerales,
  }));

  const { error } = await supabase
    .from("lotes")
    .upsert(rows, { onConflict: "id" });

  if (error) {
    console.error("Error seeding lotes:", error);
    process.exit(1);
  }
  console.log(`  ✓ ${rows.length} lotes upserted`);
}

async function seedEquipamiento() {
  console.log(`Seeding ${amenities.length} equipamiento...`);

  const rows = amenities.map((a) => ({
    id: a.id,
    nombre: a.nombre,
    inicial: a.inicial,
    cx: a.coords.cx,
    cy: a.coords.cy,
    foto: a.foto,
    notas: a.notas,
  }));

  const { error } = await supabase
    .from("equipamiento")
    .upsert(rows, { onConflict: "id" });

  if (error) {
    console.error("Error seeding equipamiento:", error);
    process.exit(1);
  }
  console.log(`  ✓ ${rows.length} equipamiento upserted`);
}

async function main() {
  console.log("Starting seed...\n");
  await seedLotes();
  await seedEquipamiento();
  console.log("\nSeed complete!");
}

main();
