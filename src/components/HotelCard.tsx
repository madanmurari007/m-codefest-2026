"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, MapPin, Sparkles, AlertTriangle } from "lucide-react";
import { Hotel } from "@/lib/types";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface HotelCardProps {
  hotel: Hotel;
  index?: number;
  /** Optional AI-crafted headline shown above the standard card body. */
  headline?: string;
  /** Optional AI-crafted "why this matches" sentence shown below the headline. */
  reason?: string;
}

/**
 * Hotels whose id starts with `ai-` come from the chat LLM. They don't have
 * a backing catalog row, so we stash the full Hotel record in sessionStorage
 * on click; the detail page reads it back from there.
 */
function isAIGenerated(hotel: Hotel): boolean {
  return hotel.id.startsWith("ai-");
}

const AI_HOTEL_STORAGE_PREFIX = "ai-hotel:";

function persistAIHotel(hotel: Hotel) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(
      `${AI_HOTEL_STORAGE_PREFIX}${hotel.id}`,
      JSON.stringify(hotel),
    );
  } catch {
    // Ignore quota / privacy-mode errors — the detail page will fall back
    // to a "not available" state.
  }
}

export default function HotelCard({
  hotel,
  index = 0,
  headline,
  reason,
}: HotelCardProps) {
  const aiGenerated = isAIGenerated(hotel);

  const handleAINav = () => {
    if (aiGenerated) persistAIHotel(hotel);
  };

  const body = (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative h-56 overflow-hidden">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-800">
            {hotel.vibe}
          </span>
          <span className="rounded-full bg-stone-900 px-3 py-1 text-xs font-semibold text-white">
            {hotel.tier}
          </span>
        </div>
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-white">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-semibold">{hotel.rating}</span>
          <span className="text-xs text-white/70">
            ({formatNumber(hotel.reviewCount)})
          </span>
        </div>
      </div>

      <div className="p-4">
        {headline && (
          <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
              <Sparkles className="h-3 w-3" /> AI pick
            </div>
            <div className="mt-0.5 text-sm font-semibold leading-snug text-amber-900">
              {headline}
            </div>
            {reason && (
              <p className="mt-1 text-xs leading-relaxed text-amber-800/90">
                {reason}
              </p>
            )}
          </div>
        )}

        <h3 className="text-lg font-semibold text-card-foreground group-hover:text-amber-700 transition-colors">
          {hotel.name}
        </h3>
        <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {hotel.location}
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {hotel.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {hotel.amenities.slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              {amenity}
            </span>
          ))}
          {hotel.amenities.length > 3 && (
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              +{hotel.amenities.length - 3} more
            </span>
          )}
        </div>

        {hotel.temporaryNotices && hotel.temporaryNotices.length > 0 && (
          <div className="mt-3 space-y-1.5 rounded-lg border border-orange-200 bg-orange-50/70 p-2.5">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-orange-700">
              <AlertTriangle className="h-3 w-3" /> Live status
            </div>
            <ul className="space-y-1">
              {hotel.temporaryNotices.map((notice) => (
                <li
                  key={notice}
                  className="flex items-start gap-1.5 text-xs leading-snug text-orange-900"
                >
                  <span
                    aria-hidden
                    className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500"
                  />
                  <span>{notice}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 flex items-end justify-between border-t border-border pt-3">
          <div>
            <span className="text-2xl font-bold text-card-foreground">
              {formatCurrency(hotel.pricePerNight, hotel.currency)}
            </span>
            <span className="text-sm text-muted-foreground"> / night</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            {hotel.rating} ({formatNumber(hotel.reviewCount)})
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Link
        href={`/hotels/${hotel.id}`}
        onClick={handleAINav}
        className="group block"
      >
        {body}
      </Link>
    </motion.div>
  );
}
