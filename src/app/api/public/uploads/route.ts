import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/serviceClient";

const BUCKET = "event-media";
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB (matches bucket limit)
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, message: "Cuerpo inválido" }, { status: 400 });
  }

  // Honeypot
  if (String(form.get("website") ?? "")) return NextResponse.json({ ok: true });

  const slug = String(form.get("slug") ?? "");
  const uploaderName = String(form.get("uploader_name") ?? "").trim().slice(0, 80) || null;
  const file = form.get("file");

  if (!slug || !(file instanceof File)) {
    return NextResponse.json({ ok: false, message: "Datos inválidos" }, { status: 422 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ ok: false, message: "Formato no permitido (usa JPG, PNG, WEBP o GIF)" }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, message: "La imagen supera los 10 MB" }, { status: 413 });
  }

  const supabase = createServiceClient();
  const { data: event } = await supabase
    .from("events")
    .select("id")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!event) {
    return NextResponse.json({ ok: false, message: "Evento no encontrado" }, { status: 404 });
  }

  const path = `guest-uploads/${event.id}/${Date.now()}-${randomUUID()}.${EXT[file.type]}`;
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ ok: false, message: "No se pudo subir la imagen" }, { status: 500 });
  }

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);

  const { error: insertError } = await supabase.from("event_uploads").insert({
    event_id: event.id,
    uploader_name: uploaderName,
    image_url: pub.publicUrl,
    storage_path: path,
    approved: false,
  });

  if (insertError) {
    // Roll back the orphaned file so storage doesn't accumulate junk.
    await supabase.storage.from(BUCKET).remove([path]);
    return NextResponse.json({ ok: false, message: "No se pudo guardar la foto" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
