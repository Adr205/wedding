import { createClient } from "@/lib/supabase/server";

export type DashboardStats = {
  totalEvents: number;
  publishedEvents: number;
  draftEvents: number;
  totalConfirmations: number;
  totalAttendees: number;
  upcomingEvents: UpcomingEvent[];
  recentRsvps: RecentRsvp[];
};

export type UpcomingEvent = {
  id: string;
  slug: string;
  title: string;
  event_type: string;
  main_date: string;
  is_published: boolean;
  confirmations: number;
  owner_id?: string;
};

export type RecentRsvp = {
  id: string;
  guest_name: string;
  plus_ones: number;
  created_at: string;
  event_title: string;
  event_slug: string;
};

export async function getDashboardStats(ownerId: string, superAdmin = false): Promise<DashboardStats> {
  const supabase = await createClient();

  let eventsQuery = supabase
    .from("events")
    .select("id, slug, title, event_type, main_date, is_published, owner_id")
    .order("main_date", { ascending: true });

  if (!superAdmin) eventsQuery = eventsQuery.eq("owner_id", ownerId);

  const [{ data: events }, { data: guests }] = await Promise.all([
    eventsQuery,
    supabase
      .from("event_guests")
      .select("id, event_id, guest_name, plus_ones, confirmation_status, created_at")
      .eq("confirmation_status", "confirmed")
      .order("created_at", { ascending: false }),
  ]);

  const allEvents = events ?? [];
  const allGuests = guests ?? [];

  // For non-super-admin, only count guests from own events
  const ownEventIds = new Set(
    superAdmin ? allEvents.map((e) => e.id) : allEvents.filter((e) => e.owner_id === ownerId).map((e) => e.id)
  );
  const relevantGuests = allGuests.filter((g) => ownEventIds.has(g.event_id));

  const now = new Date();
  const upcoming = allEvents
    .filter((e) => new Date(e.main_date) >= now)
    .slice(0, 5)
    .map((e) => ({
      ...e,
      confirmations: relevantGuests.filter((g) => g.event_id === e.id).length,
    }));

  const eventMap = new Map(allEvents.map((e) => [e.id, e]));

  const recentRsvps: RecentRsvp[] = relevantGuests.slice(0, 6).map((g) => ({
    id: g.id,
    guest_name: g.guest_name,
    plus_ones: g.plus_ones,
    created_at: g.created_at,
    event_title: eventMap.get(g.event_id)?.title ?? "Evento",
    event_slug: eventMap.get(g.event_id)?.slug ?? "",
  }));

  return {
    totalEvents: allEvents.length,
    publishedEvents: allEvents.filter((e) => e.is_published).length,
    draftEvents: allEvents.filter((e) => !e.is_published).length,
    totalConfirmations: relevantGuests.length,
    totalAttendees: relevantGuests.reduce((sum, g) => sum + 1 + (g.plus_ones ?? 0), 0),
    upcomingEvents: upcoming,
    recentRsvps,
  };
}
