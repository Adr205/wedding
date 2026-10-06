/** Strip ILIKE wildcards from a URL slug param. */
export function sanitizeSlugParam(slug: string): string {
  return slug.replace(/[%_]/g, "").trim();
}
