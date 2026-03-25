/**
 * Execute SQL against Supabase PostgreSQL directly.
 * Tries direct connection and pooler with service role key.
 */

import { Client } from "pg";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load env
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

const PROJECT_REF = env.NEXT_PUBLIC_SUPABASE_URL?.replace("https://", "").replace(".supabase.co", "");
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!PROJECT_REF || !SERVICE_ROLE_KEY) {
  console.error("Missing env vars");
  process.exit(1);
}

const SQL = `
-- Create lotes table
CREATE TABLE IF NOT EXISTS lotes (
  id INTEGER PRIMARY KEY,
  superficie NUMERIC(10,1) NOT NULL,
  estado TEXT NOT NULL DEFAULT 'Disponible'
    CHECK (estado IN ('Disponible','Vendido','Promoción','Reservado')),
  precio NUMERIC(10,0) NOT NULL,
  linea TEXT CHECK (linea IN ('1ª Línea','2ª Línea','3ª Línea') OR linea IS NULL),
  cx NUMERIC(8,1) NOT NULL,
  cy NUMERIC(8,1) NOT NULL,
  fotos TEXT[] DEFAULT '{}',
  forma_pago TEXT NOT NULL DEFAULT '',
  oferta TEXT,
  tiene_casa BOOLEAN NOT NULL DEFAULT FALSE,
  descripcion_casa TEXT,
  familia_propietaria TEXT,
  notas_generales TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create equipamiento table
CREATE TABLE IF NOT EXISTS equipamiento (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  inicial TEXT NOT NULL,
  cx NUMERIC(8,1) NOT NULL,
  cy NUMERIC(8,1) NOT NULL,
  foto TEXT,
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

-- Triggers (idempotent)
DROP TRIGGER IF EXISTS lotes_updated_at ON lotes;
CREATE TRIGGER lotes_updated_at BEFORE UPDATE ON lotes FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS equipamiento_updated_at ON equipamiento;
CREATE TRIGGER equipamiento_updated_at BEFORE UPDATE ON equipamiento FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE lotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipamiento ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read lotes" ON lotes;
DROP POLICY IF EXISTS "Public read equipamiento" ON equipamiento;

CREATE POLICY "Public read lotes" ON lotes FOR SELECT USING (true);
CREATE POLICY "Public read equipamiento" ON equipamiento FOR SELECT USING (true);
`;

// Connection configs to try in order
const configs = [
  {
    name: "Direct (port 5432)",
    config: {
      host: `db.${PROJECT_REF}.supabase.co`,
      port: 5432,
      database: "postgres",
      user: "postgres",
      password: SERVICE_ROLE_KEY,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
    },
  },
  {
    name: "Pooler transaction (port 6543, us-east-1)",
    config: {
      host: `aws-0-us-east-1.pooler.supabase.com`,
      port: 6543,
      database: "postgres",
      user: `postgres.${PROJECT_REF}`,
      password: SERVICE_ROLE_KEY,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
    },
  },
  {
    name: "Pooler transaction (port 6543, sa-east-1)",
    config: {
      host: `aws-0-sa-east-1.pooler.supabase.com`,
      port: 6543,
      database: "postgres",
      user: `postgres.${PROJECT_REF}`,
      password: SERVICE_ROLE_KEY,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
    },
  },
  {
    name: "Pooler session (port 5432, us-east-1)",
    config: {
      host: `aws-0-us-east-1.pooler.supabase.com`,
      port: 5432,
      database: "postgres",
      user: `postgres.${PROJECT_REF}`,
      password: SERVICE_ROLE_KEY,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
    },
  },
  {
    name: "Pooler session (port 5432, sa-east-1)",
    config: {
      host: `aws-0-sa-east-1.pooler.supabase.com`,
      port: 5432,
      database: "postgres",
      user: `postgres.${PROJECT_REF}`,
      password: SERVICE_ROLE_KEY,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
    },
  },
];

async function tryConnection(name: string, pgConfig: any): Promise<boolean> {
  console.log(`\nTrying: ${name}...`);
  const client = new Client(pgConfig);
  try {
    await client.connect();
    console.log("  Connected! Running SQL...");
    await client.query(SQL);
    console.log("  SQL executed successfully!");
    await client.end();
    return true;
  } catch (err: any) {
    console.log(`  Failed: ${err.message}`);
    try { await client.end(); } catch {}
    return false;
  }
}

async function main() {
  console.log(`Project ref: ${PROJECT_REF}`);

  for (const { name, config } of configs) {
    const ok = await tryConnection(name, config);
    if (ok) {
      console.log("\nDone! Tables created successfully.");
      process.exit(0);
    }
  }

  console.error("\nAll connection methods failed.");
  console.error("You may need to provide the database password.");
  process.exit(1);
}

main();
