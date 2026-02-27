import { Suspense } from "react";
import LotMap from "@/components/LotMap";
import { getLotes, getEquipamiento } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [lots, amenities] = await Promise.all([getLotes(), getEquipamiento()]);

  return (
    <main className="lg:h-screen lg:overflow-hidden bg-white">
      <Suspense>
        <LotMap lots={lots} amenities={amenities} />
      </Suspense>
    </main>
  );
}
