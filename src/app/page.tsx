"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Compass,
  Sparkles,
  ArrowRight,
  Globe,
  Shield,
} from "lucide-react";
import { hotels } from "@/lib/hotels";
import HotelCard from "@/components/HotelCard";

const features = [
  {
    icon: MessageSquare,
    title: "AI Trip Planner",
    description:
      "Chat, speak, or upload a photo — one AI assistant handles dates, budget, activities, and more.",
    href: "/chat",
    gradient: "from-stone-800 to-stone-950",
  },
  {
    icon: Compass,
    title: "Mood Discovery",
    description:
      "Browse destinations by mood — romance, adventure, wellness, culture, and more.",
    href: "/discover",
    gradient: "from-amber-700 to-stone-900",
  },
];

const stats = [
  { value: "8,000+", label: "Properties Worldwide" },
  { value: "139", label: "Countries & Territories" },
  { value: "50", label: "Curated Vibes" },
  { value: "4.8★", label: "Average Guest Rating" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-950 to-black px-4 py-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-amber-500/20 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-amber-500/20 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-600/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-amber-100 backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Powered by AI — Reimagine How You Travel
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
              Your Dream Trip,{" "}
              <span className="gradient-text">One Photo Away</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-amber-50/80 sm:text-xl">
              Upload a photo, describe a vibe, or just chat — our AI finds your
              perfect destination and books it directly. No OTAs, no markups,
              just better stays.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/chat"
                className="group flex items-center gap-2 rounded-xl bg-stone-900 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-stone-900/25 transition-all hover:bg-stone-800 hover:shadow-xl hover:shadow-stone-900/30"
              >
                <MessageSquare className="h-5 w-5" />
                Chat with AI Planner
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/discover"
                className="flex items-center gap-2 rounded-xl bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur transition-all hover:bg-white/20"
              >
                <Compass className="h-5 w-5" />
                Explore Destinations
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
              Two Ways to Find Your{" "}
              <span className="gradient-text">Perfect Stay</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Whether you want to chat, speak, share a photo, or browse by mood
              — we speak your language.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
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
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-amber-700 transition-all group-hover:gap-2">
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
              className="hidden items-center gap-1 text-sm font-medium text-amber-700 hover:text-amber-800 sm:flex"
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
              className="inline-flex items-center gap-1 text-sm font-medium text-amber-700"
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
                title: "Personalized Picks",
                desc: "Our AI matches your vibe to properties you'll actually love — not just the loudest listings.",
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
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-700" />
              <span className="font-bold">
                Wanderlust<span className="text-amber-700">AI</span>
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
