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
    .from("equipamiento")
    .update({
      nombre: body.nombre,
      inicial: body.inicial,
      notas: body.notas,
      cx: body.cx,
      cy: body.cy,
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
