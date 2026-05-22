"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Users,
  CreditCard,
  Shield,
  Sparkles,
  Check,
  MapPin,
} from "lucide-react";
import { hotels } from "@/lib/hotels";
import {
  formatCurrency,
  calculateNights,
  getDefaultCheckIn,
  getDefaultCheckOut,
} from "@/lib/utils";
import BookingNudge from "@/components/BookingNudge";

function BookingContent() {
  const searchParams = useSearchParams();
  const hotelId = searchParams.get("hotel") || hotels[0].id;
  const roomId = searchParams.get("room");

  const hotel = hotels.find((h) => h.id === hotelId) || hotels[0];
  const room =
    hotel.roomTypes.find((r) => r.id === roomId) || hotel.roomTypes[0];

  const [checkIn, setCheckIn] = useState(getDefaultCheckIn());
  const [checkOut, setCheckOut] = useState(getDefaultCheckOut());
  const [guests, setGuests] = useState(2);
  const [confirmed, setConfirmed] = useState(false);

  const nights = calculateNights(checkIn, checkOut);
  const subtotal = room.pricePerNight * nights;
  const taxes = Math.round(subtotal * 0.13);
  const total = subtotal + taxes;

  if (confirmed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-lg py-20 text-center"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <Check className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="mt-6 text-3xl font-bold">Booking Confirmed!</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Your reservation at {hotel.name} has been confirmed.
        </p>

        <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-left">
          <h3 className="font-semibold">{hotel.name}</h3>
          <p className="text-sm text-muted-foreground">{room.name}</p>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Check-in</span>
              <span className="font-medium">{checkIn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Check-out</span>
              <span className="font-medium">{checkOut}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Guests</span>
              <span className="font-medium">{guests}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <span className="font-medium">Total</span>
              <span className="font-bold">{formatCurrency(total, hotel.currency)}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            <Sparkles className="h-4 w-4" />
            A confirmation email is on its way. Safe travels!
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            href="/"
            className="flex-1 rounded-xl border border-border py-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            Back to Home
          </Link>
          <Link
            href="/discover"
            className="flex-1 rounded-xl bg-stone-900 py-3 text-sm font-medium text-white transition-colors hover:bg-black"
          >
            Explore More
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <Link
        href={`/hotels/${hotel.id}`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {hotel.name}
      </Link>

      <h1 className="text-3xl font-bold">Complete Your Booking</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <div className="space-y-6 lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <BookingNudge />
          </motion.div>

          {/* Dates & Guests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Calendar className="h-5 w-5 text-amber-700" />
              Stay Details
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Check-in
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Check-out
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Guests
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-200"
                >
                  {Array.from({ length: room.maxGuests }, (_, i) => i + 1).map(
                    (n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "Guest" : "Guests"}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Guest Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Users className="h-5 w-5 text-amber-700" />
              Guest Information
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="John"
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Doe"
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Phone
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
              </div>
            </div>
          </motion.div>

          {/* Payment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <CreditCard className="h-5 w-5 text-amber-700" />
              Payment Details
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Expiry
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    CVC
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5" />
              Your payment is secured with 256-bit SSL encryption
            </div>
          </motion.div>
        </div>

        {/* Order Summary */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold">Order Summary</h2>

            <div className="mt-4 flex gap-3">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="h-16 w-20 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-medium">{hotel.name}</h3>
                <p className="text-sm text-muted-foreground">{room.name}</p>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {hotel.location}
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-3 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {formatCurrency(room.pricePerNight, hotel.currency)} x {nights} nights
                </span>
                <span>{formatCurrency(subtotal, hotel.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Taxes & Fees</span>
                <span>{formatCurrency(taxes, hotel.currency)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
                <span>Total</span>
                <span>{formatCurrency(total, hotel.currency)}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
              <Sparkles className="h-4 w-4" />
              Best rate guaranteed when you book direct.
            </div>

            <button
              onClick={() => setConfirmed(true)}
              className="mt-4 w-full rounded-xl bg-stone-900 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-black"
            >
              Confirm Booking — {formatCurrency(total, hotel.currency)}
            </button>

            <p className="mt-3 text-center text-xs text-muted-foreground">
              Free cancellation up to 48 hours before check-in
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="text-center text-muted-foreground">
                Loading booking...
              </div>
            </div>
          }
        >
          <BookingContent />
        </Suspense>
      </div>
    </div>
  );
}
