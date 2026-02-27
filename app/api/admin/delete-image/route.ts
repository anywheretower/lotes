import { NextRequest, NextResponse } from "next/server";
import { getSessionToken, verifyToken } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const token = await getSessionToken();
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { entityType, entityId, imageUrl } = await request.json();

  if (!entityType || !entityId || !imageUrl) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Extract storage path from public URL
  const urlParts = imageUrl.split("/storage/v1/object/public/lotes-media/");
  if (urlParts.length === 2) {
    const storagePath = urlParts[1];
    await supabase.storage.from("lotes-media").remove([storagePath]);
  }

  // Update DB
  if (entityType === "lotes") {
    const { data: lot } = await supabase
      .from("lotes")
      .select("fotos")
      .eq("id", Number(entityId))
      .single();

    const currentFotos = (lot?.fotos as string[]) ?? [];
    const newFotos = currentFotos.filter((f) => f !== imageUrl);

    const { error: dbError } = await supabase
      .from("lotes")
      .update({ fotos: newFotos })
      .eq("id", Number(entityId));

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ images: newFotos });
  } else if (entityType === "equipamiento") {
    const { error: dbError } = await supabase
      .from("equipamiento")
      .update({ foto: null })
      .eq("id", entityId);

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ images: [] });
  }

  return NextResponse.json({ error: "Tipo no válido" }, { status: 400 });
}
