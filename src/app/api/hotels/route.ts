import { NextRequest } from "next/server";
import {
  hotels,
  getHotelsByVibe,
  searchHotels,
  moodCategories,
} from "@/lib/hotels";
import type { Hotel } from "@/lib/types";

/**
 * GET /api/hotels
 *
 * Returns the full hotel catalog as an array of detailed Hotel objects.
 * Every hotel object contains all its attributes (id, name, tier, location,
 * city, country, description, images, rating, reviewCount, pricePerNight,
 * currency, amenities, tags, vibe, coordinates, roomTypes).
 *
 * Query params (all optional, combinable):
 *   - vibe     A mood name (Romance, Adventure, Wellness, Culture, Urban, Nature)
 *              or a single tag/keyword (tropical, romantic, foodie, ...)
 *   - tags     Comma-separated tag list to OR-match against hotel.tags
 *   - q        Free-text search across name, location, vibe, tags, amenities
 *   - tier     Filter by tier (Signature | Premium | Comfort | Extended)
 *   - minPrice Minimum nightly price
 *   - maxPrice Maximum nightly price
 *   - limit    Cap on the number of hotels returned
 *   - sort     "price-asc" | "price-desc" | "rating" | "popularity" (default)
 *
 * Example:
 *   GET /api/hotels?vibe=Romance&limit=10
 *   GET /api/hotels?tags=tropical,beach&maxPrice=900
 *   GET /api/hotels?q=safari&sort=rating
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const vibe = searchParams.get("vibe")?.trim();
  const tagsParam = searchParams.get("tags")?.trim();
  const q = searchParams.get("q")?.trim();
  const tier = searchParams.get("tier")?.trim();
  const minPrice = numberOrNull(searchParams.get("minPrice"));
  const maxPrice = numberOrNull(searchParams.get("maxPrice"));
  const limit = numberOrNull(searchParams.get("limit"));
  const sort = searchParams.get("sort")?.trim() ?? "popularity";

  // Starting set
  let list: Hotel[] = hotels;

  if (vibe) {
    list = getHotelsByVibe(vibe);
  }

  if (tagsParam) {
    const tags = tagsParam.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
    if (tags.length > 0) {
      list = list.filter((h) =>
        tags.some((t) => h.tags.some((ht) => ht.includes(t))),
      );
    }
  }

  if (q) {
    const searched = searchHotels(q);
    const ids = new Set(searched.map((h) => h.id));
    list = list.filter((h) => ids.has(h.id));
  }

  if (tier) {
    const normalized = tier.toLowerCase();
    list = list.filter((h) => h.tier.toLowerCase() === normalized);
  }

  if (minPrice != null) list = list.filter((h) => h.pricePerNight >= minPrice);
  if (maxPrice != null) list = list.filter((h) => h.pricePerNight <= maxPrice);

  // Sort
  switch (sort) {
    case "price-asc":
      list = [...list].sort((a, b) => a.pricePerNight - b.pricePerNight);
      break;
    case "price-desc":
      list = [...list].sort((a, b) => b.pricePerNight - a.pricePerNight);
      break;
    case "rating":
      list = [...list].sort((a, b) => b.rating - a.rating);
      break;
    case "popularity":
    default:
      list = [...list].sort((a, b) => b.reviewCount - a.reviewCount);
      break;
  }

  if (limit != null) list = list.slice(0, limit);

  return Response.json({
    total: list.length,
    catalogSize: hotels.length,
    filters: { vibe, tags: tagsParam, q, tier, minPrice, maxPrice, sort, limit },
    availableVibes: moodCategories.map((m) => ({
      id: m.id,
      name: m.name,
      tags: m.tags,
    })),
    hotels: list,
  });
}

function numberOrNull(raw: string | null): number | null {
  if (raw == null || raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}
