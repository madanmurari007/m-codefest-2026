"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Filter, X } from "lucide-react";
import HotelCard from "@/components/HotelCard";
import { hotels, moodCategories, getHotelsByTags } from "@/lib/hotels";
import { Hotel } from "@/lib/types";

export default function DiscoverPage() {
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>(hotels);

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
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700">
            <Compass className="h-4 w-4" />
            Mood Discovery
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            How Do You Want to{" "}
            <span className="gradient-text">Feel?</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Select the moods that resonate with you and we&apos;ll curate the
            perfect destinations.
          </p>
        </motion.div>

        {/* Mood Cards */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {moodCategories.map((mood, i) => (
            <motion.button
              key={mood.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => toggleMood(mood.id)}
              className={`group relative overflow-hidden rounded-2xl transition-all ${
                selectedMoods.includes(mood.id)
                  ? "ring-2 ring-blue-500 ring-offset-2 scale-[1.02]"
                  : "hover:scale-[1.02]"
              }`}
            >
              <div className="relative h-40">
                <img
                  src={mood.image}
                  alt={mood.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${mood.gradient} opacity-70`}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <span className="text-3xl">{mood.emoji}</span>
                  <span className="mt-1 text-sm font-bold">{mood.name}</span>
                </div>
                {selectedMoods.includes(mood.id) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white"
                  >
                    <span className="text-xs">&#10003;</span>
                  </motion.div>
                )}
              </div>
            </motion.button>
          ))}
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
                    className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700"
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
        <div className="mt-10">
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
