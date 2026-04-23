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
};

export type RecentRsvp = {
  id: string;
  guest_name: string;
  plus_ones: number;
  created_at: string;
  event_title: string;
  event_slug: string;
};

export async function getDashboardStats(ownerId: string): Promise<DashboardStats> {
  const supabase = await createClient();

  const [
    { data: events },
    { data: guests },
  ] = await Promise.all([
    supabase
      .from("events")
      .select("id, slug, title, event_type, main_date, is_published")
      .eq("owner_id", ownerId)
      .order("main_date", { ascending: true }),
    supabase
      .from("event_guests")
      .select("id, event_id, guest_name, plus_ones, confirmation_status, created_at")
      .eq("confirmation_status", "confirmed")
      .order("created_at", { ascending: false }),
  ]);

  const allEvents = events ?? [];
  const allGuests = guests ?? [];

  const now = new Date();
  const upcoming = allEvents
    .filter((e) => new Date(e.main_date) >= now)
    .slice(0, 5)
    .map((e) => ({
      ...e,
      confirmations: allGuests.filter((g) => g.event_id === e.id).length,
    }));

  // Build event title lookup for recent RSVPs
  const eventMap = new Map(allEvents.map((e) => [e.id, e]));

  const recentRsvps: RecentRsvp[] = allGuests.slice(0, 6).map((g) => ({
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
    totalConfirmations: allGuests.length,
    totalAttendees: allGuests.reduce((sum, g) => sum + 1 + (g.plus_ones ?? 0), 0),
    upcomingEvents: upcoming,
    recentRsvps,
  };
}
