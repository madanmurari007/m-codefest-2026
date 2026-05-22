"use client";

import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Filter, X, ArrowRight, Sparkles } from "lucide-react";
import HotelCard from "@/components/HotelCard";
import { hotels, moodCategories, getHotelsByTags } from "@/lib/hotels";
import { Hotel } from "@/lib/types";

export default function DiscoverPage() {
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>(hotels);
  const resultsRef = useRef<HTMLDivElement>(null);

  /** Precompute destination counts per mood once so each card can show a live badge. */
  const moodCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const mood of moodCategories) {
      counts[mood.id] = getHotelsByTags(mood.tags).length;
    }
    return counts;
  }, []);

  const toggleMood = (moodId: string) => {
    const mood = moodCategories.find((m) => m.id === moodId);
    if (!mood) return;

    let newSelected: string[];
    if (selectedMoods.includes(moodId)) {
      newSelected = selectedMoods.filter((id) => id !== moodId);
    } else {
      newSelected = [...selectedMoods, moodId];
    }
    setSelectedMoods(newSelected);

    if (newSelected.length === 0) {
      setFilteredHotels(hotels);
    } else {
      const tags = newSelected.flatMap(
        (id) => moodCategories.find((m) => m.id === id)?.tags || []
      );
      const matched = getHotelsByTags(tags);
      setFilteredHotels(matched.length > 0 ? matched : hotels);
      // Smooth-scroll the results into view so the mood click feels like an
      // instant search.
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  const clearFilters = () => {
    setSelectedMoods([]);
    setFilteredHotels(hotels);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800">
            <Compass className="h-4 w-4" />
            Mood Discovery
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Let&apos;s select your{" "}
            <span className="gradient-text">getaway mood</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            One tap on any mood and we instantly curate the perfect
            destinations — honeymoons, weddings, wildlife escapes, and more.
          </p>
        </motion.div>

        {/* Mood Cards */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {moodCategories.map((mood, i) => {
            const selected = selectedMoods.includes(mood.id);
            const count = moodCounts[mood.id] ?? 0;
            return (
              <motion.button
                key={mood.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => toggleMood(mood.id)}
                className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-card text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ${
                  selected
                    ? "border-amber-600 ring-2 ring-amber-600 ring-offset-2"
                    : "border-border"
                }`}
              >
                {/* Image (top) */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={mood.image}
                    alt={mood.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${mood.gradient} opacity-30 transition-opacity group-hover:opacity-50`}
                  />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-gray-800 shadow-sm">
                    <Sparkles className="h-3 w-3 text-amber-700" />
                    {count} destinations
                  </span>
                  <span className="absolute right-3 top-3 text-3xl drop-shadow-lg">
                    {mood.emoji}
                  </span>
                  {selected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute bottom-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-white shadow"
                    >
                      <span className="text-sm">&#10003;</span>
                    </motion.div>
                  )}
                </div>

                {/* Heading + description (below image) */}
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-lg font-semibold text-card-foreground">
                    {mood.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {mood.description}
                  </p>
                  <div
                    className={`mt-3 inline-flex items-center gap-1 text-sm font-medium transition-all ${
                      selected
                        ? "text-amber-700"
                        : "text-amber-700 group-hover:gap-2"
                    }`}
                  >
                    {selected ? "Selected" : "Start exploring"}
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Active Filters */}
        {selectedMoods.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-6 flex items-center gap-3"
          >
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-2">
              {selectedMoods.map((id) => {
                const mood = moodCategories.find((m) => m.id === id);
                return mood ? (
                  <span
                    key={id}
                    className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800"
                  >
                    {mood.emoji} {mood.name}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMood(id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ) : null;
              })}
            </div>
            <button
              onClick={clearFilters}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Clear all
            </button>
          </motion.div>
        )}

        {/* Results */}
        <div ref={resultsRef} className="mt-10 scroll-mt-24">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {selectedMoods.length > 0
                ? `${filteredHotels.length} Destinations for You`
                : "All Destinations"}
            </h2>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredHotels.map((hotel, i) => (
                <HotelCard key={hotel.id} hotel={hotel} index={i} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
