"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Upload,
  Sparkles,
  Loader2,
  ImageIcon,
  X,
  ArrowRight,
} from "lucide-react";
import HotelCard from "@/components/HotelCard";
import { Hotel } from "@/lib/types";
import { hotels, getHotelsByTags } from "@/lib/hotels";

export default function ImageTripPage() {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{
    mood: string;
    scenery: string[];
    activities: string[];
    description: string;
  } | null>(null);
  const [matchedHotels, setMatchedHotels] = useState<Hotel[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleImages = [
    {
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
      label: "Tropical Beach",
    },
    {
      url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80",
      label: "Snowy Mountains",
    },
    {
      url: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&q=80",
      label: "City Skyline",
    },
    {
      url: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=600&q=80",
      label: "Serene Forest",
    },
  ];

  const analyzeImage = async (imageUrl: string) => {
    setImage(imageUrl);
    setAnalyzing(true);
    setAnalysis(null);
    setMatchedHotels([]);

    try {
      const response = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });
      const data = await response.json();

      setAnalysis(data.analysis);

      const tags = [
        ...data.analysis.scenery,
        ...data.analysis.activities,
        data.analysis.mood,
      ];
      const matched = getHotelsByTags(tags);
      setMatchedHotels(matched.length > 0 ? matched : hotels.slice(0, 4));
    } catch {
      const fallbackTags = ["tropical", "beach", "luxury"];
      setAnalysis({
        mood: "Relaxing & Scenic",
        scenery: ["beach", "tropical", "ocean"],
        activities: ["swimming", "relaxation", "water sports"],
        description:
          "This image evokes a sense of peaceful tropical escape with crystal-clear waters and pristine sandy beaches. Perfect for a relaxing getaway with stunning natural beauty.",
      });
      setMatchedHotels(getHotelsByTags(fallbackTags).slice(0, 6));
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      analyzeImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-2 text-sm font-medium text-pink-700">
              <Camera className="h-4 w-4" />
              Image to Trip
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Upload a Photo,{" "}
              <span className="gradient-text">Find Your Trip</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Share any image — a sunset, a cozy cabin, a bustling city — and our
              AI will match you with destinations that capture that exact vibe.
            </p>
          </motion.div>
        </div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10"
        >
          {!image ? (
            <div className="mx-auto max-w-2xl">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group cursor-pointer rounded-2xl border-2 border-dashed border-border bg-muted/30 p-12 text-center transition-all hover:border-blue-400 hover:bg-blue-50/50"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 transition-transform group-hover:scale-110">
                  <Upload className="h-8 w-8" />
                </div>
                <p className="mt-4 text-lg font-medium">
                  Drop your inspiration photo here
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  or click to browse · JPG, PNG, WebP
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <div className="mt-8">
                <p className="text-center text-sm font-medium text-muted-foreground">
                  Or try a sample:
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {sampleImages.map((sample) => (
                    <button
                      key={sample.label}
                      onClick={() => analyzeImage(sample.url)}
                      className="group relative overflow-hidden rounded-xl"
                    >
                      <img
                        src={sample.url}
                        alt={sample.label}
                        className="h-32 w-full object-cover transition-transform group-hover:scale-110"
                      />
                      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-2">
                        <span className="text-xs font-medium text-white">
                          {sample.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-4xl">
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={image}
                  alt="Uploaded"
                  className="h-80 w-full object-cover"
                />
                <button
                  onClick={() => {
                    setImage(null);
                    setAnalysis(null);
                    setMatchedHotels([]);
                  }}
                  className="absolute right-3 top-3 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                >
                  <X className="h-4 w-4" />
                </button>

                {analyzing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                    <Loader2 className="h-10 w-10 animate-spin text-white" />
                    <p className="mt-3 text-lg font-medium text-white">
                      Analyzing your vibe...
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Analysis Result */}
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mx-auto mt-8 max-w-4xl"
            >
              <div className="rounded-2xl border border-border bg-gradient-to-r from-blue-50 to-purple-50 p-6">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  AI Vibe Analysis
                </div>
                <p className="mt-3 text-gray-700">{analysis.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
                    Mood: {analysis.mood}
                  </span>
                  {analysis.scenery.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                    >
                      {s}
                    </span>
                  ))}
                  {analysis.activities.map((a) => (
                    <span
                      key={a}
                      className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Matched Hotels */}
        <AnimatePresence>
          {matchedHotels.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12"
            >
              <h2 className="text-2xl font-bold">
                Destinations That Match Your Vibe
              </h2>
              <p className="mt-1 text-muted-foreground">
                Based on the mood, scenery, and activities in your photo
              </p>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {matchedHotels.slice(0, 6).map((hotel, i) => (
                  <HotelCard key={hotel.id} hotel={hotel} index={i} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
