"use client";

import { use, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star,
  MapPin,
  ArrowLeft,
  Check,
  Users,
  Bed,
  Maximize,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { hotels } from "@/lib/hotels";
import { formatCurrency, formatNumber } from "@/lib/utils";
import BookingNudge from "@/components/BookingNudge";
import AmenityHover from "@/components/AmenityHover";
import type { Hotel, RoomType } from "@/lib/types";

const AI_HOTEL_STORAGE_PREFIX = "ai-hotel:";

/**
 * Module-level cache. `useSyncExternalStore` compares the result of
 * `getSnapshot` with `Object.is`; without caching we'd parse JSON on every
 * call and return a fresh object, triggering the "result of getSnapshot
 * should be cached to avoid an infinite loop" error.
 */
const aiHotelCache = new Map<string, Hotel | null>();

function loadAIHotelCached(id: string): Hotel | null {
  if (typeof window === "undefined") return null;
  if (aiHotelCache.has(id)) return aiHotelCache.get(id) ?? null;
  let parsed: Hotel | null = null;
  try {
    const raw = sessionStorage.getItem(`${AI_HOTEL_STORAGE_PREFIX}${id}`);
    parsed = raw ? (JSON.parse(raw) as Hotel) : null;
  } catch {
    parsed = null;
  }
  aiHotelCache.set(id, parsed);
  return parsed;
}

/** Stable no-op subscribe (the AI snapshot never changes after first read). */
const noopSubscribe = () => () => {};

/**
 * AI hotels arrive without rooms. Synthesize two plausible room rows so the
 * detail page renders uniformly between catalog and AI-generated stays.
 */
function synthesizeRooms(hotel: Hotel): RoomType[] {
  const base = hotel.pricePerNight;
  return [
    {
      id: `${hotel.id}-r1`,
      name: "Signature Room",
      description: `Comfortable signature room at ${hotel.name} with all the on-property essentials.`,
      pricePerNight: base,
      maxGuests: 2,
      bedType: "King",
      size: "40 sqm",
      image: hotel.image,
      amenities: hotel.amenities.slice(0, 4),
    },
    {
      id: `${hotel.id}-r2`,
      name: "Suite",
      description: `Upgraded suite with a larger layout and elevated amenities.`,
      pricePerNight: Math.round(base * 1.65),
      maxGuests: 3,
      bedType: "King + Sofa",
      size: "75 sqm",
      image: hotel.image,
      amenities: hotel.amenities.slice(0, 6),
    },
  ];
}

export default function HotelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const isAi = id.startsWith("ai-");

  const catalogHotel = useMemo(
    () => (isAi ? null : hotels.find((h) => h.id === id) ?? null),
    [id, isAi],
  );

  // Read the AI hotel out of sessionStorage on the client only — avoids
  // hydration mismatches and the set-state-in-effect lint rule.
  // The snapshot is memoized in `aiHotelCache` so React's Object.is check
  // sees a stable reference (otherwise: "result of getSnapshot should be
  // cached to avoid an infinite loop").
  const aiHotel = useSyncExternalStore(
    noopSubscribe,
    () => (isAi ? loadAIHotelCached(id) : null),
    () => null,
  );
  /**
   * True once we're definitely running on the client. Boolean primitives
   * are always Object.is-equal so no caching is needed here.
   */
  const aiLoaded =
    useSyncExternalStore(
      noopSubscribe,
      () => true,
      () => false,
    ) || !isAi;

  const hotel = catalogHotel ?? aiHotel;

  const [selectedRoom, setSelectedRoom] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!hotel) {
    if (!aiLoaded) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center text-muted-foreground">Loading…</div>
        </div>
      );
    }
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Hotel not found</h1>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            This stay was generated for a recent chat session. Reopen the
            recommendation from your chat to view it again.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link href="/chat" className="text-amber-700 hover:underline">
              Back to AI planner
            </Link>
            <Link href="/discover" className="text-amber-700 hover:underline">
              Browse all destinations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // AI hotels arrive with empty roomTypes — synthesize defaults so the
  // booking column and room list still render meaningfully.
  const roomTypes =
    hotel.roomTypes.length > 0 ? hotel.roomTypes : synthesizeRooms(hotel);
  const room = roomTypes[selectedRoom];
  const galleryImages = hotel.images.length > 0 ? hotel.images : [hotel.image];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href={isAi ? "/chat" : "/discover"}
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {isAi ? "Back to AI planner" : "Back to Discover"}
        </Link>

        {/* Gallery */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-2 sm:grid-cols-3"
        >
          <div className="sm:col-span-2">
            <img
              src={galleryImages[selectedImage] ?? hotel.image}
              alt={hotel.name}
              className="h-72 w-full rounded-2xl object-cover sm:h-96"
            />
          </div>
          <div className="flex gap-2 sm:flex-col">
            {galleryImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`flex-1 overflow-hidden rounded-xl transition-all ${
                  selectedImage === i
                    ? "ring-2 ring-amber-600"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt={`${hotel.name} ${i + 1}`}
                  className="h-24 w-full object-cover sm:h-full"
                />
              </button>
            ))}
          </div>
        </motion.div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Left Column */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  {hotel.vibe}
                </span>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                  {hotel.tier}
                </span>
                {isAi && (
                  <span className="rounded-full border border-amber-300 px-3 py-1 text-xs font-semibold text-amber-700">
                    AI curated
                  </span>
                )}
              </div>

              <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
                {hotel.name}
              </h1>

              <div className="mt-2 flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{hotel.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{hotel.rating}</span>
                  <span className="text-muted-foreground">
                    ({formatNumber(hotel.reviewCount)} reviews)
                  </span>
                </div>
              </div>

              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {hotel.description}
              </p>

              {/* Amenities */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold">Amenities</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Hover any amenity for an inside look.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {hotel.amenities.map((amenity) => (
                    <AmenityHover key={amenity} amenity={amenity}>
                      <div className="flex items-center gap-2 rounded-lg bg-muted p-3 transition-colors hover:bg-amber-50 cursor-default">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{amenity}</span>
                      </div>
                    </AmenityHover>
                  ))}
                </div>
              </div>

              {/* Live status */}
              {hotel.temporaryNotices && hotel.temporaryNotices.length > 0 && (
                <div className="mt-8">
                  <h2 className="flex items-center gap-2 text-xl font-semibold">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Live property status
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    A few things are temporarily unavailable during your stay.
                  </p>
                  <ul className="mt-4 space-y-2">
                    {hotel.temporaryNotices.map((notice) => (
                      <li
                        key={notice}
                        className="flex items-start gap-2 rounded-lg border border-orange-200 bg-orange-50/70 p-3 text-sm text-orange-900"
                      >
                        <span
                          aria-hidden
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500"
                        />
                        <span>{notice}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Room Types */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold">Room Types</h2>
                <div className="mt-4 space-y-4">
                  {roomTypes.map((rt, i) => (
                    <button
                      key={rt.id}
                      onClick={() => setSelectedRoom(i)}
                      className={`w-full rounded-2xl border p-4 text-left transition-all ${
                        selectedRoom === i
                          ? "border-amber-600 bg-amber-50 ring-1 ring-amber-600"
                          : "border-border hover:border-amber-300"
                      }`}
                    >
                      <div className="flex gap-4">
                        <img
                          src={rt.image}
                          alt={rt.name}
                          className="h-24 w-32 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">
                            {rt.name}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {rt.description}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              Up to {rt.maxGuests} guests
                            </span>
                            <span className="flex items-center gap-1">
                              <Bed className="h-3 w-3" />
                              {rt.bedType}
                            </span>
                            <span className="flex items-center gap-1">
                              <Maximize className="h-3 w-3" />
                              {rt.size}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold">
                            {formatCurrency(rt.pricePerNight, hotel.currency)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            / night
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Booking */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24 space-y-4"
            >
              <BookingNudge />

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-3xl font-bold">
                      {formatCurrency(room.pricePerNight, hotel.currency)}
                    </span>
                    <span className="text-muted-foreground"> / night</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-amber-700">
                    <Sparkles className="h-3.5 w-3.5" />
                    Best rate
                  </div>
                </div>

                <div className="mt-4 text-sm font-medium text-muted-foreground">
                  {room.name}
                </div>

                <Link
                  href={`/booking?hotel=${hotel.id}&room=${room.id}`}
                  className="mt-4 block w-full rounded-xl bg-stone-900 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-black"
                >
                  Book Now
                </Link>

                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Free cancellation up to 48 hours before check-in
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
