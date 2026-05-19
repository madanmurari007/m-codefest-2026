export interface Hotel {
  id: string;
  name: string;
  brand: string;
  tier: "Luxury" | "Premium" | "Select" | "Longer Stays";
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
  coordinates: { lat: number; lng: number };
  bonvoyPointsPerNight: number;
  roomTypes: RoomType[];
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

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  hotels?: Hotel[];
}

export interface BookingDetails {
  hotel: Hotel;
  room: RoomType;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  bonvoyPoints: number;
}

export interface ImageAnalysis {
  mood: string;
  scenery: string[];
  climate: string;
  activities: string[];
  aesthetic: string;
  suggestedDestinations: string[];
}
