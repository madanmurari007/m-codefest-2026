export type HotelTier = "Signature" | "Premium" | "Comfort" | "Extended";

export type Vibe =
  | "romantic"
  | "adventure"
  | "wellness"
  | "cultural"
  | "urban"
  | "nature"
  | "tropical"
  | "mountain"
  | "desert"
  | "arctic"
  | "safari"
  | "wine"
  | "foodie"
  | "serene"
  | "vibrant"
  | "scenic";

export interface Hotel {
  id: string;
  name: string;
  tier: HotelTier;
  location: string;
  city: string;
  country: string;
  description: string;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  currency: string;
  amenities: string[];
  tags: string[];
  vibe: string;
  coordinates: { lat: number; lng: number };
  roomTypes: RoomType[];
  /**
   * Short live status messages (e.g. "Pool under maintenance Nov 18–22",
   * "Rooms beside the ballroom unavailable due to a wedding") displayed under
   * the amenities section. Optional; AI-generated cards may populate it.
   */
  temporaryNotices?: string[];
}

export interface RoomType {
  id: string;
  name: string;
  description: string;
  pricePerNight: number;
  maxGuests: number;
  bedType: string;
  size: string;
  image: string;
  amenities: string[];
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  image: string;
  tags: string[];
  climate: string;
  bestMonths: string[];
  activities: string[];
}

export interface MoodCategory {
  id: string;
  name: string;
  emoji: string;
  description: string;
  image: string;
  tags: string[];
  gradient: string;
}

/**
 * A single hotel recommendation returned alongside an assistant chat message.
 * Carries both the canonical Hotel record and AI-crafted per-card text so the
 * UI can render unique copy for every card.
 */
export interface ChatHotelRec {
  hotel: Hotel;
  /** Short one-liner headline shown above the hotel card body. */
  headline?: string;
  /** A 1-2 sentence "why this matches" tailored to the user's request. */
  reason?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  /** Per-card AI-tailored hotel recommendations returned by /api/chat. */
  recommendations?: ChatHotelRec[];
  /**
   * Optional region chips the assistant suggests when the user's ask was
   * broad (no specific country/region). Clicking a chip triggers a regional
   * follow-up query.
   */
  suggestedRegions?: string[];
}

export interface BookingDetails {
  hotel: Hotel;
  room: RoomType;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
}

export interface ImageAnalysis {
  mood: string;
  scenery: string[];
  climate: string;
  activities: string[];
  aesthetic: string;
  suggestedDestinations: string[];
}
