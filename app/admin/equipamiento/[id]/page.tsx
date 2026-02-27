import { createServerClient } from "@/lib/supabase/server";
import type { AmenityRow } from "@/lib/types";
import EquipamientoEditForm from "@/components/admin/EquipamientoEditForm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EquipamientoEditPage({ params }: Props) {
  const { id } = await params;
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("equipamiento")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const item = data as AmenityRow;

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">{item.nombre}</h2>
        <p className="text-xs text-neutral-500 mt-0.5">Edita la información del equipamiento</p>
      </div>
      <EquipamientoEditForm item={item} />
    </div>
  );
}
