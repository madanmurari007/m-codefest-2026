"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, MapPin, Sparkles } from "lucide-react";
import { Hotel } from "@/lib/types";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface HotelCardProps {
  hotel: Hotel;
  index?: number;
}

export default function HotelCard({ hotel, index = 0 }: HotelCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Link href={`/hotels/${hotel.id}`} className="group block">
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
                {hotel.brand}
              </span>
              <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
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
            <h3 className="text-lg font-semibold text-card-foreground group-hover:text-blue-600 transition-colors">
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

            <div className="mt-4 flex items-end justify-between border-t border-border pt-3">
              <div>
                <span className="text-2xl font-bold text-card-foreground">
                  {formatCurrency(hotel.pricePerNight)}
                </span>
                <span className="text-sm text-muted-foreground"> / night</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-blue-600">
                <Sparkles className="h-3.5 w-3.5" />
                Earn {formatNumber(hotel.bonvoyPointsPerNight)} pts
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
