export const DEAL_CATEGORIES = ["Deals", "Deals & Bundles", "Deal", "Bundle"];

/**
 * Returns true if the given product category represents a deal / bundle
 * product. Uses a substring match so admin-entered variants like
 * "Deal Offer" or "deals & bundles" are also detected.
 */
export function isDealCategory(category?: string | null): boolean {
  const v = (category || "").trim().toLowerCase();
  if (!v) return false;
  if (DEAL_CATEGORIES.map((c) => c.toLowerCase()).includes(v)) return true;
  return v.includes("deal") || v.includes("bundle");
}
