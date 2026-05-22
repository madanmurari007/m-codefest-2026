export type CrowdLevel =
  | "Quiet & intimate"
  | "Mellow & social"
  | "Lively & buzzing"
  | "Vibrant & loud";

export interface AmenityInfo {
  /** Canonical display name */
  name: string;
  /** Short evocative description shown in the popup */
  description: string;
  /** Hosted image used for the popup */
  image: string;
  /** Free-form happy-hour or peak-time copy (omit when not relevant) */
  happyHours?: string;
  /** Special offer / discount copy (omit when not relevant) */
  discounts?: string;
  /** Crowd vibe at peak times */
  crowd?: CrowdLevel;
  /** A few signature highlights to enumerate as chips */
  highlights?: string[];
}

/**
 * Catalog of amenity tooltips. Keys are lowercased.
 * Multiple raw amenity strings can resolve to the same canonical entry via
 * the keyword matching in `getAmenityInfo()` below.
 */
const CATALOG: Record<string, AmenityInfo> = {
  bar: {
    name: "Signature Bar",
    description:
      "A polished cocktail bar with hand-crafted classics, regional spirits, and a curated wine list. Live acoustic sets most weekends.",
    image:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&q=80",
    happyHours: "Daily 5–7pm · half-price signature cocktails & small plates",
    discounts: "20% off bar tabs for in-house guests after 9pm",
    crowd: "Lively & buzzing",
    highlights: ["Craft cocktails", "Wine list", "Live music"],
  },
  "rooftop bar": {
    name: "Rooftop Bar",
    description:
      "Open-air rooftop perch with skyline or coastline views, signature spritzes, and a tapas-style menu built for sunsets.",
    image:
      "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?w=600&q=80",
    happyHours: "Sunset hour 6–8pm · 2-for-1 spritzes",
    discounts: "Complimentary first cocktail on check-in night",
    crowd: "Vibrant & loud",
    highlights: ["Skyline views", "Sunset menu", "DJ sets"],
  },
  "sunset bar": {
    name: "Sunset Bar",
    description:
      "Toes-in-the-sand cocktails as the sky turns gold. Tropical mixology, fresh ceviches, and a curated rosé list.",
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&q=80",
    happyHours: "Golden hour daily · half-price rosé and tropical spritzes",
    discounts: "Complimentary canapés for couples on anniversary stays",
    crowd: "Mellow & social",
    highlights: ["Beachfront", "Rosé list", "Ceviche menu"],
  },
  "mezcal bar": {
    name: "Mezcal Bar",
    description:
      "A speakeasy-style mezcaleria pouring small-batch agave spirits from family palenques, with tasting flights and pairings.",
    image:
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&q=80",
    happyHours: "Flight night Thursdays · 30% off curated mezcal flights",
    discounts: "Member rate guests get a complimentary tasting on arrival",
    crowd: "Lively & buzzing",
    highlights: ["Small-batch agave", "Tasting flights", "Tequila masterclass"],
  },
  spa: {
    name: "Signature Spa",
    description:
      "A full-service sanctuary with steam rooms, hydrotherapy circuits, and a menu of indigenous treatments and bespoke rituals.",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbec6e?w=600&q=80",
    happyHours: "Weekday mornings 9–11am · complimentary thermal circuit",
    discounts: "15% off treatments booked 24+ hours in advance",
    crowd: "Quiet & intimate",
    highlights: ["Hydrotherapy", "Couples suites", "Signature rituals"],
  },
  "polynesian spa": {
    name: "Polynesian Spa",
    description:
      "Open-air pavilions overlooking the lagoon, with Taurumi massages, monoi rituals, and locally sourced botanical scrubs.",
    image:
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80",
    discounts: "Complimentary 20-min foot ritual with any 90-minute treatment",
    crowd: "Quiet & intimate",
    highlights: ["Taurumi massage", "Monoi rituals", "Lagoon-side cabanas"],
  },
  "yoga pavilion": {
    name: "Yoga Pavilion",
    description:
      "Sunrise and sunset classes on an open-air deck. Daily flow, restorative, and breathwork sessions led by resident teachers.",
    image:
      "https://images.unsplash.com/photo-1545389336-cf090694435e?w=600&q=80",
    happyHours: "Sunrise flow at 6:30am is free for in-house guests",
    discounts: "10-class private package billed to room",
    crowd: "Quiet & intimate",
    highlights: ["Sunrise flow", "Breathwork", "Restorative"],
  },
  "yoga shala": {
    name: "Yoga Shala",
    description:
      "Bamboo-and-teak shala with ocean breezes, daily vinyasa, and visiting masters running themed retreats throughout the year.",
    image:
      "https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=600&q=80",
    happyHours: "Sunset yin daily · free for all guests",
    discounts: "Retreat packages 15% off when booked with a stay",
    crowd: "Quiet & intimate",
    highlights: ["Vinyasa", "Yin", "Guest teachers"],
  },
  "infinity pool": {
    name: "Infinity Pool",
    description:
      "A horizon-melting pool with day cabanas, swim-up service, and a curated playlist that shifts from chillout to sundown.",
    image:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80",
    happyHours: "Frozen drink hour daily 3–5pm",
    discounts: "Complimentary cabana with any 4+ night stay",
    crowd: "Lively & buzzing",
    highlights: ["Swim-up bar", "Day cabanas", "Sunset DJ"],
  },
  "lagoon pool": {
    name: "Lagoon Pool",
    description:
      "A free-form pool snaking through tropical gardens with shallow lounging shelves and shaded daybeds.",
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80",
    discounts: "Family floaties and pool toys complimentary for kids",
    crowd: "Mellow & social",
    highlights: ["Daybeds", "Kid-friendly shelf", "Tropical gardens"],
  },
  "heated pool": {
    name: "Heated Pool",
    description:
      "Year-round 30°C pool with a steam-and-soak terrace, perfect for unwinding after a day on the slopes or trails.",
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80",
    happyHours: "After-ski soak 4–6pm with complimentary mulled wine",
    crowd: "Quiet & intimate",
    highlights: ["Year-round 30°C", "Steam terrace", "Mountain views"],
  },
  "beach club": {
    name: "Beach Club",
    description:
      "A daybed-dotted beach club with a barefoot grill, all-day cocktails, and a soundtrack that builds from bossa to house.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
    happyHours: "Spritz hour 4–6pm daily",
    discounts: "Daybed credit waived for stays of 3+ nights",
    crowd: "Vibrant & loud",
    highlights: ["Daybeds", "Barefoot grill", "Sunset DJ"],
  },
  "fine dining": {
    name: "Fine Dining",
    description:
      "Chef's-counter tasting menus with seasonal, hyper-local ingredients and an extensively curated wine pairing.",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
    discounts: "10% off tasting menu when paired with sommelier wines",
    crowd: "Quiet & intimate",
    highlights: ["Tasting menu", "Wine pairing", "Chef's counter"],
  },
  "beach restaurant": {
    name: "Beach Restaurant",
    description:
      "Sand-between-your-toes dining with fresh-caught seafood, citrus-bright ceviches, and wood-fired flatbreads.",
    image:
      "https://images.unsplash.com/photo-1551218372-a8789b81b253?w=600&q=80",
    happyHours: "Catch of the day platter half-price 2–4pm",
    crowd: "Mellow & social",
    highlights: ["Fresh seafood", "Wood-fired", "Bare feet welcome"],
  },
  "creole restaurant": {
    name: "Creole Restaurant",
    description:
      "Spiced island flavors with rougaille, vindaye, and rum-poached fruits — paired with sega music nights twice a week.",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    happyHours: "Rum punch hour daily at sundown",
    crowd: "Lively & buzzing",
    highlights: ["Rougaille", "Sega nights", "Rum tasting"],
  },
  "thai cooking": {
    name: "Thai Cooking Class",
    description:
      "Market-to-wok cooking sessions with the resident Thai chefs — pad krapow, green curries, and your own signature dish to take home.",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
    discounts: "Second class half-price for couples or families",
    crowd: "Mellow & social",
    highlights: ["Market tour", "Wok skills", "Recipe booklet"],
  },
  "diving center": {
    name: "Dive Center",
    description:
      "PADI five-star center with daily drift, wreck, and reef trips. Try-dives in the lagoon for first-timers.",
    image:
      "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=600&q=80",
    discounts: "Multi-dive packages 20% off when booked on arrival",
    crowd: "Mellow & social",
    highlights: ["PADI 5★", "Drift dives", "Try-dive lagoon"],
  },
  snorkeling: {
    name: "Snorkeling",
    description:
      "Guided reef snorkels straight from the beach, with seasonal manta-ray and turtle encounters from the house reef.",
    image:
      "https://images.unsplash.com/photo-1597466765990-64ad1c35dafc?w=600&q=80",
    discounts: "Complimentary mask & fins for the duration of your stay",
    crowd: "Mellow & social",
    highlights: ["Guided reef tours", "Manta season", "House reef"],
  },
  surf: {
    name: "Surf School",
    description:
      "Daily group and private lessons with certified instructors, plus board hire for advanced surfers.",
    image:
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&q=80",
    discounts: "Lesson packages 15% off for guests staying 5+ nights",
    crowd: "Lively & buzzing",
    highlights: ["Group lessons", "Board hire", "Coaching"],
  },
  "ski-in/ski-out": {
    name: "Ski-in / Ski-out",
    description:
      "Step out of your room and onto the piste. Heated boot rooms, dedicated ski concierge, and slope-side lunch deck.",
    image:
      "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=600&q=80",
    discounts: "Lift passes 10% off when booked through concierge",
    crowd: "Vibrant & loud",
    highlights: ["Boot warmers", "Ski concierge", "Slope-side dining"],
  },
  "butler service": {
    name: "Butler Service",
    description:
      "A dedicated butler on call 24/7 — packing, unpacking, dinner reservations, and surprise turndown moments.",
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80",
    discounts: "Complimentary for Signature suites and longer stays",
    crowd: "Quiet & intimate",
    highlights: ["24/7 service", "Packing & unpacking", "Surprise turndowns"],
  },
  "water sports": {
    name: "Water Sports",
    description:
      "Non-motorized water toys complimentary for guests — paddleboards, kayaks, and Hobie cats — plus jet-ski tours at extra.",
    image:
      "https://images.unsplash.com/photo-1502933691298-84fc14542831?w=600&q=80",
    discounts: "Complimentary paddleboard & kayak hire daily",
    crowd: "Lively & buzzing",
    highlights: ["SUP", "Kayaks", "Hobie cats"],
  },
  tennis: {
    name: "Tennis Courts",
    description:
      "Floodlit hard and clay courts with a resident pro for clinics and one-on-one coaching.",
    image:
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&q=80",
    discounts: "Complimentary court time before 10am for in-house guests",
    crowd: "Mellow & social",
    highlights: ["Resident pro", "Floodlit courts", "Clinics"],
  },
  "fireplace lounge": {
    name: "Fireplace Lounge",
    description:
      "Crackling stone hearth, deep armchairs, and a curated whiskey library — the heart of the lodge after dark.",
    image:
      "https://images.unsplash.com/photo-1601933470928-c4b562e2c5a4?w=600&q=80",
    happyHours: "Après-ski 4–6pm · complimentary mulled wine & charcuterie",
    crowd: "Mellow & social",
    highlights: ["Whiskey library", "Stone hearth", "Charcuterie"],
  },
  "private pool": {
    name: "Private Pool",
    description:
      "Your own plunge or infinity pool right outside the suite. Stocked towels, sun loungers, and in-pool butler service on call.",
    image:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80",
    discounts: "Daily in-pool cocktail tasting on the house",
    crowd: "Quiet & intimate",
    highlights: ["Plunge or infinity", "Sun loungers", "In-pool service"],
  },
  cabanas: {
    name: "Beach Cabanas",
    description:
      "Private cabanas with attendants, chilled towels, fruit plates, and your own bluetooth speaker.",
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80",
    happyHours: "Cabana cocktail menu 11am–6pm",
    discounts: "Complimentary cabana with stays of 5+ nights",
    crowd: "Mellow & social",
    highlights: ["Attendant service", "Chilled towels", "Speaker on request"],
  },
  "astronomy deck": {
    name: "Astronomy Deck",
    description:
      "Rooftop observation deck with a high-powered telescope and weekly stargazing sessions led by a resident astronomer.",
    image:
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&q=80",
    happyHours: "Wednesday stargazing nights · complimentary nightcap",
    crowd: "Quiet & intimate",
    highlights: ["Telescope", "Resident astronomer", "Weekly sessions"],
  },
  "wine cellar": {
    name: "Wine Cellar",
    description:
      "A glass-walled cellar with a sommelier on hand for tastings, blind-flights, and private cellar dinners.",
    image:
      "https://images.unsplash.com/photo-1567696911980-2c0bbcb50529?w=600&q=80",
    happyHours: "Cellar tasting hour 6–7pm · complimentary for suite guests",
    crowd: "Quiet & intimate",
    highlights: ["Sommelier", "Tasting flights", "Cellar dinners"],
  },
};

/**
 * Lookup helper. Tries exact match first, then keyword contains.
 * Falls back to a generic info card if nothing matches.
 */
export function getAmenityInfo(raw: string): AmenityInfo {
  const key = raw.trim().toLowerCase();
  if (CATALOG[key]) return CATALOG[key];

  // Keyword fallbacks
  if (key.includes("bar")) return CATALOG["bar"];
  if (key.includes("spa") || key.includes("hammam"))
    return CATALOG["spa"];
  if (key.includes("yoga")) return CATALOG["yoga pavilion"];
  if (key.includes("pool")) return CATALOG["infinity pool"];
  if (key.includes("beach club")) return CATALOG["beach club"];
  if (key.includes("dining") || key.includes("restaurant"))
    return CATALOG["beach restaurant"];
  if (key.includes("dive") || key.includes("diving"))
    return CATALOG["diving center"];
  if (key.includes("snorkel")) return CATALOG["snorkeling"];
  if (key.includes("surf")) return CATALOG["surf"];
  if (key.includes("ski")) return CATALOG["ski-in/ski-out"];
  if (key.includes("butler")) return CATALOG["butler service"];
  if (key.includes("water")) return CATALOG["water sports"];
  if (key.includes("tennis")) return CATALOG["tennis"];
  if (key.includes("fire")) return CATALOG["fireplace lounge"];
  if (key.includes("cabana")) return CATALOG["cabanas"];
  if (key.includes("astron")) return CATALOG["astronomy deck"];
  if (key.includes("wine") || key.includes("cellar"))
    return CATALOG["wine cellar"];

  return {
    name: raw,
    description:
      "An on-property experience curated by the resident team — ask the concierge for daily times and any seasonal extras.",
    image:
      "https://images.unsplash.com/photo-1455587734955-081b22074882?w=600&q=80",
    crowd: "Mellow & social",
    highlights: ["Concierge details", "Seasonal extras"],
  };
}
