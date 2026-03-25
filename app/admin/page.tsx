import { createServerClient } from "@/lib/supabase/server";
import type { LotRow } from "@/lib/types";
import LotesTable from "@/components/admin/LotesTable";

export const dynamic = "force-dynamic";

export default async function AdminLotesPage() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("lotes")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    return <p className="text-red-600 text-sm">Error cargando lotes: {error.message}</p>;
  }

  const lotes = data as LotRow[];

  const stats = {
    total: lotes.length,
    disponible: lotes.filter((l) => l.estado === "Disponible").length,
    vendido: lotes.filter((l) => l.estado === "Vendido").length,
    promocion: lotes.filter((l) => l.estado === "Promoción").length,
    reservado: lotes.filter((l) => l.estado === "Reservado").length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Lotes</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            {stats.total} total · {stats.disponible} disponibles · {stats.vendido} vendidos · {stats.promocion} en promoción · {stats.reservado} reservados
          </p>
        </div>
      </div>
      <LotesTable lotes={lotes} />
    </div>
  );
}
