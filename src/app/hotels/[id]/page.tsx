"use client";

import { use, useState } from "react";
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
} from "lucide-react";
import { hotels } from "@/lib/hotels";
import { formatCurrency, formatNumber } from "@/lib/utils";
import BookingNudge from "@/components/BookingNudge";
import PointsCalculator from "@/components/PointsCalculator";
import BonvoyEnrollment from "@/components/BonvoyEnrollment";

export default function HotelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const hotel = hotels.find((h) => h.id === id);
  const [selectedRoom, setSelectedRoom] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!hotel) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Hotel not found</h1>
          <Link href="/discover" className="mt-4 text-blue-600 hover:underline">
            Browse all destinations
          </Link>
        </div>
      </div>
    );
  }

  const room = hotel.roomTypes[selectedRoom];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/discover"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Discover
        </Link>

        {/* Gallery */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-2 sm:grid-cols-3"
        >
          <div className="sm:col-span-2">
            <img
              src={hotel.images[selectedImage]}
              alt={hotel.name}
              className="h-72 w-full rounded-2xl object-cover sm:h-96"
            />
          </div>
          <div className="flex gap-2 sm:flex-col">
            {hotel.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`flex-1 overflow-hidden rounded-xl transition-all ${
                  selectedImage === i
                    ? "ring-2 ring-blue-500"
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
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  {hotel.brand}
                </span>
                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                  {hotel.tier}
                </span>
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
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {hotel.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 rounded-lg bg-muted p-3"
                    >
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Room Types */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold">Room Types</h2>
                <div className="mt-4 space-y-4">
                  {hotel.roomTypes.map((rt, i) => (
                    <button
                      key={rt.id}
                      onClick={() => setSelectedRoom(i)}
                      className={`w-full rounded-2xl border p-4 text-left transition-all ${
                        selectedRoom === i
                          ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                          : "border-border hover:border-blue-300"
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
                            {formatCurrency(rt.pricePerNight)}
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
                      {formatCurrency(room.pricePerNight)}
                    </span>
                    <span className="text-muted-foreground"> / night</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-blue-600">
                    <Sparkles className="h-3.5 w-3.5" />
                    {formatNumber(hotel.bonvoyPointsPerNight)} pts
                  </div>
                </div>

                <div className="mt-4 text-sm font-medium text-muted-foreground">
                  {room.name}
                </div>

                <Link
                  href={`/booking?hotel=${hotel.id}&room=${room.id}`}
                  className="mt-4 block w-full rounded-xl bg-blue-600 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Book This Room
                </Link>

                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Free cancellation up to 48 hours before check-in
                </p>
              </div>

              <PointsCalculator
                pointsPerNight={hotel.bonvoyPointsPerNight}
                pricePerNight={room.pricePerNight}
              />

              <BonvoyEnrollment />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
