import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/serviceClient";

const BUCKET = "event-media";

export type ModMessage = {
  id: string;
  author_name: string;
  body: string;
  approved: boolean;
  created_at: string;
};

export type ModUpload = {
  id: string;
  uploader_name: string | null;
  image_url: string;
  approved: boolean;
  created_at: string;
};

function db(superAdmin: boolean) {
  return superAdmin ? createServiceClient() : createClient();
}

async function assertOwnsEvent(eventId: string, ownerId: string, superAdmin: boolean) {
  if (superAdmin) return true;
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("id")
    .eq("id", eventId)
    .eq("owner_id", ownerId)
    .single();
  return Boolean(data);
}

// ── Messages ────────────────────────────────────────────────────────────────

export async function listMessages(
  eventId: string,
  ownerId: string,
  superAdmin = false,
): Promise<ModMessage[]> {
  if (!(await assertOwnsEvent(eventId, ownerId, superAdmin))) return [];
  const supabase = await db(superAdmin);
  const { data } = await supabase
    .from("event_messages")
    .select("id, author_name, body, approved, created_at")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });
  return (data as ModMessage[]) ?? [];
}

export async function setMessageApproved(messageId: string, approved: boolean, superAdmin = false) {
  const supabase = await db(superAdmin);
  const { error } = await supabase
    .from("event_messages")
    .update({ approved })
    .eq("id", messageId);
  return error ? { ok: false as const } : { ok: true as const };
}

export async function deleteMessage(messageId: string, superAdmin = false) {
  const supabase = await db(superAdmin);
  const { error } = await supabase.from("event_messages").delete().eq("id", messageId);
  return error ? { ok: false as const } : { ok: true as const };
}

// ── Uploads ─────────────────────────────────────────────────────────────────

export async function listUploads(
  eventId: string,
  ownerId: string,
  superAdmin = false,
): Promise<ModUpload[]> {
  if (!(await assertOwnsEvent(eventId, ownerId, superAdmin))) return [];
  const supabase = await db(superAdmin);
  const { data } = await supabase
    .from("event_uploads")
    .select("id, uploader_name, image_url, approved, created_at")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });
  return (data as ModUpload[]) ?? [];
}

export async function setUploadApproved(uploadId: string, approved: boolean, superAdmin = false) {
  const supabase = await db(superAdmin);
  const { error } = await supabase
    .from("event_uploads")
    .update({ approved })
    .eq("id", uploadId);
  return error ? { ok: false as const } : { ok: true as const };
}

export async function deleteUpload(uploadId: string, superAdmin = false) {
  const supabase = await db(superAdmin);
  // Read (RLS-authorized for non-super admins) to get the storage path.
  const { data: row } = await supabase
    .from("event_uploads")
    .select("storage_path")
    .eq("id", uploadId)
    .single();
  if (!row) return { ok: false as const };

  const { error } = await supabase.from("event_uploads").delete().eq("id", uploadId);
  if (error) return { ok: false as const };

  // Storage delete always via service client (guest-uploads/ isn't owner-scoped
  // in the bucket's delete policy).
  await createServiceClient().storage.from(BUCKET).remove([row.storage_path as string]);
  return { ok: true as const };
}
