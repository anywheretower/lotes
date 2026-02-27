import { createServerClient } from "@/lib/supabase/server";
import type { AmenityRow } from "@/lib/types";
import EquipamientoList from "@/components/admin/EquipamientoList";

export const dynamic = "force-dynamic";

export default async function AdminEquipamientoPage() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("equipamiento")
    .select("*")
    .order("nombre", { ascending: true });

  if (error) {
    return <p className="text-red-600 text-sm">Error cargando equipamiento: {error.message}</p>;
  }

  const items = data as AmenityRow[];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">Equipamiento</h2>
        <p className="text-xs text-neutral-500 mt-0.5">{items.length} elementos</p>
      </div>
      <EquipamientoList items={items} />
    </div>
  );
}
