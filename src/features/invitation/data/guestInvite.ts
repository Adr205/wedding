import { createServiceClient } from "@/lib/supabase/serviceClient";

export type GuestPrefill = {
  guest_name: string;
  max_plus_ones: number;
  confirmation_status: "pending" | "confirmed" | "declined";
  table_name: string | null;
};

/**
 * Resolve a personalized invite token for a published event and (once) record
 * that the guest opened their link. Uses the service client because the public
 * visitor is anonymous and event_guests has no public RLS policy.
 */
export async function getGuestByToken(
  slug: string,
  token: string,
): Promise<GuestPrefill | null> {
  const supabase = createServiceClient();

  const { data: event } = await supabase
    .from("events")
    .select("id")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  if (!event) return null;

  const { data: guest } = await supabase
    .from("event_guests")
    .select("id, guest_name, max_plus_ones, confirmation_status, viewed_at, table:event_tables(name)")
    .eq("event_id", event.id)
    .eq("invite_token", token)
    .single();
  if (!guest) return null;

  if (!guest.viewed_at) {
    await supabase
      .from("event_guests")
      .update({ viewed_at: new Date().toISOString() })
      .eq("id", guest.id);
  }

  // Supabase types the embedded relation as an array or object depending on
  // inference; normalize to a single name.
  const table = guest.table as { name: string } | { name: string }[] | null;
  const tableName = Array.isArray(table) ? (table[0]?.name ?? null) : (table?.name ?? null);

  return {
    guest_name: guest.guest_name,
    max_plus_ones: guest.max_plus_ones ?? 0,
    confirmation_status: guest.confirmation_status,
    table_name: tableName,
  };
}

/**
 * Record an RSVP for a personalized invite: updates the pre-loaded guest row
 * instead of inserting a new one. Returns false if the token is invalid.
 */
export async function respondWithToken(params: {
  slug: string;
  token: string;
  name: string;
  phone: string | null;
  plus_ones: number;
  attending: boolean;
}): Promise<boolean> {
  const { slug, token, name, phone, plus_ones, attending } = params;
  const supabase = createServiceClient();

  const { data: event } = await supabase
    .from("events")
    .select("id")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  if (!event) return false;

  const { data: guest } = await supabase
    .from("event_guests")
    .select("id, max_plus_ones, guest_name")
    .eq("event_id", event.id)
    .eq("invite_token", token)
    .single();
  if (!guest) return false;

  const cappedPlusOnes = attending
    ? Math.min(Math.max(plus_ones, 0), guest.max_plus_ones ?? 0)
    : 0;

  const { error } = await supabase
    .from("event_guests")
    .update({
      guest_name: name || guest.guest_name,
      guest_phone: phone,
      plus_ones: cappedPlusOnes,
      confirmation_status: attending ? "confirmed" : "declined",
      responded_at: new Date().toISOString(),
    })
    .eq("id", guest.id);

  return !error;
}
