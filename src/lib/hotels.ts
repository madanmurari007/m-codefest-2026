import { Hotel, HotelTier, Destination, MoodCategory, RoomType } from "./types";

/* -------------------------------------------------------------------------- */
/*  Image pool — reused Unsplash photos grouped by vibe                       */
/* -------------------------------------------------------------------------- */

const IMG = {
  tropical: [
    "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80",
    "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
    "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80",
    "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&q=80",
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80",
    "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80",
    "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80",
  ],
  mountain: [
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80",
  ],
  urban: [
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    "https://images.unsplash.com/photo-1590490360182-c33d955a75fa?w=800&q=80",
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
  ],
  cultural: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    "https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&q=80",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
  ],
  safari: [
    "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&q=80",
    "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
    "https://images.unsplash.com/photo-1504432842672-1a79f78e4084?w=800&q=80",
  ],
  arctic: [
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
  ],
  wellness: [
    "https://images.unsplash.com/photo-1540555700478-4be289fbec6e?w=800&q=80",
    "https://images.unsplash.com/photo-1590490360182-c33d955a75fa?w=800&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
  ],
  vineyard: [
    "https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&q=80",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
  ],
  desert: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
  ],
};

/* -------------------------------------------------------------------------- */
/*  Factories                                                                 */
/* -------------------------------------------------------------------------- */

interface RoomSpec {
  name: string;
  desc: string;
  price?: number;
  guests: number;
  bed: string;
  size: string;
  amenities: string[];
  imgIdx?: number;
}

interface HotelSpec {
  id: string;
  name: string;
  tier: HotelTier;
  city: string;
  country: string;
  location: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  amenities: string[];
  tags: string[];
  vibe: string;
  coords: [number, number];
  imgPool: keyof typeof IMG;
  imgIdxs: [number, number, number];
  rooms: [RoomSpec, RoomSpec];
}

function H(spec: HotelSpec): Hotel {
  const images = spec.imgIdxs.map((i) => IMG[spec.imgPool][i]);
  const rooms: RoomType[] = spec.rooms.map((r, i) => ({
    id: `${spec.id}-r${i + 1}`,
    name: r.name,
    description: r.desc,
    pricePerNight: r.price ?? (i === 0 ? spec.price : Math.round(spec.price * 1.7)),
    maxGuests: r.guests,
    bedType: r.bed,
    size: r.size,
    image: IMG[spec.imgPool][r.imgIdx ?? (i === 0 ? spec.imgIdxs[0] : spec.imgIdxs[1])],
    amenities: r.amenities,
  }));

  return {
    id: spec.id,
    name: spec.name,
    tier: spec.tier,
    location: spec.location,
    city: spec.city,
    country: spec.country,
    description: spec.description,
    image: images[0],
    images,
    rating: spec.rating,
    reviewCount: spec.reviews,
    pricePerNight: spec.price,
    currency: "USD",
    amenities: spec.amenities,
    tags: spec.tags,
    vibe: spec.vibe,
    coordinates: { lat: spec.coords[0], lng: spec.coords[1] },
    roomTypes: rooms,
  };
}

/* -------------------------------------------------------------------------- */
/*  Hotel catalog — 50 brand-neutral properties grouped by vibe               */
/* -------------------------------------------------------------------------- */

export const hotels: Hotel[] = [
  /* ----------------------- Tropical / Beach (12) ------------------------- */
  H({
    id: "hotel-1", name: "The Azure Cove Resort", tier: "Signature",
    city: "Malé Atoll", country: "Maldives", location: "Maldives",
    description: "An overwater paradise with crystal-clear lagoons, private villas perched above turquoise waters, and world-class diving. Each villa features glass floors revealing vibrant coral reefs below.",
    price: 850, rating: 4.9, reviews: 1247,
    amenities: ["Private Pool", "Spa", "Diving Center", "Fine Dining", "Butler Service", "Water Sports"],
    tags: ["tropical", "beach", "romantic", "overwater", "diving", "serene", "scenic"],
    vibe: "Romantic overwater paradise",
    coords: [4.1755, 73.5093], imgPool: "tropical", imgIdxs: [0, 1, 2],
    rooms: [
      { name: "Overwater Villa", desc: "Stunning overwater villa with glass floor panels and private deck", guests: 2, bed: "King", size: "95 sqm", amenities: ["Glass Floor", "Private Deck", "Outdoor Shower", "Minibar"] },
      { name: "Sunset Water Suite", desc: "Premium overwater suite facing the sunset with personal butler", price: 2100, guests: 2, bed: "King", size: "200 sqm", amenities: ["Butler Service", "Wine Cellar", "Jacuzzi", "Telescope"] },
    ],
  }),
  H({
    id: "hotel-2", name: "Lagoon Pearl Resort", tier: "Signature",
    city: "Bora Bora", country: "French Polynesia", location: "Bora Bora",
    description: "Suspended above one of the most photographed lagoons in the world, this hideaway pairs Polynesian craftsmanship with sweeping views of Mount Otemanu and barefoot beachfront dining.",
    price: 1100, rating: 4.9, reviews: 612,
    amenities: ["Lagoon Pool", "Snorkeling", "Polynesian Spa", "Beach Restaurant", "Private Boat", "Sunset Cruise"],
    tags: ["tropical", "beach", "romantic", "overwater", "scenic", "honeymoon", "serene"],
    vibe: "Iconic lagoon honeymoon escape",
    coords: [-16.5004, -151.7415], imgPool: "tropical", imgIdxs: [2, 4, 5],
    rooms: [
      { name: "Lagoon Bungalow", desc: "Polynesian-themed bungalow steps from the lagoon", guests: 2, bed: "King", size: "80 sqm", amenities: ["Lagoon Access", "Outdoor Shower", "Private Terrace", "Snorkel Gear"] },
      { name: "Otemanu View Suite", desc: "Spacious suite facing Mount Otemanu with a private plunge pool", price: 1850, guests: 3, bed: "King", size: "160 sqm", amenities: ["Plunge Pool", "Mountain View", "Outdoor Lounge", "Mini Bar"] },
    ],
  }),
  H({
    id: "hotel-3", name: "Granite Bay Hideaway", tier: "Signature",
    city: "Praslin", country: "Seychelles", location: "Seychelles",
    description: "A secluded retreat tucked between dramatic granite boulders and powder-soft sands. Open-air villas spill onto a private cove where giant tortoises wander at dawn.",
    price: 920, rating: 4.8, reviews: 488,
    amenities: ["Private Cove", "Spa", "Yoga Pavilion", "Beach Restaurant", "Boat Tours", "Snorkeling"],
    tags: ["tropical", "beach", "serene", "nature", "romantic", "wellness", "scenic"],
    vibe: "Boulder-strewn beach escape",
    coords: [-4.3252, 55.7331], imgPool: "tropical", imgIdxs: [3, 5, 0],
    rooms: [
      { name: "Beach Villa", desc: "Open-plan villa with thatched roof and private patio onto the sand", guests: 2, bed: "King", size: "90 sqm", amenities: ["Beach Access", "Outdoor Bath", "Private Patio", "Ocean View"] },
      { name: "Boulder Hideout Suite", desc: "Suite carved into the granite hillside with sweeping cove views", price: 1620, guests: 3, bed: "King", size: "140 sqm", amenities: ["Plunge Pool", "Hillside View", "Outdoor Lounge", "Butler"] },
    ],
  }),
  H({
    id: "hotel-4", name: "Coral Sands Retreat", tier: "Premium",
    city: "Le Morne", country: "Mauritius", location: "Mauritius",
    description: "A laid-back beachfront retreat where palm-fringed sands meet the warm Indian Ocean. Daily kitesurfing clinics, sega music nights, and a creole-inspired farm-to-plate kitchen.",
    price: 480, rating: 4.7, reviews: 1342,
    amenities: ["Kitesurfing", "Spa", "Creole Restaurant", "Lagoon Pool", "Beach Yoga", "Boat Tours"],
    tags: ["tropical", "beach", "adventure", "foodie", "scenic", "family", "active"],
    vibe: "Active beachfront playground",
    coords: [-20.4500, 57.3167], imgPool: "tropical", imgIdxs: [4, 1, 6],
    rooms: [
      { name: "Garden Pavilion", desc: "Tropical pavilion with private patio surrounded by frangipani", guests: 2, bed: "Queen", size: "45 sqm", amenities: ["Garden View", "Outdoor Patio", "Rain Shower", "Minibar"] },
      { name: "Ocean Front Suite", desc: "Direct-on-beach suite with terrace and outdoor shower", price: 820, guests: 4, bed: "King", size: "85 sqm", amenities: ["Beach Front", "Outdoor Shower", "Family Layout", "Sun Loungers"] },
    ],
  }),
  H({
    id: "hotel-5", name: "Lotus Reef Villas", tier: "Signature",
    city: "Yasawa Islands", country: "Fiji", location: "Fiji",
    description: "Reach this barefoot hideaway only by seaplane. Twelve villas open onto a private reef, with traditional kava ceremonies under the stars and dawn snorkels with manta rays.",
    price: 990, rating: 4.9, reviews: 322,
    amenities: ["Private Reef", "Seaplane Transfer", "Spa", "Manta Snorkeling", "Bonfire Dinners", "Cultural Tours"],
    tags: ["tropical", "beach", "remote", "serene", "snorkeling", "romantic", "unique"],
    vibe: "Remote barefoot island getaway",
    coords: [-16.7833, 177.4167], imgPool: "tropical", imgIdxs: [5, 0, 3],
    rooms: [
      { name: "Reef Villa", desc: "Stilted villa over the lagoon with direct snorkel access", guests: 2, bed: "King", size: "75 sqm", amenities: ["Reef Access", "Outdoor Deck", "Snorkel Gear", "Hammock"] },
      { name: "Beach Pool Villa", desc: "Two-bedroom villa with private infinity pool meeting the sand", price: 1780, guests: 4, bed: "King", size: "150 sqm", amenities: ["Private Pool", "Beach Access", "Outdoor Kitchen", "Butler"] },
    ],
  }),
  H({
    id: "hotel-6", name: "Bamboo Cove Resort", tier: "Premium",
    city: "Uluwatu", country: "Indonesia", location: "Bali",
    description: "Perched on Uluwatu's cliffs above an iconic surf break. Bamboo-and-stone villas, cliff-edge yoga shalas, and a hidden beach club reached by inclined lift.",
    price: 420, rating: 4.7, reviews: 1908,
    amenities: ["Beach Club", "Spa", "Yoga Shala", "Surf School", "Cliff Pool", "Sunset Bar"],
    tags: ["tropical", "beach", "wellness", "surf", "scenic", "vibrant", "yoga"],
    vibe: "Cliffside surf and yoga retreat",
    coords: [-8.8295, 115.0850], imgPool: "tropical", imgIdxs: [6, 2, 4],
    rooms: [
      { name: "Bamboo Villa", desc: "Open-air bamboo villa with rice paddy view and outdoor bath", guests: 2, bed: "Queen", size: "60 sqm", amenities: ["Paddy View", "Outdoor Bath", "Yoga Mat", "Tropical Garden"] },
      { name: "Cliff Edge Suite", desc: "Suite teetering over the cliff with infinity plunge pool", price: 720, guests: 2, bed: "King", size: "110 sqm", amenities: ["Cliff View", "Plunge Pool", "Sun Deck", "Mini Bar"] },
    ],
  }),
  H({
    id: "hotel-7", name: "Andaman Sky Resort", tier: "Premium",
    city: "Phuket", country: "Thailand", location: "Phuket",
    description: "A multi-level beach resort climbing the limestone hills of Kata Noi. Sky-high infinity pool, Thai cooking classes, and longtail boat tours of the Phi Phi archipelago.",
    price: 360, rating: 4.6, reviews: 2671,
    amenities: ["Infinity Pool", "Spa", "Thai Cooking", "Beach Club", "Boat Tours", "Muay Thai"],
    tags: ["tropical", "beach", "foodie", "family", "adventure", "vibrant", "scenic"],
    vibe: "Lively Andaman beach hub",
    coords: [7.8167, 98.3000], imgPool: "tropical", imgIdxs: [1, 3, 5],
    rooms: [
      { name: "Sea View Room", desc: "Bright room with balcony overlooking the bay", guests: 2, bed: "King", size: "42 sqm", amenities: ["Sea View", "Balcony", "Rain Shower", "Minibar"] },
      { name: "Pool Access Suite", desc: "Ground-floor suite with private steps into the cascading pool", price: 620, guests: 3, bed: "King", size: "75 sqm", amenities: ["Pool Access", "Lounge Area", "Outdoor Shower", "Beach Bag"] },
    ],
  }),
  H({
    id: "hotel-8", name: "Moonlit Lagoon Resort", tier: "Signature",
    city: "Baa Atoll", country: "Maldives", location: "Maldives",
    description: "A UNESCO biosphere island where bioluminescent plankton lights the shoreline after dark. Each villa has an astronomer-guided telescope and a chef-on-call dining service.",
    price: 1050, rating: 4.9, reviews: 408,
    amenities: ["Bio-Reserve", "Astronomy Deck", "Spa", "Private Dining", "Diving", "Yoga Pavilion"],
    tags: ["tropical", "beach", "serene", "unique", "stargazing", "wellness", "diving"],
    vibe: "Stargazer's lagoon hideaway",
    coords: [5.2167, 73.0500], imgPool: "tropical", imgIdxs: [2, 0, 5],
    rooms: [
      { name: "Lagoon Villa", desc: "Glass-walled villa with private deck steps from the bioluminescent shore", guests: 2, bed: "King", size: "100 sqm", amenities: ["Bio Beach", "Telescope", "Outdoor Bath", "Mini Library"] },
      { name: "Sky-Deck Villa", desc: "Two-story villa with rooftop astronomy deck and plunge pool", price: 1880, guests: 3, bed: "King", size: "180 sqm", amenities: ["Roof Deck", "Plunge Pool", "Astronomer Visit", "Butler"] },
    ],
  }),
  H({
    id: "hotel-9", name: "Garden Isle Retreat", tier: "Premium",
    city: "Princeville", country: "United States", location: "Kauai, Hawaii",
    description: "Set against the cathedral cliffs of Kauai's north shore, this retreat blends lush tropical gardens, taro-field farm dinners, and easy access to the Na Pali coast.",
    price: 520, rating: 4.7, reviews: 1106,
    amenities: ["Cliff View", "Spa", "Farm Restaurant", "Garden Tours", "Helicopter Tours", "Yoga"],
    tags: ["tropical", "nature", "scenic", "foodie", "family", "wellness", "romantic"],
    vibe: "Lush Hawaiian garden escape",
    coords: [22.2230, -159.4839], imgPool: "tropical", imgIdxs: [3, 6, 4],
    rooms: [
      { name: "Garden Room", desc: "Bright room overlooking tropical gardens and waterfalls", guests: 2, bed: "King", size: "40 sqm", amenities: ["Garden View", "Lanai", "Mini Fridge", "Rain Shower"] },
      { name: "Cliff Suite", desc: "Corner suite with cliff and ocean views and outdoor soaking tub", price: 920, guests: 4, bed: "King", size: "95 sqm", amenities: ["Cliff View", "Outdoor Tub", "Sitting Area", "Wet Bar"] },
    ],
  }),
  H({
    id: "hotel-10", name: "Hibiscus Lagoon Hotel", tier: "Premium",
    city: "Mo'orea", country: "French Polynesia", location: "Mo'orea",
    description: "A jewel of an island hotel framed by a coral garden lagoon and pineapple-clad valleys. Outrigger canoe breakfasts and shark-and-ray feedings on the house reef.",
    price: 540, rating: 4.7, reviews: 833,
    amenities: ["Coral Lagoon", "Outrigger Tours", "Spa", "Polynesian Show", "Snorkeling", "Hiking"],
    tags: ["tropical", "beach", "adventure", "scenic", "foodie", "family", "snorkeling"],
    vibe: "Lagoon-laced island playground",
    coords: [-17.5000, -149.8333], imgPool: "tropical", imgIdxs: [4, 0, 2],
    rooms: [
      { name: "Lagoon-Front Room", desc: "Room with steps into the coral-rich lagoon", guests: 2, bed: "King", size: "48 sqm", amenities: ["Lagoon Access", "Snorkel Gear", "Outdoor Shower", "Minibar"] },
      { name: "Garden Pool Suite", desc: "Suite in the gardens with private plunge pool and outdoor dining", price: 950, guests: 3, bed: "King", size: "100 sqm", amenities: ["Plunge Pool", "Garden View", "Outdoor Dining", "Bicycle"] },
    ],
  }),
  H({
    id: "hotel-11", name: "Cabo Cove Resort", tier: "Premium",
    city: "Cabo San Lucas", country: "Mexico", location: "Cabo San Lucas",
    description: "Where the desert meets the Sea of Cortez. Stone-and-timber casitas, a sunken sunset pool, and whale watching from your terrace from December through March.",
    price: 460, rating: 4.6, reviews: 1745,
    amenities: ["Sunset Pool", "Spa", "Whale Watching", "Beach Club", "Mezcal Bar", "Sport Fishing"],
    tags: ["tropical", "beach", "scenic", "foodie", "active", "vibrant", "romantic"],
    vibe: "Desert-meets-ocean playground",
    coords: [22.8905, -109.9167], imgPool: "tropical", imgIdxs: [5, 4, 1],
    rooms: [
      { name: "Cove View Casita", desc: "Adobe-style casita with terrace overlooking the cove", guests: 2, bed: "King", size: "50 sqm", amenities: ["Cove View", "Terrace", "Fire Pit", "Mini Bar"] },
      { name: "Beach Hacienda Suite", desc: "Multi-room hacienda with private plunge pool steps from the sand", price: 880, guests: 5, bed: "King + Queens", size: "150 sqm", amenities: ["Plunge Pool", "Beach Access", "Living Room", "Outdoor Kitchen"] },
    ],
  }),
  H({
    id: "hotel-12", name: "Caribbean Sands Resort", tier: "Signature",
    city: "Providenciales", country: "Turks and Caicos", location: "Turks and Caicos",
    description: "Twelve miles of powder-white Grace Bay Beach right outside your door. Glass-bottom kayaks, conch shack lunches, and a juice-cleanse spa menu.",
    price: 780, rating: 4.8, reviews: 943,
    amenities: ["Beach Cabanas", "Spa", "Glass Kayaks", "Conch Shack", "Tennis", "Snorkeling"],
    tags: ["tropical", "beach", "romantic", "scenic", "wellness", "family", "active"],
    vibe: "Powder-sand Caribbean classic",
    coords: [21.8000, -72.2833], imgPool: "tropical", imgIdxs: [0, 5, 3],
    rooms: [
      { name: "Beach Front Studio", desc: "Studio with private patio opening onto Grace Bay", guests: 2, bed: "King", size: "55 sqm", amenities: ["Beach Access", "Patio", "Kitchenette", "Bikes"] },
      { name: "Two-Bed Beach Suite", desc: "Family-sized suite with two bedrooms and panoramic terrace", price: 1380, guests: 5, bed: "King + Twins", size: "120 sqm", amenities: ["Beach Front", "Two Bedrooms", "Full Kitchen", "Terrace"] },
    ],
  }),

  /* -------------------------- Mountain / Alpine (5) ---------------------- */
  H({
    id: "hotel-13", name: "Alpine Summit Lodge", tier: "Premium",
    city: "Zermatt", country: "Switzerland", location: "Swiss Alps",
    description: "A cozy mountain retreat nestled at the foot of the Matterhorn, offering ski-in/ski-out access, rustic-chic interiors with roaring fireplaces, and panoramic alpine views.",
    price: 450, rating: 4.8, reviews: 892,
    amenities: ["Ski-in/Ski-out", "Spa", "Fireplace Lounge", "Mountain Restaurant", "Heated Pool", "Ski Storage"],
    tags: ["mountain", "winter", "cozy", "skiing", "rustic", "scenic", "adventure"],
    vibe: "Matterhorn ski-in/ski-out chalet",
    coords: [46.0207, 7.7491], imgPool: "mountain", imgIdxs: [0, 1, 2],
    rooms: [
      { name: "Alpine Deluxe Room", desc: "Warm wood-paneled room with Matterhorn view", guests: 2, bed: "Queen", size: "40 sqm", amenities: ["Mountain View", "Fireplace", "Minibar", "Balcony"] },
      { name: "Summit Suite", desc: "Spacious suite with separate living area and panoramic windows", price: 750, guests: 4, bed: "King", size: "85 sqm", amenities: ["Panoramic View", "Fireplace", "Kitchenette", "Private Sauna"] },
    ],
  }),
  H({
    id: "hotel-14", name: "Glacier Pine Lodge", tier: "Premium",
    city: "Banff", country: "Canada", location: "Banff National Park",
    description: "A timber-framed lodge on the doorstep of glacier-fed lakes and Banff's wildlife corridors. Heli-skiing in winter, canoe-and-fondue evenings, grizzly tracking with park naturalists.",
    price: 520, rating: 4.8, reviews: 765,
    amenities: ["Heli-Skiing", "Spa", "Lake Canoes", "Wildlife Tours", "Fireside Lounge", "Hot Springs"],
    tags: ["mountain", "winter", "adventure", "nature", "cozy", "scenic", "wildlife"],
    vibe: "Rocky Mountain wildlife lodge",
    coords: [51.4968, -115.9281], imgPool: "mountain", imgIdxs: [1, 2, 0],
    rooms: [
      { name: "Lakeview Cabin", desc: "Standalone cabin with timber beams and lake-facing porch", guests: 2, bed: "King", size: "55 sqm", amenities: ["Lake View", "Porch", "Wood Stove", "Hot Tub"] },
      { name: "Glacier Lodge Suite", desc: "Two-room suite with floor-to-ceiling glacier windows", price: 960, guests: 4, bed: "King + Sofa", size: "100 sqm", amenities: ["Glacier View", "Fireplace", "Snowshoes", "Telescope"] },
    ],
  }),
  H({
    id: "hotel-15", name: "Powder Peak Chalet", tier: "Signature",
    city: "Aspen", country: "United States", location: "Aspen, Colorado",
    description: "A boutique chalet steps from Aspen's Silver Queen Gondola. Powder-day breakfast deliveries, private ski concierge, and a candlelit subterranean spa with a snow grotto.",
    price: 1200, rating: 4.9, reviews: 401,
    amenities: ["Ski Concierge", "Snow Grotto Spa", "Heated Pool", "Steakhouse", "Champagne Bar", "Cigar Lounge"],
    tags: ["mountain", "winter", "skiing", "scenic", "romantic", "cozy", "foodie"],
    vibe: "Powder-day boutique chalet",
    coords: [39.1911, -106.8175], imgPool: "mountain", imgIdxs: [2, 0, 1],
    rooms: [
      { name: "Mountain Studio", desc: "Cozy studio with stone fireplace and ski-mountain view", guests: 2, bed: "King", size: "45 sqm", amenities: ["Mountain View", "Fireplace", "Heated Floor", "Mini Bar"] },
      { name: "Summit Penthouse", desc: "Top-floor penthouse with private rooftop hot tub", price: 2200, guests: 5, bed: "King + Twins", size: "180 sqm", amenities: ["Rooftop Hot Tub", "Two Fireplaces", "Living Room", "Butler"] },
    ],
  }),
  H({
    id: "hotel-16", name: "Mont Blanc Refuge", tier: "Premium",
    city: "Chamonix", country: "France", location: "Chamonix, French Alps",
    description: "A modern-rustic refuge on the slopes of Mont Blanc. Heated saltwater pool framing the glacier, French-Savoyard kitchen, and an avalanche-trained guide on staff.",
    price: 580, rating: 4.8, reviews: 612,
    amenities: ["Saltwater Pool", "Spa", "Mountain Guide", "Savoyard Restaurant", "Ski Room", "Wine Cellar"],
    tags: ["mountain", "winter", "scenic", "adventure", "foodie", "cozy", "romantic"],
    vibe: "Glacier-view refuge",
    coords: [45.9237, 6.8694], imgPool: "mountain", imgIdxs: [0, 2, 1],
    rooms: [
      { name: "Mont Blanc Room", desc: "Glass-walled room facing the glacier with bath-with-a-view", guests: 2, bed: "King", size: "50 sqm", amenities: ["Glacier View", "Bath View", "Fireplace", "Heated Floor"] },
      { name: "Glacier Suite", desc: "Loft-style suite with private sauna and panoramic ridge view", price: 1080, guests: 3, bed: "King", size: "95 sqm", amenities: ["Private Sauna", "Ridge View", "Living Room", "Wine Fridge"] },
    ],
  }),
  H({
    id: "hotel-17", name: "Andean Stars Lodge", tier: "Premium",
    city: "El Chaltén", country: "Argentina", location: "Patagonia",
    description: "A solar-powered lodge in the shadow of Mount Fitz Roy. Glacier treks at dawn, lamb-roast asados at sunset, and dark-sky stargazing without another building in sight.",
    price: 380, rating: 4.8, reviews: 388,
    amenities: ["Glacier Treks", "Stargazing", "Asado Dinner", "Wine Cellar", "Trekking Guide", "Bonfire Lounge"],
    tags: ["mountain", "adventure", "nature", "scenic", "remote", "stargazing", "foodie"],
    vibe: "Wild Patagonian trekkers' lodge",
    coords: [-49.3315, -72.8920], imgPool: "mountain", imgIdxs: [1, 0, 2],
    rooms: [
      { name: "Trekker Cabin", desc: "Cozy timber cabin with peat stove and Fitz Roy view", guests: 2, bed: "Queen", size: "38 sqm", amenities: ["Mountain View", "Peat Stove", "Drying Room", "Trail Maps"] },
      { name: "Star Loft", desc: "Loft cabin with skylight directly over the bed for stargazing", price: 680, guests: 3, bed: "King + Single", size: "70 sqm", amenities: ["Skylight Bed", "Lounge", "Wood Stove", "Binoculars"] },
    ],
  }),

  /* -------------------------------- Urban (10) --------------------------- */
  H({
    id: "hotel-18", name: "Sakura Garden Hotel", tier: "Premium",
    city: "Tokyo", country: "Japan", location: "Tokyo, Japan",
    description: "A sleek, ultra-modern hotel in the heart of Shibuya, blending Japanese zen aesthetics with cutting-edge design. Features a rooftop infinity pool overlooking the Tokyo skyline.",
    price: 380, rating: 4.7, reviews: 2134,
    amenities: ["Rooftop Pool", "Spa", "Fitness Center", "3 Restaurants", "Bar", "Concierge"],
    tags: ["urban", "modern", "culture", "nightlife", "zen", "skyline", "foodie"],
    vibe: "Shibuya skyline retreat",
    coords: [35.6762, 139.6503], imgPool: "urban", imgIdxs: [0, 1, 2],
    rooms: [
      { name: "Zen Studio", desc: "Minimalist room with tatami area and city view", guests: 2, bed: "King", size: "35 sqm", amenities: ["City View", "Rain Shower", "Smart Controls", "Tea Set"] },
      { name: "Tokyo Sky Suite", desc: "Corner suite with wrap-around windows and soaking tub", price: 680, guests: 2, bed: "King", size: "70 sqm", amenities: ["Skyline View", "Soaking Tub", "Living Room", "Sake Bar"] },
    ],
  }),
  H({
    id: "hotel-19", name: "Manhattan Skyline Hotel", tier: "Premium",
    city: "New York", country: "United States", location: "New York City, USA",
    description: "A sophisticated urban sanctuary in Midtown Manhattan with floor-to-ceiling windows, an acclaimed rooftop restaurant, and a world-class spa. Steps from Central Park, Times Square, and Broadway.",
    price: 420, rating: 4.6, reviews: 3421,
    amenities: ["Rooftop Bar", "Spa", "Fitness Center", "Restaurant", "Concierge", "Business Center"],
    tags: ["urban", "skyline", "business", "nightlife", "culture", "shopping", "theater"],
    vibe: "Midtown skyline classic",
    coords: [40.7580, -73.9855], imgPool: "urban", imgIdxs: [3, 4, 5],
    rooms: [
      { name: "City View Room", desc: "Modern room with Manhattan skyline views", guests: 2, bed: "King", size: "38 sqm", amenities: ["City View", "Marble Bath", "Work Desk", "Minibar"] },
      { name: "Park View Suite", desc: "Expansive suite with Central Park views and butler pantry", price: 890, guests: 3, bed: "King", size: "80 sqm", amenities: ["Park View", "Living Room", "Butler Pantry", "Soaking Tub"] },
    ],
  }),
  H({
    id: "hotel-20", name: "Harbor Lights Hotel", tier: "Comfort",
    city: "Sydney", country: "Australia", location: "Sydney, Australia",
    description: "A vibrant waterfront hotel overlooking Sydney Harbour, with direct views of the Opera House and Harbour Bridge. Perfect base for exploring the city's beaches, culture, and culinary scene.",
    price: 280, rating: 4.5, reviews: 2890,
    amenities: ["Harbor View", "Pool", "Fitness Center", "Restaurant", "Bar", "Tour Desk"],
    tags: ["urban", "coastal", "culture", "nightlife", "beach", "foodie", "iconic"],
    vibe: "Harbour-side city base",
    coords: [-33.8568, 151.2153], imgPool: "urban", imgIdxs: [3, 5, 4],
    rooms: [
      { name: "Harbor View Room", desc: "Bright room with Opera House and harbor views", guests: 2, bed: "King", size: "32 sqm", amenities: ["Harbor View", "Work Desk", "Rain Shower", "Minibar"] },
      { name: "Bridge Suite", desc: "Corner suite with dual views of Opera House and Harbour Bridge", price: 520, guests: 3, bed: "King", size: "65 sqm", amenities: ["Dual Views", "Living Area", "Soaking Tub", "Bar Area"] },
    ],
  }),
  H({
    id: "hotel-21", name: "Seine View Maison", tier: "Premium",
    city: "Paris", country: "France", location: "Paris, France",
    description: "A 19th-century townhouse on the Left Bank with a glass-roofed courtyard, in-house pâtissier, and rooms overlooking the Seine. Walk to Notre-Dame, the Louvre, and Saint-Germain bistros.",
    price: 540, rating: 4.8, reviews: 1622,
    amenities: ["Courtyard Garden", "Pâtisserie", "Spa", "Wine Bar", "Library Lounge", "Bicycle Rental"],
    tags: ["urban", "romantic", "cultural", "foodie", "historic", "scenic", "literary"],
    vibe: "Left Bank townhouse romance",
    coords: [48.8566, 2.3522], imgPool: "urban", imgIdxs: [1, 2, 4],
    rooms: [
      { name: "Maison Room", desc: "Parisian room with parquet floor and Juliet balcony", guests: 2, bed: "Queen", size: "30 sqm", amenities: ["Juliet Balcony", "Antique Desk", "Minibar", "Bathrobes"] },
      { name: "Seine View Suite", desc: "Top-floor suite with river-facing terrace and clawfoot tub", price: 980, guests: 3, bed: "King", size: "70 sqm", amenities: ["River View", "Terrace", "Clawfoot Tub", "Champagne Service"] },
    ],
  }),
  H({
    id: "hotel-22", name: "Soho Townhouse Hotel", tier: "Premium",
    city: "London", country: "United Kingdom", location: "London, UK",
    description: "A trio of Georgian townhouses stitched together in Soho. Velvet snug bars, late-night kitchen, and a private screening room — equally good for theatre nights and creative escapes.",
    price: 490, rating: 4.7, reviews: 1411,
    amenities: ["Screening Room", "Members Bar", "Spa", "Late-Night Kitchen", "Library", "Concierge"],
    tags: ["urban", "vibrant", "cultural", "foodie", "literary", "nightlife", "historic"],
    vibe: "Soho creatives' townhouse",
    coords: [51.5142, -0.1339], imgPool: "urban", imgIdxs: [4, 1, 5],
    rooms: [
      { name: "Townhouse Room", desc: "Bookshelf-lined room with bay window and reading nook", guests: 2, bed: "Queen", size: "28 sqm", amenities: ["Bay Window", "Reading Nook", "Smart TV", "Mini Library"] },
      { name: "Top Floor Loft", desc: "Skylit loft suite with freestanding tub and lounge area", price: 880, guests: 3, bed: "King", size: "62 sqm", amenities: ["Skylight", "Freestanding Tub", "Lounge", "Record Player"] },
    ],
  }),
  H({
    id: "hotel-23", name: "Marina Sky Hotel", tier: "Signature",
    city: "Singapore", country: "Singapore", location: "Marina Bay, Singapore",
    description: "A glass-and-greenery tower above Singapore's Marina Bay, with a 200-meter sky pool, hawker-style chef's table, and orchid-filled atrium connecting to the Gardens by the Bay.",
    price: 620, rating: 4.8, reviews: 2188,
    amenities: ["Sky Pool", "Spa", "Hawker Chef's Table", "Atrium Garden", "Sky Lounge", "Gym"],
    tags: ["urban", "skyline", "modern", "foodie", "scenic", "family", "iconic"],
    vibe: "Skyline-defining Marina tower",
    coords: [1.2839, 103.8607], imgPool: "urban", imgIdxs: [2, 0, 5],
    rooms: [
      { name: "Bay View Room", desc: "Floor-to-ceiling glass room facing the Marina skyline", guests: 2, bed: "King", size: "44 sqm", amenities: ["Bay View", "Smart Controls", "Rain Shower", "Minibar"] },
      { name: "Sky Pool Suite", desc: "Suite with direct sky-pool access and a private cabana", price: 1180, guests: 3, bed: "King", size: "92 sqm", amenities: ["Pool Access", "Cabana", "Living Area", "Telescope"] },
    ],
  }),
  H({
    id: "hotel-24", name: "Victoria Heights Hotel", tier: "Premium",
    city: "Hong Kong", country: "Hong Kong SAR", location: "Hong Kong",
    description: "Perched on the Peak with cable-car access to Central. Dim sum trolleys at breakfast, harbor-fireworks balconies, and a tea sommelier on staff.",
    price: 460, rating: 4.7, reviews: 1733,
    amenities: ["Peak View", "Tea Lounge", "Dim Sum Restaurant", "Spa", "Helipad Tours", "Library"],
    tags: ["urban", "skyline", "cultural", "foodie", "scenic", "iconic", "vibrant"],
    vibe: "Peak-top harbour panorama",
    coords: [22.3193, 114.1694], imgPool: "urban", imgIdxs: [3, 2, 1],
    rooms: [
      { name: "Peak Room", desc: "Skyline room with floor-to-ceiling windows over Victoria Harbour", guests: 2, bed: "King", size: "40 sqm", amenities: ["Harbour View", "Smart TV", "Rain Shower", "Tea Set"] },
      { name: "Harbor Suite", desc: "Corner suite with panoramic balcony and freestanding tub", price: 880, guests: 3, bed: "King", size: "80 sqm", amenities: ["Panoramic View", "Balcony", "Freestanding Tub", "Walk-in Closet"] },
    ],
  }),
  H({
    id: "hotel-25", name: "Dune Mirage Skyscraper", tier: "Signature",
    city: "Dubai", country: "United Arab Emirates", location: "Dubai, UAE",
    description: "A sculptural tower in Downtown Dubai with a desert-themed atrium, gold-leafed afternoon tea, and direct-elevator access to the world's tallest observation deck.",
    price: 720, rating: 4.8, reviews: 2410,
    amenities: ["Sky Pool", "Gold Afternoon Tea", "Hammam Spa", "Skyline Bar", "Falconry", "Concierge"],
    tags: ["urban", "skyline", "desert", "vibrant", "iconic", "modern", "shopping"],
    vibe: "Sculptural Downtown landmark",
    coords: [25.2048, 55.2708], imgPool: "urban", imgIdxs: [4, 5, 3],
    rooms: [
      { name: "Skyline Room", desc: "Floor-to-ceiling room facing the Burj Khalifa", guests: 2, bed: "King", size: "48 sqm", amenities: ["Burj View", "Smart Controls", "Rain Shower", "Mini Bar"] },
      { name: "Desert Sky Suite", desc: "Two-room suite with dune-themed art and private terrace", price: 1400, guests: 3, bed: "King", size: "110 sqm", amenities: ["Private Terrace", "Hammam Bath", "Lounge", "Butler"] },
    ],
  }),
  H({
    id: "hotel-26", name: "Pearl River Riverside", tier: "Premium",
    city: "Shanghai", country: "China", location: "Shanghai, China",
    description: "Anchored on the Huangpu River with a glass-bottomed sky walk over The Bund. Old Shanghai jazz lounge, dumpling-making classes, and tai-chi pavilions at sunrise.",
    price: 380, rating: 4.6, reviews: 1922,
    amenities: ["River View", "Jazz Lounge", "Tai Chi Pavilion", "Spa", "Sky Walk", "Dumpling Class"],
    tags: ["urban", "cultural", "foodie", "scenic", "skyline", "historic", "modern"],
    vibe: "Riverside Bund classic",
    coords: [31.2304, 121.4737], imgPool: "urban", imgIdxs: [2, 3, 1],
    rooms: [
      { name: "Bund Room", desc: "Riverside room with floor-to-ceiling views of The Bund", guests: 2, bed: "King", size: "42 sqm", amenities: ["River View", "Marble Bath", "Smart Controls", "Tea Set"] },
      { name: "Riverside Suite", desc: "Two-room suite with private balcony over the Huangpu", price: 720, guests: 3, bed: "King", size: "85 sqm", amenities: ["Private Balcony", "Sitting Room", "Soaking Tub", "Wet Bar"] },
    ],
  }),
  H({
    id: "hotel-27", name: "Gothic Quarter House", tier: "Premium",
    city: "Barcelona", country: "Spain", location: "Barcelona, Spain",
    description: "A 14th-century palace turned design hotel in the Gothic Quarter. Tapas master classes in the medieval cellar, rooftop pool over the cathedral, and a perfumer in residence.",
    price: 420, rating: 4.7, reviews: 1554,
    amenities: ["Rooftop Pool", "Tapas Class", "Perfumery", "Spa", "Library Lounge", "Bike Tours"],
    tags: ["urban", "cultural", "historic", "foodie", "romantic", "artistic", "vibrant"],
    vibe: "Medieval design-house hideaway",
    coords: [41.3851, 2.1734], imgPool: "urban", imgIdxs: [5, 1, 0],
    rooms: [
      { name: "Patio Room", desc: "Cool stone room facing the interior patio with citrus trees", guests: 2, bed: "Queen", size: "32 sqm", amenities: ["Patio View", "Stone Walls", "Mini Bar", "Bath Salts"] },
      { name: "Cathedral Suite", desc: "Top-floor suite with private terrace facing the cathedral spires", price: 880, guests: 3, bed: "King", size: "75 sqm", amenities: ["Cathedral View", "Private Terrace", "Soaking Tub", "Wine Fridge"] },
    ],
  }),

  /* ---------------------- Cultural / Historic (6) ----------------------- */
  H({
    id: "hotel-28", name: "Bamboo Forest Ryokan", tier: "Signature",
    city: "Kyoto", country: "Japan", location: "Kyoto, Japan",
    description: "A serene ryokan-style hotel hidden within an ancient bamboo grove, offering traditional kaiseki cuisine, private onsen baths, and tea ceremony experiences in a setting of extraordinary natural beauty.",
    price: 620, rating: 4.9, reviews: 876,
    amenities: ["Private Onsen", "Kaiseki Dining", "Tea Ceremony", "Zen Garden", "Meditation", "Bamboo Walk"],
    tags: ["zen", "cultural", "nature", "serene", "traditional", "wellness", "romantic"],
    vibe: "Ancient ryokan in a bamboo grove",
    coords: [35.0116, 135.7681], imgPool: "cultural", imgIdxs: [0, 2, 1],
    rooms: [
      { name: "Tatami Suite", desc: "Traditional tatami room with garden view and private onsen", guests: 2, bed: "Futon (King)", size: "50 sqm", amenities: ["Garden View", "Private Onsen", "Tatami", "Tea Set"] },
      { name: "Imperial Bamboo Villa", desc: "Standalone villa within the bamboo grove with wraparound engawa", price: 1100, guests: 3, bed: "King", size: "120 sqm", amenities: ["Private Garden", "Two Onsens", "Dining Room", "Butler"] },
    ],
  }),
  H({
    id: "hotel-29", name: "Desert Mirage Oasis", tier: "Signature",
    city: "Marrakech", country: "Morocco", location: "Marrakech, Morocco",
    description: "A palatial riad-style hotel in the heart of Marrakech, featuring ornate mosaic courtyards, a rooftop terrace overlooking the Atlas Mountains, and an authentic hammam spa experience.",
    price: 390, rating: 4.8, reviews: 1089,
    amenities: ["Hammam Spa", "Rooftop Terrace", "Courtyard Pool", "Moroccan Restaurant", "Cooking Classes", "Guided Tours"],
    tags: ["desert", "cultural", "exotic", "historic", "foodie", "romantic", "artistic"],
    vibe: "Riad-style Marrakech palace",
    coords: [31.6295, -7.9811], imgPool: "cultural", imgIdxs: [0, 1, 2],
    rooms: [
      { name: "Riad Room", desc: "Traditional room with mosaic details and courtyard view", guests: 2, bed: "King", size: "42 sqm", amenities: ["Courtyard View", "Mosaic Bath", "Sitting Area", "Tea Service"] },
      { name: "Royal Suite", desc: "Palatial suite with private terrace and mountain views", price: 780, guests: 3, bed: "King", size: "95 sqm", amenities: ["Mountain View", "Private Terrace", "Living Room", "Personal Butler"] },
    ],
  }),
  H({
    id: "hotel-30", name: "Bosphorus Heritage Mansion", tier: "Premium",
    city: "Istanbul", country: "Türkiye", location: "Istanbul, Türkiye",
    description: "A restored Ottoman waterside yali on the Bosphorus. Private caique boat to the Asian side, daily call-to-prayer panorama from the rooftop, and a chef-led Anatolian breakfast spread.",
    price: 410, rating: 4.7, reviews: 942,
    amenities: ["Private Caique", "Hammam", "Rooftop Terrace", "Library", "Cooking Class", "Tour Desk"],
    tags: ["cultural", "historic", "scenic", "foodie", "romantic", "iconic", "exotic"],
    vibe: "Ottoman waterside mansion",
    coords: [41.0082, 28.9784], imgPool: "cultural", imgIdxs: [2, 1, 0],
    rooms: [
      { name: "Yali Room", desc: "Wood-paneled room with shutters opening onto the Bosphorus", guests: 2, bed: "King", size: "38 sqm", amenities: ["Bosphorus View", "Wood Shutters", "Hammam Bath", "Turkish Tea"] },
      { name: "Sultan's Suite", desc: "Top-floor suite with private rooftop terrace and freestanding tub", price: 880, guests: 3, bed: "King", size: "80 sqm", amenities: ["Rooftop Terrace", "Freestanding Tub", "Sitting Room", "Sunset View"] },
    ],
  }),
  H({
    id: "hotel-31", name: "Trastevere Hideaway", tier: "Premium",
    city: "Rome", country: "Italy", location: "Rome, Italy",
    description: "A cobblestone hideaway tucked into Trastevere's medieval lanes. Rooftop aperitivo with Vatican views, pasta-making in the cellar, and a 1920s vermouth bar in the foyer.",
    price: 380, rating: 4.7, reviews: 1234,
    amenities: ["Rooftop Bar", "Pasta Class", "Vermouth Bar", "Concierge", "Bike Rental", "Spa"],
    tags: ["cultural", "historic", "foodie", "romantic", "vibrant", "scenic", "artistic"],
    vibe: "Cobblestone Trastevere classic",
    coords: [41.8919, 12.4664], imgPool: "cultural", imgIdxs: [1, 0, 2],
    rooms: [
      { name: "Lane View Room", desc: "Charming room with shuttered windows over a Trastevere lane", guests: 2, bed: "Queen", size: "28 sqm", amenities: ["Lane View", "Shutters", "Espresso Maker", "Bath Robes"] },
      { name: "Vatican View Suite", desc: "Top-floor suite with terrace facing St. Peter's dome", price: 720, guests: 3, bed: "King", size: "65 sqm", amenities: ["Vatican View", "Terrace", "Soaking Tub", "Vinyl Player"] },
    ],
  }),
  H({
    id: "hotel-32", name: "Tile & Tram Hotel", tier: "Comfort",
    city: "Lisbon", country: "Portugal", location: "Lisbon, Portugal",
    description: "A pastel-tiled boutique steps from the Tram 28 line. Pastel de nata mornings, fado dinners in the courtyard, and surf lessons in Cascais on the house shuttle.",
    price: 240, rating: 4.6, reviews: 1845,
    amenities: ["Fado Dinners", "Pastel Bakery", "Bike Tours", "Surf Shuttle", "Rooftop Bar", "Concierge"],
    tags: ["cultural", "foodie", "vibrant", "artistic", "family", "active", "historic"],
    vibe: "Tiled Lisbon townhouse",
    coords: [38.7223, -9.1393], imgPool: "cultural", imgIdxs: [0, 2, 1],
    rooms: [
      { name: "Azulejo Room", desc: "Pastel-tiled room with French doors onto a small balcony", guests: 2, bed: "Queen", size: "26 sqm", amenities: ["Balcony", "Tiled Bath", "Coffee Maker", "Bath Salts"] },
      { name: "Tagus View Suite", desc: "Upper-floor suite with terrace overlooking the Tagus River", price: 460, guests: 3, bed: "King", size: "55 sqm", amenities: ["River View", "Terrace", "Sitting Area", "Wet Bar"] },
    ],
  }),
  H({
    id: "hotel-33", name: "Acropolis View House", tier: "Premium",
    city: "Athens", country: "Greece", location: "Athens, Greece",
    description: "A whitewashed neoclassical house in Plaka with daily Acropolis sunrise views from every room. Greek-Med tasting menus, archaeologist-guided walks, and a rooftop wine cellar.",
    price: 360, rating: 4.7, reviews: 998,
    amenities: ["Acropolis View", "Wine Cellar", "Spa", "Archaeologist Walks", "Greek Tasting", "Concierge"],
    tags: ["cultural", "historic", "scenic", "foodie", "romantic", "artistic", "vibrant"],
    vibe: "Plaka view-of-the-Parthenon",
    coords: [37.9755, 23.7348], imgPool: "cultural", imgIdxs: [1, 0, 2],
    rooms: [
      { name: "Plaka Room", desc: "Bright Cycladic-styled room with marble bath and balcony", guests: 2, bed: "Queen", size: "30 sqm", amenities: ["Balcony", "Marble Bath", "Espresso", "Bath Robes"] },
      { name: "Acropolis Suite", desc: "Top-floor suite with full-view terrace facing the Parthenon", price: 680, guests: 3, bed: "King", size: "70 sqm", amenities: ["Parthenon View", "Terrace", "Outdoor Tub", "Wet Bar"] },
    ],
  }),

  /* -------------------------- Wellness / Zen (5) ------------------------ */
  H({
    id: "hotel-34", name: "Ubud Lotus Sanctuary", tier: "Signature",
    city: "Ubud", country: "Indonesia", location: "Ubud, Bali",
    description: "A jungle wellness sanctuary above the Ayung River. Sunrise sound-healing, plant-based kitchen, and floating-bed treehouse villas wrapped in fan palms.",
    price: 580, rating: 4.9, reviews: 612,
    amenities: ["Yoga Pavilion", "Plant-Based Kitchen", "Sound Healing", "Holistic Spa", "Rice Paddy Walks", "Meditation"],
    tags: ["wellness", "zen", "nature", "serene", "yoga", "romantic", "scenic"],
    vibe: "Jungle wellness sanctuary",
    coords: [-8.5069, 115.2625], imgPool: "wellness", imgIdxs: [0, 2, 1],
    rooms: [
      { name: "Lotus Villa", desc: "Open-air bamboo villa with rainforest view and outdoor bath", guests: 2, bed: "King", size: "70 sqm", amenities: ["Outdoor Bath", "Forest View", "Yoga Mat", "Meditation Cushion"] },
      { name: "Treehouse Pool Villa", desc: "Floating treehouse with private plunge pool above the canopy", price: 1080, guests: 2, bed: "King", size: "120 sqm", amenities: ["Plunge Pool", "Canopy View", "Sound Bath", "Healing Tea"] },
    ],
  }),
  H({
    id: "hotel-35", name: "Red Rock Wellness", tier: "Premium",
    city: "Sedona", country: "United States", location: "Sedona, Arizona",
    description: "A desert wellness resort set against Sedona's red rock formations. Vortex hikes at dawn, sound-bath ceremonies, juice cleanses, and stargazing from heated rock pools.",
    price: 540, rating: 4.8, reviews: 873,
    amenities: ["Vortex Hikes", "Sound Baths", "Juice Cleanse", "Hot Rock Pool", "Astronomy", "Yoga"],
    tags: ["wellness", "desert", "scenic", "yoga", "stargazing", "nature", "serene"],
    vibe: "Red-rock vortex sanctuary",
    coords: [34.8697, -111.7610], imgPool: "wellness", imgIdxs: [2, 1, 0],
    rooms: [
      { name: "Canyon Room", desc: "Adobe-styled room with private patio facing the red rocks", guests: 2, bed: "King", size: "45 sqm", amenities: ["Red Rock View", "Patio", "Yoga Mat", "Mineral Water"] },
      { name: "Vortex Suite", desc: "Two-room suite with rooftop sky bath aligned with a Sedona vortex", price: 980, guests: 3, bed: "King", size: "90 sqm", amenities: ["Sky Bath", "Lounge", "Crystal Healing", "Telescope"] },
    ],
  }),
  H({
    id: "hotel-36", name: "Himalayan Stillness Retreat", tier: "Signature",
    city: "Paro", country: "Bhutan", location: "Paro Valley, Bhutan",
    description: "Carved into a high Himalayan ridge facing Mount Jomolhari, with monks-led meditations, hot-stone baths, and a kitchen built around Bhutanese herbal medicine.",
    price: 1100, rating: 4.9, reviews: 244,
    amenities: ["Monk Meditation", "Hot Stone Bath", "Mountain Hikes", "Herbal Kitchen", "Archery", "Stargazing"],
    tags: ["wellness", "mountain", "zen", "serene", "remote", "scenic", "cultural"],
    vibe: "Himalayan stillness ridge",
    coords: [27.4287, 89.4164], imgPool: "wellness", imgIdxs: [1, 0, 2],
    rooms: [
      { name: "Ridge Room", desc: "Stone-walled room with floor-to-ceiling glass facing Jomolhari", guests: 2, bed: "King", size: "55 sqm", amenities: ["Mountain View", "Stone Walls", "Yoga Mat", "Butter Tea Kit"] },
      { name: "Monastery Villa", desc: "Standalone villa with private hot-stone bath and prayer alcove", price: 1980, guests: 3, bed: "King", size: "120 sqm", amenities: ["Hot Stone Bath", "Prayer Alcove", "Living Room", "Personal Monk"] },
    ],
  }),
  H({
    id: "hotel-37", name: "Backwater Wellness Hotel", tier: "Premium",
    city: "Alleppey", country: "India", location: "Kerala, India",
    description: "Floating villas on Kerala's palm-fringed backwaters. Ayurvedic doctors design daily treatments; rice-barge dinners drift past temple lanterns at dusk.",
    price: 320, rating: 4.7, reviews: 717,
    amenities: ["Ayurveda Center", "Yoga", "Rice Barge", "Spa", "Cooking School", "Birdwatching"],
    tags: ["wellness", "serene", "cultural", "nature", "scenic", "foodie", "romantic"],
    vibe: "Backwater ayurveda retreat",
    coords: [9.4981, 76.3388], imgPool: "wellness", imgIdxs: [0, 1, 2],
    rooms: [
      { name: "Backwater Cottage", desc: "Thatched cottage floating on stilts above the backwaters", guests: 2, bed: "King", size: "50 sqm", amenities: ["Water View", "Outdoor Deck", "Ayurveda Kit", "Hammock"] },
      { name: "Houseboat Villa", desc: "Two-bedroom houseboat that drifts each morning to a new mooring", price: 600, guests: 4, bed: "King + Queen", size: "100 sqm", amenities: ["Private Crew", "Dining Deck", "Outdoor Bath", "Sunset Lounge"] },
    ],
  }),
  H({
    id: "hotel-38", name: "Cloud Forest Spa Retreat", tier: "Premium",
    city: "Monteverde", country: "Costa Rica", location: "Monteverde Cloud Forest",
    description: "A treetop wellness lodge in the misty cloud forest. Hummingbird-window breakfasts, canopy zip lines, and rainforest mineral pools heated by volcanic springs.",
    price: 420, rating: 4.7, reviews: 654,
    amenities: ["Mineral Pools", "Canopy Walks", "Zip Lines", "Spa", "Birdwatching", "Yoga Deck"],
    tags: ["wellness", "nature", "adventure", "scenic", "eco", "serene", "active"],
    vibe: "Treetop cloud-forest spa",
    coords: [10.3010, -84.8228], imgPool: "wellness", imgIdxs: [2, 0, 1],
    rooms: [
      { name: "Canopy Room", desc: "Glass-walled room set into the canopy with rainfall shower", guests: 2, bed: "King", size: "45 sqm", amenities: ["Canopy View", "Rain Shower", "Yoga Mat", "Eco Toiletries"] },
      { name: "Treetop Suite", desc: "Two-story treetop suite with outdoor mineral plunge pool", price: 760, guests: 3, bed: "King", size: "90 sqm", amenities: ["Mineral Plunge", "Two Stories", "Sun Deck", "Telescope"] },
    ],
  }),

  /* -------------------------- Safari / Wildlife (4) --------------------- */
  H({
    id: "hotel-39", name: "Savanna Starlight Camp", tier: "Signature",
    city: "Serengeti", country: "Tanzania", location: "Serengeti, Tanzania",
    description: "A signature tented camp in the heart of the Serengeti offering front-row seats to the Great Migration. Sleep under canvas with all the comforts of a top-tier hotel, surrounded by the African wilderness.",
    price: 950, rating: 4.9, reviews: 456,
    amenities: ["Game Drives", "Bush Dining", "Star Gazing", "Spa", "Private Guide", "Photography Tours"],
    tags: ["safari", "adventure", "wildlife", "nature", "unique", "stargazing", "remote"],
    vibe: "Migration-watching tented camp",
    coords: [-2.3333, 34.8333], imgPool: "safari", imgIdxs: [0, 2, 1],
    rooms: [
      { name: "Safari Tent", desc: "Signature canvas tent with hardwood floors and bush views", guests: 2, bed: "King", size: "65 sqm", amenities: ["Bush View", "En-suite Bath", "Veranda", "Writing Desk"] },
      { name: "Starlight Suite Tent", desc: "Premium tent with retractable roof for stargazing from bed", price: 1600, guests: 2, bed: "King", size: "100 sqm", amenities: ["Stargazing Roof", "Private Deck", "Outdoor Bath", "Telescope"] },
    ],
  }),
  H({
    id: "hotel-40", name: "Okavango Delta Camp", tier: "Signature",
    city: "Maun", country: "Botswana", location: "Okavango Delta",
    description: "Floating water-camp in the Okavango's flood channels. Mokoro canoe drifts past elephants and red lechwe; champagne-and-fire pit dinners on a hidden island.",
    price: 1380, rating: 4.9, reviews: 318,
    amenities: ["Mokoro Canoes", "Walking Safaris", "Bush Dining", "Spa Tent", "Photographic Hides", "Bonfire Lounge"],
    tags: ["safari", "wildlife", "remote", "scenic", "adventure", "romantic", "stargazing"],
    vibe: "Floating delta water-camp",
    coords: [-19.5167, 23.1500], imgPool: "safari", imgIdxs: [1, 0, 2],
    rooms: [
      { name: "Water Tent", desc: "Raised canvas tent over the delta with mokoro launch deck", guests: 2, bed: "King", size: "75 sqm", amenities: ["Water View", "Outdoor Shower", "Veranda", "Binoculars"] },
      { name: "Honeymoon Sky Tent", desc: "Romantic tent with copper bath, outdoor lounge, and private chef", price: 2400, guests: 2, bed: "King", size: "120 sqm", amenities: ["Copper Bath", "Private Chef", "Outdoor Lounge", "Sundowner Setup"] },
    ],
  }),
  H({
    id: "hotel-41", name: "Big Five Lodge", tier: "Premium",
    city: "Hoedspruit", country: "South Africa", location: "Greater Kruger",
    description: "A family-run private-reserve lodge bordering Kruger's wildlife corridor. Three game drives a day, rhino-tracking on foot, and a tree-deck cinema under the stars.",
    price: 640, rating: 4.8, reviews: 612,
    amenities: ["Game Drives", "Walking Safaris", "Tree Cinema", "Spa", "Children's Lodge", "Photo Lab"],
    tags: ["safari", "wildlife", "family", "adventure", "nature", "scenic", "stargazing"],
    vibe: "Family-friendly Big Five reserve",
    coords: [-24.0833, 30.9000], imgPool: "safari", imgIdxs: [2, 1, 0],
    rooms: [
      { name: "Bush Suite", desc: "Thatched suite facing a watering hole frequented by elephants", guests: 2, bed: "King", size: "60 sqm", amenities: ["Watering Hole View", "Outdoor Shower", "Veranda", "Game Drive Included"] },
      { name: "Family Sky Suite", desc: "Two-bedroom suite with private plunge pool and tree deck", price: 1080, guests: 5, bed: "King + Twins", size: "140 sqm", amenities: ["Plunge Pool", "Two Bedrooms", "Tree Deck", "Family Guide"] },
    ],
  }),
  H({
    id: "hotel-42", name: "Iguana Bay Eco-Lodge", tier: "Premium",
    city: "Santa Cruz", country: "Ecuador", location: "Galápagos Islands",
    description: "A solar-and-rainwater eco-lodge on Santa Cruz Island. Naturalist-led snorkels with sea lions, lava-tube hikes, and a marine-research lab open to guests.",
    price: 580, rating: 4.8, reviews: 422,
    amenities: ["Naturalist Guides", "Snorkeling", "Lava Tube Hikes", "Marine Lab", "Eco Restaurant", "Telescope"],
    tags: ["safari", "wildlife", "eco", "nature", "adventure", "scenic", "unique"],
    vibe: "Galápagos naturalist eco-lodge",
    coords: [-0.7500, -90.3167], imgPool: "safari", imgIdxs: [0, 1, 2],
    rooms: [
      { name: "Eco Cabin", desc: "Solar-powered cabin opening onto a cactus-rimmed lava field", guests: 2, bed: "Queen", size: "40 sqm", amenities: ["Lava View", "Eco Toiletries", "Outdoor Deck", "Snorkel Gear"] },
      { name: "Researcher Suite", desc: "Two-room suite next to the marine lab with private terrace", price: 980, guests: 3, bed: "King", size: "85 sqm", amenities: ["Lab Access", "Terrace", "Marine Library", "Naturalist On-Call"] },
    ],
  }),

  /* -------------------------- Arctic / Aurora (3) ------------------------ */
  H({
    id: "hotel-43", name: "Northern Lights Lodge", tier: "Premium",
    city: "Tromsø", country: "Norway", location: "Tromsø, Norway",
    description: "A striking glass-roofed lodge above the Arctic Circle, designed for optimal aurora borealis viewing. Features heated glass igloos, husky sledding, and a Nordic spa with ice plunge pools.",
    price: 580, rating: 4.8, reviews: 534,
    amenities: ["Aurora Viewing", "Nordic Spa", "Husky Sledding", "Restaurant", "Ice Bar", "Snowshoeing"],
    tags: ["arctic", "aurora", "winter", "unique", "adventure", "nature", "romantic"],
    vibe: "Glass-igloo aurora chase",
    coords: [69.6492, 18.9553], imgPool: "arctic", imgIdxs: [0, 2, 1],
    rooms: [
      { name: "Glass Igloo", desc: "Heated glass igloo with unobstructed sky views", guests: 2, bed: "King", size: "30 sqm", amenities: ["Glass Ceiling", "Heated Floor", "Aurora Alert", "Minibar"] },
      { name: "Arctic Cabin Suite", desc: "Signature log cabin with hot tub and panoramic aurora windows", price: 920, guests: 4, bed: "King", size: "80 sqm", amenities: ["Private Hot Tub", "Panoramic Windows", "Fireplace", "Kitchen"] },
    ],
  }),
  H({
    id: "hotel-44", name: "Geothermal Glass Lodge", tier: "Premium",
    city: "Reykjavik", country: "Iceland", location: "South Iceland",
    description: "Black-stone-and-glass lodge set within a geothermal field. Direct lava-fed mineral baths, glacier-cave excursions, and skylit beds for aurora-watching in winter.",
    price: 620, rating: 4.8, reviews: 802,
    amenities: ["Geothermal Bath", "Glacier Tours", "Aurora Beds", "Spa", "Nordic Kitchen", "Telescope"],
    tags: ["arctic", "aurora", "scenic", "unique", "adventure", "wellness", "remote"],
    vibe: "Geothermal black-stone lodge",
    coords: [63.9333, -19.0500], imgPool: "arctic", imgIdxs: [1, 0, 2],
    rooms: [
      { name: "Lava Field Room", desc: "Glass-walled room facing the moss-covered lava field", guests: 2, bed: "King", size: "45 sqm", amenities: ["Lava View", "Skylight", "Geothermal Bath", "Aurora Alert"] },
      { name: "Glacier Suite", desc: "Loft suite with private outdoor mineral pool and skylight bed", price: 1080, guests: 3, bed: "King", size: "85 sqm", amenities: ["Outdoor Mineral Pool", "Skylight Bed", "Lounge", "Wine Fridge"] },
    ],
  }),
  H({
    id: "hotel-45", name: "Aurora Cabin Resort", tier: "Signature",
    city: "Levi", country: "Finland", location: "Lapland, Finland",
    description: "Snow-covered log cabins around a frozen lake in Finnish Lapland. Reindeer sleigh rides at dawn, smoked-salmon saunas in the afternoon, and aurora wake-up calls all night.",
    price: 720, rating: 4.9, reviews: 471,
    amenities: ["Reindeer Sleighs", "Sauna Suites", "Aurora Calls", "Ice Fishing", "Husky Tours", "Snowmobile"],
    tags: ["arctic", "aurora", "winter", "adventure", "cozy", "scenic", "family"],
    vibe: "Snowy Lapland cabin village",
    coords: [67.8042, 24.8083], imgPool: "arctic", imgIdxs: [2, 1, 0],
    rooms: [
      { name: "Glass Cabin", desc: "Heated cabin with glass roof for in-bed aurora viewing", guests: 2, bed: "King", size: "40 sqm", amenities: ["Glass Roof", "Heated Floor", "Sauna", "Aurora Call"] },
      { name: "Family Lakeside Cabin", desc: "Two-bedroom cabin with private lake sauna and ice plunge", price: 1280, guests: 5, bed: "King + Twins", size: "100 sqm", amenities: ["Lake Sauna", "Ice Plunge", "Living Area", "Kitchen"] },
    ],
  }),

  /* -------------------- Vineyard / Countryside (3) ---------------------- */
  H({
    id: "hotel-46", name: "Vineyard Estate Hotel", tier: "Premium",
    city: "Siena", country: "Italy", location: "Tuscany, Italy",
    description: "A restored 15th-century estate surrounded by rolling vineyards and olive groves. Features an acclaimed winery, farm-to-table restaurant, and outdoor infinity pool overlooking the Tuscan countryside.",
    price: 350, rating: 4.8, reviews: 743,
    amenities: ["Winery", "Wine Tasting", "Pool", "Farm Restaurant", "Cooking Classes", "Cycling"],
    tags: ["countryside", "wine", "foodie", "romantic", "historic", "serene", "cultural"],
    vibe: "Rolling Tuscan vineyard estate",
    coords: [43.3188, 11.3308], imgPool: "vineyard", imgIdxs: [0, 1, 2],
    rooms: [
      { name: "Vineyard Room", desc: "Charming room in the historic wing with vineyard views", guests: 2, bed: "Queen", size: "35 sqm", amenities: ["Vineyard View", "Antique Furniture", "En-suite Bath", "Welcome Wine"] },
      { name: "Estate Suite", desc: "Grand suite with original frescoes, terrace, and private garden", price: 650, guests: 3, bed: "King", size: "90 sqm", amenities: ["Frescoed Ceilings", "Private Garden", "Wine Fridge", "Terrace"] },
    ],
  }),
  H({
    id: "hotel-47", name: "Chateau Bordeaux Estate", tier: "Signature",
    city: "Saint-Émilion", country: "France", location: "Bordeaux Wine Region",
    description: "An 18th-century chateau on a working vineyard. Cellar dinners with the winemaker, hot-air balloon harvest tours, and a forest-edge spa with red-wine baths.",
    price: 780, rating: 4.9, reviews: 412,
    amenities: ["Wine Cellar", "Balloon Tours", "Spa", "Vineyard Cycling", "Sommelier", "Bistro"],
    tags: ["countryside", "wine", "romantic", "foodie", "historic", "scenic", "cultural"],
    vibe: "Working-chateau wine country",
    coords: [44.8939, -0.1564], imgPool: "vineyard", imgIdxs: [2, 0, 1],
    rooms: [
      { name: "Vineyard Wing Room", desc: "Estate room with sash windows facing the vines", guests: 2, bed: "King", size: "40 sqm", amenities: ["Vineyard View", "Antique Desk", "Wine Welcome", "Bathrobes"] },
      { name: "Winemaker's Suite", desc: "Top-floor suite with private terrace overlooking the cellar courtyard", price: 1380, guests: 3, bed: "King", size: "95 sqm", amenities: ["Private Terrace", "Cellar Access", "Soaking Tub", "Sommelier Visit"] },
    ],
  }),
  H({
    id: "hotel-48", name: "Cypress Vineyard Inn", tier: "Premium",
    city: "Yountville", country: "United States", location: "Napa Valley",
    description: "A modern barn-style inn among the Napa cypress groves. Vintner-hosted dinners, hot-air balloon launches from the back lawn, and an open-fire kitchen led by a celebrated valley chef.",
    price: 620, rating: 4.8, reviews: 967,
    amenities: ["Vintner Dinners", "Balloon Launch", "Pool", "Wine Library", "Cooking School", "Cycling"],
    tags: ["countryside", "wine", "foodie", "romantic", "scenic", "active", "cultural"],
    vibe: "Cypress-shaded valley inn",
    coords: [38.4015, -122.3608], imgPool: "vineyard", imgIdxs: [1, 2, 0],
    rooms: [
      { name: "Vineyard Cottage", desc: "Standalone cottage with private patio onto the cypress grove", guests: 2, bed: "King", size: "55 sqm", amenities: ["Garden Patio", "Outdoor Tub", "Wood Stove", "Welcome Wine"] },
      { name: "Estate Loft", desc: "Loft suite with fireplace, freestanding tub, and rooftop balcony", price: 1080, guests: 3, bed: "King", size: "90 sqm", amenities: ["Rooftop Balcony", "Fireplace", "Freestanding Tub", "Sommelier Visit"] },
    ],
  }),

  /* ------------------------------- Desert (2) --------------------------- */
  H({
    id: "hotel-49", name: "Crimson Dunes Camp", tier: "Signature",
    city: "Wadi Rum", country: "Jordan", location: "Wadi Rum, Jordan",
    description: "A bubble-and-tent desert camp under the red sandstone cliffs of Wadi Rum. Camel sunset rides, Bedouin-led navigation classes, and movie-screen-clear desert skies.",
    price: 460, rating: 4.8, reviews: 528,
    amenities: ["Stargazing", "Camel Rides", "Bedouin Dinner", "Spa Tent", "4x4 Tours", "Astronomy Talks"],
    tags: ["desert", "stargazing", "unique", "scenic", "adventure", "romantic", "remote"],
    vibe: "Sandstone bubble-tent camp",
    coords: [29.5765, 35.4206], imgPool: "desert", imgIdxs: [0, 2, 1],
    rooms: [
      { name: "Bubble Tent", desc: "Transparent dome with bed angled to the desert sky", guests: 2, bed: "King", size: "30 sqm", amenities: ["Sky Dome", "Outdoor Patio", "Wood Stove", "Stargazing Map"] },
      { name: "Bedouin Suite Tent", desc: "Canvas suite with hand-loomed rugs and private fire pit", price: 820, guests: 3, bed: "King", size: "70 sqm", amenities: ["Fire Pit", "Outdoor Lounge", "Sunset Deck", "Local Guide"] },
    ],
  }),
  H({
    id: "hotel-50", name: "Stargazer Desert Camp", tier: "Premium",
    city: "San Pedro de Atacama", country: "Chile", location: "Atacama Desert",
    description: "An adobe camp on the high Andean plateau — the world's clearest sky for stargazing. Salt-flat sunrises, geyser-field treks, and llama-shepherded hikes through the moon valley.",
    price: 540, rating: 4.8, reviews: 612,
    amenities: ["Astronomy Tower", "Salt Flat Tours", "Geyser Treks", "Adobe Spa", "Llama Hikes", "Wine Cellar"],
    tags: ["desert", "stargazing", "adventure", "scenic", "remote", "nature", "unique"],
    vibe: "High-altitude stargazer's haven",
    coords: [-22.9100, -68.2000], imgPool: "desert", imgIdxs: [2, 1, 0],
    rooms: [
      { name: "Adobe Room", desc: "Earth-walled room with private patio and outdoor wood-fired bath", guests: 2, bed: "King", size: "42 sqm", amenities: ["Patio", "Outdoor Bath", "Astronomy Card", "Mate Set"] },
      { name: "Observatory Suite", desc: "Suite with private telescope deck and skylight bed", price: 960, guests: 3, bed: "King", size: "85 sqm", amenities: ["Private Telescope", "Skylight Bed", "Lounge", "Sommelier Wine"] },
    ],
  }),
];

/* -------------------------------------------------------------------------- */
/*  Destinations + Mood categories                                            */
/* -------------------------------------------------------------------------- */

export const destinations: Destination[] = [
  { id: "dest-1", name: "Maldives", country: "Maldives", description: "Paradise islands with overwater villas and crystal lagoons", image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80", tags: ["tropical", "beach", "romantic", "serene"], climate: "Tropical", bestMonths: ["Nov", "Apr"], activities: ["Diving", "Snorkeling", "Spa", "Sunset Cruise"] },
  { id: "dest-2", name: "Swiss Alps", country: "Switzerland", description: "Majestic peaks, world-class skiing, and charming alpine villages", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80", tags: ["mountain", "winter", "skiing", "adventure"], climate: "Alpine", bestMonths: ["Dec", "Mar"], activities: ["Skiing", "Hiking", "Fondue", "Train Tours"] },
  { id: "dest-3", name: "Tokyo", country: "Japan", description: "A dazzling blend of ultra-modern tech and ancient tradition", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80", tags: ["urban", "cultural", "foodie", "modern"], climate: "Temperate", bestMonths: ["Mar", "May", "Oct", "Nov"], activities: ["Temple Visits", "Street Food", "Shopping", "Sumo"] },
  { id: "dest-4", name: "Amalfi Coast", country: "Italy", description: "Dramatic cliffs, pastel villages, and the sparkling Mediterranean", image: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&q=80", tags: ["coastal", "romantic", "foodie", "scenic"], climate: "Mediterranean", bestMonths: ["May", "Sep"], activities: ["Boat Tours", "Limoncello Tasting", "Hiking", "Beach"] },
  { id: "dest-5", name: "Serengeti", country: "Tanzania", description: "Endless plains teeming with wildlife and unforgettable sunsets", image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&q=80", tags: ["safari", "adventure", "wildlife", "nature"], climate: "Tropical Savanna", bestMonths: ["Jun", "Oct"], activities: ["Game Drives", "Hot Air Balloon", "Bush Dining", "Star Gazing"] },
  { id: "dest-6", name: "New York City", country: "United States", description: "The city that never sleeps — endless energy, culture, and cuisine", image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80", tags: ["urban", "cultural", "nightlife", "shopping"], climate: "Temperate", bestMonths: ["Apr", "Jun", "Sep", "Dec"], activities: ["Broadway", "Central Park", "Museums", "Dining"] },
  { id: "dest-7", name: "Tromsø", country: "Norway", description: "Gateway to the Arctic and the magical Northern Lights", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80", tags: ["arctic", "aurora", "winter", "unique"], climate: "Subarctic", bestMonths: ["Sep", "Mar"], activities: ["Aurora Viewing", "Dog Sledding", "Whale Watching", "Ice Fishing"] },
  { id: "dest-8", name: "Marrakech", country: "Morocco", description: "A sensory feast of colors, spices, and architectural wonders", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80", tags: ["desert", "cultural", "exotic", "historic"], climate: "Semi-arid", bestMonths: ["Mar", "May", "Oct", "Nov"], activities: ["Souk Shopping", "Hammam", "Desert Tours", "Cooking Classes"] },
];

export const moodCategories: MoodCategory[] = [
  { id: "mood-1", name: "Honeymoon", emoji: "\uD83D\uDC8D", description: "Overwater villas, private dinners, and once-in-a-lifetime sunsets", image: "https://images.unsplash.com/photo-1611516491426-03025e6043c8?w=800&q=75&auto=format&fit=crop", tags: ["romantic", "honeymoon", "serene", "beach", "overwater"], gradient: "from-rose-500 to-pink-600" },
  { id: "mood-2", name: "Wedding", emoji: "\uD83D\uDC8D", description: "Postcard-worthy venues for ceremonies you'll be tagged in forever", image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=75&auto=format&fit=crop", tags: ["romantic", "honeymoon", "beach", "scenic", "tropical", "vineyard"], gradient: "from-fuchsia-500 to-rose-500" },
  { id: "mood-3", name: "Wildlife", emoji: "\uD83E\uDD81", description: "Up-close encounters with lions, elephants, and the Great Migration", image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80", tags: ["safari", "wildlife", "nature", "adventure", "remote"], gradient: "from-amber-600 to-orange-700" },
  { id: "mood-4", name: "Adventure", emoji: "\u26F0\uFE0F", description: "Thrilling experiences from mountain peaks to ocean depths", image: "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80", tags: ["adventure", "active", "diving", "safari", "skiing"], gradient: "from-orange-500 to-amber-600" },
  { id: "mood-5", name: "Wellness", emoji: "\uD83E\uDDD8", description: "Rejuvenate your mind, body, and soul at world-class spas", image: "https://images.unsplash.com/photo-1540555700478-4be289fbec6e?w=800&q=80", tags: ["wellness", "yoga", "zen", "nature", "serene"], gradient: "from-teal-500 to-emerald-600" },
  { id: "mood-6", name: "Culture", emoji: "\uD83C\uDFDB\uFE0F", description: "Immerse yourself in history, art, and local traditions", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80", tags: ["cultural", "historic", "artistic", "traditional", "foodie"], gradient: "from-amber-700 to-stone-900" },
  { id: "mood-7", name: "Urban", emoji: "\uD83C\uDF03", description: "Vibrant cityscapes, world-class dining, and buzzing nightlife", image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80", tags: ["urban", "nightlife", "shopping", "foodie", "skyline"], gradient: "from-stone-700 to-stone-950" },
  { id: "mood-8", name: "Nature", emoji: "\uD83C\uDF3F", description: "Escape to pristine landscapes and breathtaking natural wonders", image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80", tags: ["nature", "eco", "scenic", "island", "mountain"], gradient: "from-green-500 to-lime-600" },
];

/* -------------------------------------------------------------------------- */
/*  Selectors                                                                 */
/* -------------------------------------------------------------------------- */

export function searchHotels(query: string): Hotel[] {
  const lowerQuery = query.toLowerCase();
  return hotels.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(lowerQuery) ||
      hotel.location.toLowerCase().includes(lowerQuery) ||
      hotel.city.toLowerCase().includes(lowerQuery) ||
      hotel.country.toLowerCase().includes(lowerQuery) ||
      hotel.vibe.toLowerCase().includes(lowerQuery) ||
      hotel.tags.some((tag) => tag.includes(lowerQuery)) ||
      hotel.amenities.some((a) => a.toLowerCase().includes(lowerQuery)),
  );
}

export function getHotelsByTags(tags: string[]): Hotel[] {
  return hotels
    .map((hotel) => ({
      hotel,
      score: tags.reduce(
        (acc, tag) =>
          acc + (hotel.tags.some((ht) => ht.includes(tag.toLowerCase())) ? 1 : 0),
        0,
      ),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ hotel }) => hotel);
}

export function getHotelById(id: string): Hotel | undefined {
  return hotels.find((h) => h.id === id);
}

/** Resolve a single vibe keyword to a list of tags, then return ranked hotels. */
export function getHotelsByVibe(vibe: string): Hotel[] {
  const normalized = vibe.trim().toLowerCase();
  if (!normalized) return hotels;

  // Map known mood names to their tag bundles
  const mood = moodCategories.find(
    (m) => m.name.toLowerCase() === normalized || m.id === normalized,
  );
  const tags = mood ? mood.tags : [normalized];
  return getHotelsByTags(tags);
}
