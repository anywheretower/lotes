import { NextRequest, NextResponse } from "next/server";
import { getSessionToken, verifyToken } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const token = await getSessionToken();
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const entityType = formData.get("entityType") as string;
  const entityId = formData.get("entityId") as string;

  if (!file || !entityType || !entityId) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Generate unique filename
  const ext = file.name.split(".").pop() || "jpg";
  const timestamp = Date.now();
  const filePath = `${entityType}/${entityId}/${timestamp}.${ext}`;

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from("lotes-media")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from("lotes-media")
    .getPublicUrl(filePath);

  const publicUrl = urlData.publicUrl;

  // Update DB
  if (entityType === "lotes") {
    // Append to fotos array
    const { data: lot } = await supabase
      .from("lotes")
      .select("fotos")
      .eq("id", Number(entityId))
      .single();

    const currentFotos = (lot?.fotos as string[]) ?? [];
    const newFotos = [...currentFotos, publicUrl];

    const { error: dbError } = await supabase
      .from("lotes")
      .update({ fotos: newFotos })
      .eq("id", Number(entityId));

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ images: newFotos });
  } else if (entityType === "equipamiento") {
    // Append to fotos array
    const { data: item } = await supabase
      .from("equipamiento")
      .select("fotos")
      .eq("id", entityId)
      .single();

    const currentFotos = (item?.fotos as string[]) ?? [];
    const newFotos = [...currentFotos, publicUrl];

    const { error: dbError } = await supabase
      .from("equipamiento")
      .update({ fotos: newFotos })
      .eq("id", entityId);

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ images: newFotos });
  }

  return NextResponse.json({ error: "Tipo no válido" }, { status: 400 });
}
