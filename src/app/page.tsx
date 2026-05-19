"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Camera,
  MessageSquare,
  Compass,
  Sparkles,
  ArrowRight,
  Star,
  Globe,
  Shield,
  Mic,
} from "lucide-react";
import { hotels } from "@/lib/hotels";
import HotelCard from "@/components/HotelCard";
import BonvoyEnrollment from "@/components/BonvoyEnrollment";

const features = [
  {
    icon: Camera,
    title: "Image to Trip",
    description:
      "Upload any photo and our AI will find destinations that match the vibe.",
    href: "/image-trip",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    icon: MessageSquare,
    title: "AI Trip Planner",
    description:
      "Chat naturally to plan your perfect trip — dates, budget, activities, all handled.",
    href: "/chat",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    icon: Compass,
    title: "Mood Discovery",
    description:
      "Browse destinations by mood — romance, adventure, wellness, culture, and more.",
    href: "/discover",
    gradient: "from-purple-500 to-violet-600",
  },
  {
    icon: Mic,
    title: "Voice Booking",
    description:
      "Book hands-free with voice commands. Just say what you want and we'll handle the rest.",
    href: "/chat",
    gradient: "from-teal-500 to-emerald-600",
  },
];

const stats = [
  { value: "8,000+", label: "Properties Worldwide" },
  { value: "200M+", label: "Bonvoy Members" },
  { value: "139", label: "Countries & Territories" },
  { value: "30+", label: "World-Class Brands" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 px-4 py-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-blue-200 backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Powered by AI — Reimagine How You Travel
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
              Your Dream Trip,{" "}
              <span className="gradient-text">One Photo Away</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100/80 sm:text-xl">
              Upload a photo, describe a vibe, or just chat — our AI finds your
              perfect destination and books it directly. No OTAs, no markups,
              maximum Bonvoy points.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/image-trip"
                className="group flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-600/30"
              >
                <Camera className="h-5 w-5" />
                Try Image to Trip
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/chat"
                className="flex items-center gap-2 rounded-xl bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur transition-all hover:bg-white/20"
              >
                <MessageSquare className="h-5 w-5" />
                Chat with AI Planner
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-muted/50 py-12">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 sm:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl font-extrabold text-foreground">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Four Ways to Find Your{" "}
              <span className="gradient-text">Perfect Stay</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Whether you think in images, words, moods, or voice — we speak
              your language.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href={feature.href}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg`}
                  >
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-blue-600 transition-all group-hover:gap-2">
                    Try it now <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="bg-muted/30 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Featured Properties
              </h2>
              <p className="mt-2 text-muted-foreground">
                Hand-picked destinations our AI loves to recommend
              </p>
            </div>
            <Link
              href="/discover"
              className="hidden items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 sm:flex"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {hotels.slice(0, 6).map((hotel, i) => (
              <HotelCard key={hotel.id} hotel={hotel} index={i} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/discover"
              className="inline-flex items-center gap-1 text-sm font-medium text-blue-600"
            >
              View all properties <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Book Direct */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Why Book <span className="gradient-text">Direct</span>?
            </h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: "Maximum Points",
                desc: "Earn the most Bonvoy points when you book through our direct channel.",
              },
              {
                icon: Shield,
                title: "Best Rate Guarantee",
                desc: "Find a lower rate elsewhere? We'll match it and give you 25% off.",
              },
              {
                icon: Globe,
                title: "Exclusive Perks",
                desc: "Free Wi-Fi, member rates, mobile check-in, and room upgrades when available.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-border bg-card p-6 text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bonvoy Enrollment */}
      <section className="bg-muted/30 py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          <BonvoyEnrollment />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              <span className="font-bold">
                Wanderlust<span className="text-blue-500">AI</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Codefest 4.0 Demo — AI-Powered Travel Companion
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
