import { cookies } from "next/headers";

const COOKIE_NAME = "lotes_admin_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

async function getSecret(): Promise<CryptoKey> {
  const secret = process.env.ADMIN_PASSWORD!;
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createToken(): Promise<string> {
  const key = await getSecret();
  const payload = JSON.stringify({ iat: Date.now() });
  const enc = new TextEncoder();
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  const sigHex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return Buffer.from(`${payload}.${sigHex}`).toString("base64");
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const dotIdx = decoded.lastIndexOf(".");
    if (dotIdx === -1) return false;

    const payload = decoded.slice(0, dotIdx);
    const sigHex = decoded.slice(dotIdx + 1);
    const sigBytes = new Uint8Array(
      sigHex.match(/.{2}/g)!.map((h) => parseInt(h, 16))
    );

    const key = await getSecret();
    const enc = new TextEncoder();
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      enc.encode(payload)
    );
    if (!valid) return false;

    const { iat } = JSON.parse(payload);
    if (Date.now() - iat > MAX_AGE * 1000) return false;
    return true;
  } catch {
    return false;
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

export async function deleteSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
