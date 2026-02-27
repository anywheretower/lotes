import { NextRequest, NextResponse } from "next/server";
import { getSessionToken, verifyToken } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getSessionToken();
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("lotes")
    .update({
      estado: body.estado,
      superficie: body.superficie,
      precio: body.precio,
      linea: body.linea,
      forma_pago: body.forma_pago,
      oferta: body.oferta,
      tiene_casa: body.tiene_casa,
      descripcion_casa: body.descripcion_casa,
      familia_propietaria: body.familia_propietaria,
      notas_generales: body.notas_generales,
      cx: body.cx,
      cy: body.cy,
    })
    .eq("id", Number(id));

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
