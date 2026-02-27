import { createServerClient } from "@/lib/supabase/server";
import type { LotRow } from "@/lib/types";
import LoteEditForm from "@/components/admin/LoteEditForm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LoteEditPage({ params }: Props) {
  const { id } = await params;
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("lotes")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (error || !data) {
    notFound();
  }

  const lote = data as LotRow;

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">Sitio {lote.id}</h2>
        <p className="text-xs text-neutral-500 mt-0.5">Edita los campos del lote</p>
      </div>
      <LoteEditForm lote={lote} />
    </div>
  );
}
