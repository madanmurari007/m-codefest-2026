import { NextRequest } from "next/server";
import { getModel, getOpenAI, logOpenAIError } from "@/lib/openai";
import { pickImage } from "@/lib/ai-image-pool";
import { resolveCurrency } from "@/lib/currency";
import type { Hotel, HotelTier } from "@/lib/types";

/**
 * Wanderlust AI chat route.
 *
 * Hotel recommendations are generated entirely by the LLM — we do not look
 * up anything from the local catalog. The model returns each property's
 * name, location, description, price, amenities, vibe, tier, etc. and we
 * pair each with a stock photograph based on an LLM-supplied
 * `imageCategory`.
 */

const SYSTEM_PROMPT = `You are Wanderlust AI, an enthusiastic travel planning assistant.

For every user request, INVENT 2-3 fitting hotel recommendations from anywhere in the world. The hotels do not need to be real — invent plausible, characterful properties that match the user's vibe.

Respond with STRICT JSON only — no markdown, no preamble, no code fences. Use this exact schema:

{
  "summary": "Warm, concise 2-3 sentence narrative reply to the user, mentioning each chosen hotel name inline.",
  "suggestedRegions": ["<region label>", ...],
  "recommendations": [
    {
      "name": "<distinctive hotel name>",
      "tier": "Signature" | "Premium" | "Comfort" | "Extended",
      "city": "<city name>",
      "country": "<country name>",
      "location": "<short location label, e.g. 'Bora Bora' or 'Swiss Alps'>",
      "description": "<2-3 sentence evocative description of the property>",
      "vibe": "<a 3-6 word vibe phrase, e.g. 'Romantic overwater paradise'>",
      "currency": "<ISO 4217 code matching the country's native currency, e.g. EUR for Italy, JPY for Japan, GBP for UK, THB for Thailand, AED for UAE, MXN for Mexico, INR for India, USD for the US/Caribbean>",
      "pricePerNight": <integer NIGHTLY rate denominated in the currency above, realistic for the tier and country>,
      "rating": <number between 4.4 and 5.0 with one decimal>,
      "reviewCount": <integer between 80 and 4500>,
      "amenities": ["<6 short amenities>", ...],
      "tags": ["<4-6 lowercase tag keywords>", ...],
      "imageCategory": "<one of: tropical, beach, mountain, alpine, urban, skyline, safari, wildlife, wellness, spa, cultural, historic, desert, arctic, vineyard, wedding, honeymoon, nature, forest>",
      "temporaryNotices": ["<0-2 short live operational messages tailored to the property, e.g. 'Lap pool closed for resurfacing Nov 18-22', 'Rooms next to the ballroom unavailable due to a private wedding', 'Spa sauna under maintenance', 'Lobby renovations: morning coffee moved to terrace'>"],
      "headline": "<a punchy 5-9 word tagline UNIQUE to this hotel and the user's intent>",
      "reason": "<1-2 sentences explaining why this hotel matches the user's request>"
    }
  ]
}

Rules:
- Pick 2-3 recommendations, in order of best match first.
- Tailor every headline and reason to the specific user request — do NOT reuse generic phrasing across cards.
- Keep "summary" under 60 words.
- Use "Signature" tier for ultra-luxury, "Premium" for upscale, "Comfort" for mid-market, "Extended" for longer stays / apart-hotels.
- "imageCategory" MUST be one of the exact values listed above.
- "currency" MUST be a valid ISO 4217 code that matches the country. "pricePerNight" MUST be a realistic per-night figure denominated in that same currency (e.g. 480 for a EUR boutique stay in Italy, 65000 for a JPY ryokan in Kyoto, 2800 for an AED stay in Dubai).
- "temporaryNotices": Include 0-2 short, plausible operational status lines per hotel (under 14 words each). Mix maintenance, events, and renovations. About one in three hotels should have NO notices (return []) so the messages feel realistic rather than every property having issues.
- Be specific and evocative; avoid clichés.

suggestedRegions guidance:
- If the user's request is GENERIC (no specific country, city, continent, sub-region or named destination), populate "suggestedRegions" with 4-6 short region labels the user could pivot to that are DIFFERENT from where your recommendations are set. Pick labels from: "Europe", "Mediterranean", "Asia", "Southeast Asia", "Middle East", "Africa", "North America", "South America", "Caribbean", "Oceania", "Pacific Islands", "Scandinavia", "Alps", "United States", "Indian Ocean".
- If the user ALREADY specified a region or specific destination, return an empty array [] for "suggestedRegions".
- Never repeat a region you've already used in the recommendations.`;

const VALID_TIERS: HotelTier[] = ["Signature", "Premium", "Comfort", "Extended"];

interface RawRec {
  name?: string;
  tier?: string;
  city?: string;
  country?: string;
  location?: string;
  description?: string;
  vibe?: string;
  currency?: string;
  pricePerNight?: number;
  rating?: number;
  reviewCount?: number;
  amenities?: string[];
  tags?: string[];
  imageCategory?: string;
  temporaryNotices?: string[];
  headline?: string;
  reason?: string;
}

function sanitizeNotices(raw: string[] | undefined): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const n of raw) {
    if (typeof n !== "string") continue;
    const trimmed = n.trim();
    if (!trimmed || trimmed.length > 140) continue;
    out.push(trimmed);
    if (out.length >= 3) break;
  }
  return out;
}

interface RawLLMResponse {
  summary?: string;
  suggestedRegions?: string[];
  recommendations?: RawRec[];
}

interface SerializedRec {
  hotel: Hotel;
  headline?: string;
  reason?: string;
}

/** Whitelist of region labels we'll accept from the LLM (defends against junk). */
const ALLOWED_REGIONS = [
  "Europe",
  "Mediterranean",
  "Asia",
  "Southeast Asia",
  "Middle East",
  "Africa",
  "North America",
  "South America",
  "Caribbean",
  "Oceania",
  "Pacific Islands",
  "Scandinavia",
  "Alps",
  "United States",
  "Indian Ocean",
];

function sanitizeRegions(raw: string[] | undefined): string[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const r of raw) {
    if (typeof r !== "string") continue;
    const trimmed = r.trim();
    // Accept exact whitelist matches or simple case-insensitive matches.
    const canonical =
      ALLOWED_REGIONS.find((a) => a.toLowerCase() === trimmed.toLowerCase()) ??
      trimmed;
    if (!seen.has(canonical.toLowerCase()) && canonical.length <= 24) {
      seen.add(canonical.toLowerCase());
      out.push(canonical);
    }
    if (out.length >= 6) break;
  }
  return out;
}

/**
 * Cheap server-side detector for whether the user's last message already
 * names a region. Used to decide if the no-key/error fallback should serve
 * a region chip set.
 */
function isQueryRegional(text: string): boolean {
  const t = text.toLowerCase();
  const hints = [
    "europe", "asia", "africa", "america", "caribbean", "oceania",
    "mediterranean", "scandinavi", "alps", "middle east", "indian ocean",
    "pacific", "italy", "france", "spain", "greece", "japan", "thailand",
    "indonesia", "bali", "maldives", "fiji", "morocco", "kenya", "tanzania",
    "mexico", "brazil", "argentina", "peru", "canada", "iceland", "norway",
    "sweden", "finland", "portugal", "switzerland", "austria", "germany",
    "uk", "england", "scotland", "ireland", "australia", "new zealand",
    "vietnam", "cambodia", "singapore", "malaysia", "india", "nepal",
    "egypt", "dubai", "oman", "jordan", "south africa", "botswana",
    "namibia", "seychelles", "mauritius", "us", "usa", "united states",
    "new york", "tokyo", "paris", "london", "rome", "barcelona",
  ];
  return hints.some((h) => t.includes(h));
}

const DEFAULT_REGION_SET = [
  "Europe",
  "Asia",
  "Caribbean",
  "Africa",
  "Mediterranean",
  "Oceania",
];

function coerceTier(raw: string | undefined): HotelTier {
  const normalized = (raw ?? "").trim();
  return (VALID_TIERS.find((t) => t === normalized) ?? "Premium") as HotelTier;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

/**
 * Convert each raw LLM rec into a full Hotel record the UI can render.
 * Image lookup, id, and defaults for unused-but-required fields happen here
 * so the rest of the app keeps working with the existing Hotel shape.
 */
function buildRecommendations(
  raw: RawRec[] | undefined,
  seed: string,
): SerializedRec[] {
  if (!raw) return [];
  const out: SerializedRec[] = [];
  raw.forEach((r, i) => {
    if (!r.name) return;
    const image = pickImage(r.imageCategory, i + seed.length);
    const currency = resolveCurrency(r.currency, r.country);
    const hotel: Hotel = {
      id: `ai-${seed}-${i}`,
      name: r.name,
      tier: coerceTier(r.tier),
      city: r.city ?? "",
      country: r.country ?? "",
      location: r.location ?? [r.city, r.country].filter(Boolean).join(", "),
      description: r.description ?? "",
      image,
      images: [image],
      rating: r.rating != null ? clamp(Number(r.rating), 1, 5) : 4.7,
      reviewCount:
        r.reviewCount != null ? Math.max(1, Math.floor(r.reviewCount)) : 250,
      pricePerNight:
        r.pricePerNight != null
          ? Math.max(1, Math.floor(r.pricePerNight))
          : 350,
      currency,
      amenities: Array.isArray(r.amenities)
        ? r.amenities.slice(0, 8)
        : ["Spa", "Pool", "Restaurant"],
      tags: Array.isArray(r.tags) ? r.tags.slice(0, 8) : [],
      vibe: r.vibe ?? "Curated stay",
      coordinates: { lat: 0, lng: 0 },
      roomTypes: [],
      temporaryNotices: sanitizeNotices(r.temporaryNotices),
    };
    out.push({ hotel, headline: r.headline, reason: r.reason });
  });
  return out;
}

/**
 * Static no-LLM fallback. Still returns the same structured shape so the
 * UI looks identical, but the hotels are pre-baked sample picks.
 */
function generateFallback(userMessage: string): {
  summary: string;
  recommendations: SerializedRec[];
} {
  const msg = userMessage.toLowerCase();

  type Sample = Omit<RawRec, "headline" | "reason"> & {
    headline: string;
    reason: string;
  };

  const buckets: { match: RegExp; vibe: string; samples: Sample[] }[] = [
    {
      match: /beach|tropical|island|maldives|bora|fiji/,
      vibe: "tropical beach escape",
      samples: [
        {
          name: "Azure Reef Hideaway",
          tier: "Signature",
          city: "Malé Atoll",
          country: "Maldives",
          location: "Maldives",
          description:
            "Overwater bungalows perched above a glass-clear lagoon, with private decks descending straight into the reef.",
          vibe: "Overwater Maldives paradise",
          currency: "USD",
          pricePerNight: 920,
          rating: 4.9,
          reviewCount: 1240,
          amenities: ["Overwater Villa", "Reef Snorkeling", "Spa", "Sunset Bar", "Butler", "Diving"],
          tags: ["tropical", "beach", "romantic", "diving"],
          imageCategory: "tropical",
          headline: "Wake up over the reef",
          reason: "Direct lagoon access and a butler on call deliver the quintessential tropical beach escape.",
        },
        {
          name: "Coral Sands Retreat",
          tier: "Premium",
          city: "Le Morne",
          country: "Mauritius",
          location: "Mauritius",
          description:
            "Palm-fringed beachfront resort with daily kitesurfing, sega music nights, and a creole farm-to-plate kitchen.",
          vibe: "Active beachfront playground",
          currency: "USD",
          pricePerNight: 480,
          rating: 4.7,
          reviewCount: 1342,
          amenities: ["Kitesurfing", "Spa", "Creole Restaurant", "Lagoon Pool", "Beach Yoga", "Boat Tours"],
          tags: ["tropical", "beach", "adventure", "foodie"],
          imageCategory: "beach",
          headline: "Where every day ends in sega and stars",
          reason: "Lively Mauritian beachfront with watersports by day and creole feasts by night.",
        },
      ],
    },
    {
      match: /mountain|ski|winter|snow|alpine|alps/,
      vibe: "mountain retreat",
      samples: [
        {
          name: "Alpine Crest Lodge",
          tier: "Premium",
          city: "Zermatt",
          country: "Switzerland",
          location: "Swiss Alps",
          description:
            "Ski-in/ski-out chalet at the foot of the Matterhorn with roaring fireplaces and a panoramic spa terrace.",
          vibe: "Matterhorn ski-in chalet",
          currency: "CHF",
          pricePerNight: 460,
          rating: 4.8,
          reviewCount: 880,
          amenities: ["Ski-in/Ski-out", "Spa", "Fireplace Lounge", "Mountain Restaurant", "Heated Pool", "Ski Storage"],
          tags: ["mountain", "winter", "cozy", "skiing"],
          imageCategory: "alpine",
          headline: "Carve the Matterhorn at first chair",
          reason: "Direct piste access plus an après-ski spa is the ideal pairing for a mountain getaway.",
        },
      ],
    },
    {
      match: /city|urban|skyline|new york|tokyo|london|paris/,
      vibe: "city break",
      samples: [
        {
          name: "Skyline Atelier",
          tier: "Signature",
          city: "Tokyo",
          country: "Japan",
          location: "Shibuya, Tokyo",
          description:
            "Sleek skyline tower with rooftop infinity pool, omakase counter, and floor-to-ceiling views of the Tokyo grid.",
          vibe: "Sky-high Tokyo design hotel",
          currency: "JPY",
          pricePerNight: 78000,
          rating: 4.8,
          reviewCount: 1620,
          amenities: ["Rooftop Pool", "Omakase Counter", "Spa", "Cocktail Bar", "Concierge", "Gym"],
          tags: ["urban", "skyline", "foodie", "nightlife"],
          imageCategory: "skyline",
          headline: "Tokyo's pulse from your pillow",
          reason: "Front-row Shibuya views and a rooftop omakase keep the city's energy in arm's reach.",
        },
      ],
    },
    {
      match: /safari|africa|wildlife|serengeti|kruger|botswana/,
      vibe: "safari adventure",
      samples: [
        {
          name: "Savanna Starlight Camp",
          tier: "Signature",
          city: "Serengeti",
          country: "Tanzania",
          location: "Serengeti, Tanzania",
          description:
            "Tented camp tracking the Great Migration with private guides, bush dining, and a retractable-roof Starlight Suite.",
          vibe: "Migration-watching tented camp",
          currency: "USD",
          pricePerNight: 950,
          rating: 4.9,
          reviewCount: 456,
          amenities: ["Game Drives", "Bush Dining", "Star Gazing", "Spa", "Private Guide", "Photography Tours"],
          tags: ["safari", "wildlife", "adventure", "stargazing"],
          imageCategory: "safari",
          headline: "Sleep under the Serengeti sky",
          reason: "Front-row seat to the Great Migration with all-canvas luxury and expert trackers.",
        },
      ],
    },
    {
      match: /romantic|honeymoon|anniversary|couple/,
      vibe: "romantic getaway",
      samples: [
        {
          name: "Lagoon Pearl Villas",
          tier: "Signature",
          city: "Bora Bora",
          country: "French Polynesia",
          location: "Bora Bora",
          description:
            "Suspended overwater villas with private plunge pools and barefoot beachfront dining beneath Mt Otemanu.",
          vibe: "Iconic lagoon honeymoon",
          currency: "USD",
          pricePerNight: 1100,
          rating: 4.9,
          reviewCount: 612,
          amenities: ["Plunge Pool", "Beach Restaurant", "Polynesian Spa", "Sunset Cruise", "Snorkeling", "Butler"],
          tags: ["romantic", "honeymoon", "beach", "overwater"],
          imageCategory: "honeymoon",
          headline: "Plunge-pool sunsets, just the two of you",
          reason: "Overwater privacy and butler-tended dinners build the perfect romantic punctuation.",
        },
      ],
    },
  ];

  const matched = buckets.find((b) => b.match.test(msg)) ?? buckets[0];

  const recommendations = buildRecommendations(matched.samples, "fb");
  const names = recommendations.map((r) => `**${r.hotel.name}**`).join(", ");
  const summary = `For your ${matched.vibe}, I'd open with ${names}. Each card has my reasoning attached — tap to dig in.`;

  return { summary, recommendations };
}

export async function POST(request: NextRequest) {
  const { messages } = await request.json();

  const lastUser =
    messages
      .filter((m: { role: string }) => m.role === "user")
      .pop()?.content || "";

  /** Server-side default: only suggest regions when the ask doesn't already name one. */
  const fallbackRegions = isQueryRegional(lastUser) ? [] : DEFAULT_REGION_SET;

  const openai = getOpenAI();
  if (!openai) {
    const fb = generateFallback(lastUser);
    return Response.json({
      content: fb.summary,
      recommendations: fb.recommendations,
      suggestedRegions: fallbackRegions,
      source: "fallback-no-key",
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: getModel(),
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 1500,
      temperature: 0.85,
      response_format: { type: "json_object" },
    });

    const text = completion.choices[0].message.content || "{}";
    let parsed: RawLLMResponse = {};
    try {
      parsed = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
    }

    const recommendations = buildRecommendations(
      parsed.recommendations,
      Date.now().toString(36),
    );

    // Prefer the LLM's region picks, but defend with our own detector so
    // chips appear when the model forgets and stay hidden for region-specific
    // asks.
    const llmRegions = sanitizeRegions(parsed.suggestedRegions);
    const suggestedRegions = isQueryRegional(lastUser)
      ? []
      : llmRegions.length > 0
        ? llmRegions
        : DEFAULT_REGION_SET;

    if (recommendations.length === 0) {
      const fb = generateFallback(lastUser);
      return Response.json({
        content: parsed.summary || fb.summary,
        recommendations: fb.recommendations,
        suggestedRegions,
        source: "llm-empty-recs-fallback",
      });
    }

    return Response.json({
      content: parsed.summary || "",
      recommendations,
      suggestedRegions,
      source: "llm",
    });
  } catch (err) {
    logOpenAIError("chat", err);
    const fb = generateFallback(lastUser);
    return Response.json({
      content: fb.summary,
      recommendations: fb.recommendations,
      suggestedRegions: fallbackRegions,
      source: "fallback-error",
    });
  }
}
