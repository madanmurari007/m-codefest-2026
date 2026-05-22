"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Upload,
  Sparkles,
  Loader2,
  X,
  Globe,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import HotelCard from "@/components/HotelCard";
import type { ChatHotelRec } from "@/lib/types";

interface ImageAnalysis {
  mood: string;
  scenery: string[];
  activities: string[];
  description: string;
}

const REGION_OPTIONS = [
  "Europe",
  "Mediterranean",
  "Asia",
  "Southeast Asia",
  "Middle East",
  "Africa",
  "North America",
  "South America",
  "Caribbean",
  "Oceania",
  "Indian Ocean",
];

const SAMPLE_IMAGES = [
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

/**
 * Coarse timezone → region/country map so "Near me" can always provide a
 * useful default even when the user denies geolocation permission.
 */
function regionFromTimezone(): string | null {
  if (typeof Intl === "undefined") return null;
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (!tz) return null;
    const continent = tz.split("/")[0];
    switch (continent) {
      case "Europe":
        return "Europe";
      case "Asia":
        return "Asia";
      case "Africa":
        return "Africa";
      case "Australia":
      case "Pacific":
        return "Oceania";
      case "America":
        if (
          /Argentina|Sao_Paulo|Buenos|Bogota|Lima|Santiago|Caracas|Brazil/i.test(
            tz,
          )
        ) {
          return "South America";
        }
        if (
          /Havana|Port-au-Prince|Santo_Domingo|Cayman|Jamaica|Nassau|Barbados|Puerto/i.test(
            tz,
          )
        ) {
          return "Caribbean";
        }
        return "North America";
      case "Indian":
        return "Indian Ocean";
      default:
        return null;
    }
  } catch {
    return null;
  }
}

interface NearbyResult {
  label: string;
  promptHint: string;
}

/**
 * Tries geolocation → reverse-geocode via free OpenStreetMap Nominatim.
 * Falls back to a timezone-based region label if anything goes wrong.
 */
async function detectNearbyLocation(): Promise<NearbyResult> {
  const fallback: NearbyResult = (() => {
    const region = regionFromTimezone();
    return region
      ? { label: region, promptHint: region }
      : { label: "your region", promptHint: "near my current region" };
  })();

  if (
    typeof navigator === "undefined" ||
    typeof navigator.geolocation === "undefined"
  ) {
    return fallback;
  }

  const coords = await new Promise<GeolocationCoordinates | null>((resolve) => {
    const timer = setTimeout(() => resolve(null), 6000);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timer);
        resolve(pos.coords);
      },
      () => {
        clearTimeout(timer);
        resolve(null);
      },
      { enableHighAccuracy: false, maximumAge: 60_000, timeout: 5000 },
    );
  });

  if (!coords) return fallback;

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json&zoom=10`,
      {
        headers: { Accept: "application/json" },
      },
    );
    if (!res.ok) return fallback;
    const data: {
      address?: {
        city?: string;
        town?: string;
        village?: string;
        county?: string;
        state?: string;
        country?: string;
      };
    } = await res.json();
    const a = data.address ?? {};
    const city = a.city || a.town || a.village || a.county || a.state;
    const country = a.country;
    if (city && country) {
      return {
        label: `${city}, ${country}`,
        promptHint: `within a few hours of ${city}, ${country}`,
      };
    }
    if (country) {
      return { label: country, promptHint: `in ${country}` };
    }
    return fallback;
  } catch {
    return fallback;
  }
}

export default function ImageTripPage() {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ImageAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<ChatHotelRec[]>([]);
  const [recsLoading, setRecsLoading] = useState(false);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [nearby, setNearby] = useState<NearbyResult | null>(null);
  const [detectingNearby, setDetectingNearby] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  /** Build the chat prompt from the AI vibe analysis + an optional filter. */
  const buildPrompt = useCallback(
    (
      analysisData: ImageAnalysis,
      filter: { region?: string; nearby?: NearbyResult },
    ) => {
      const parts: string[] = [];
      parts.push(`Plan a stay that captures this vibe: ${analysisData.mood}.`);
      if (analysisData.scenery.length > 0) {
        parts.push(`Scenery: ${analysisData.scenery.join(", ")}.`);
      }
      if (analysisData.activities.length > 0) {
        parts.push(`Activities I want: ${analysisData.activities.join(", ")}.`);
      }
      if (filter.region) {
        parts.push(`Focus only on properties in ${filter.region}.`);
      } else if (filter.nearby) {
        parts.push(
          `Focus on properties ${filter.nearby.promptHint}, ideally drivable from there.`,
        );
      }
      return parts.join(" ");
    },
    [],
  );

  const fetchHotelsForVibe = useCallback(
    async (
      analysisData: ImageAnalysis,
      filter: { region?: string; nearby?: NearbyResult },
    ) => {
      setRecsLoading(true);
      try {
        const prompt = buildPrompt(analysisData, filter);
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: prompt }],
          }),
        });
        const data: { recommendations?: ChatHotelRec[] } = await res.json();
        setRecommendations(data.recommendations ?? []);
      } catch {
        setRecommendations([]);
      } finally {
        setRecsLoading(false);
      }
    },
    [buildPrompt],
  );

  const analyzeImage = useCallback(
    async (imageUrl: string) => {
      setImage(imageUrl);
      setAnalyzing(true);
      setAnalysis(null);
      setRecommendations([]);
      setActiveRegion(null);
      setValidationError(null);

      let analysisData: ImageAnalysis;
      try {
        const response = await fetch("/api/analyze-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl }),
        });
        const data = await response.json();

        // Image rejected by the verifier — show error and reset state.
        if (data && data.valid === false) {
          setValidationError(
            typeof data.reason === "string" && data.reason.trim()
              ? data.reason
              : "That doesn't look like a travel destination. Please upload a photo of a place, landscape, or landmark.",
          );
          setImage(null);
          setAnalyzing(false);
          return;
        }

        analysisData = data.analysis;
      } catch {
        analysisData = {
          mood: "Relaxing & Scenic",
          scenery: ["beach", "tropical", "ocean"],
          activities: ["swimming", "relaxation", "water sports"],
          description:
            "This image evokes a sense of peaceful tropical escape with crystal-clear waters and pristine sandy beaches.",
        };
      }
      setAnalysis(analysisData);
      setAnalyzing(false);

      await fetchHotelsForVibe(analysisData, {});
    },
    [fetchHotelsForVibe],
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Allow re-selecting the same file later by clearing the input value.
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      analyzeImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleNearbyClick = async () => {
    setDetectingNearby(true);
    setActiveRegion(null);
    try {
      const result = await detectNearbyLocation();
      setNearby(result);
      if (analysis) {
        await fetchHotelsForVibe(analysis, { nearby: result });
      }
    } finally {
      setDetectingNearby(false);
    }
  };

  const handleRegionClick = (region: string) => {
    const next = activeRegion === region ? null : region;
    setNearby(null);
    setActiveRegion(next);
    if (analysis) {
      void fetchHotelsForVibe(analysis, { region: next ?? undefined });
    }
  };

  const filterActive = activeRegion !== null || nearby !== null;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-2 text-sm font-medium text-rose-800">
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
              <AnimatePresence>
                {validationError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                    role="alert"
                  >
                    <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span className="flex-1">{validationError}</span>
                    <button
                      type="button"
                      onClick={() => setValidationError(null)}
                      aria-label="Dismiss"
                      className="rounded p-0.5 text-red-700 hover:bg-red-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="group cursor-pointer rounded-2xl border-2 border-dashed border-border bg-muted/30 p-12 text-center transition-all hover:border-amber-400 hover:bg-amber-50/50"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 transition-transform group-hover:scale-110">
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

              <div className="mt-4 flex items-center justify-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  on mobile
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  cameraInputRef.current?.click();
                }}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-stone-900 bg-stone-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-black"
              >
                <Camera className="h-4 w-4" />
                Take a photo
              </button>
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="mt-8">
                <p className="text-center text-sm font-medium text-muted-foreground">
                  Or try a sample:
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {SAMPLE_IMAGES.map((sample) => (
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
                    setRecommendations([]);
                    setActiveRegion(null);
                    setNearby(null);
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
              <div className="rounded-2xl border border-border bg-gradient-to-r from-amber-50 to-stone-100 p-6">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <Sparkles className="h-5 w-5 text-amber-700" />
                  AI Vibe Analysis
                </div>
                <p className="mt-3 text-gray-700">{analysis.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                    Mood: {analysis.mood}
                  </span>
                  {analysis.scenery.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-800"
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

        {/* Region & Nearby Filters */}
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-6 max-w-4xl space-y-4"
          >
            <div className="rounded-2xl border border-border bg-card/60 px-4 py-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-amber-700">
                  <Globe className="h-3.5 w-3.5" /> Filter by region
                </div>
                {REGION_OPTIONS.map((region) => {
                  const selected = activeRegion === region;
                  return (
                    <button
                      key={region}
                      type="button"
                      onClick={() => handleRegionClick(region)}
                      disabled={recsLoading}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
                        selected
                          ? "border-stone-900 bg-stone-900 text-white"
                          : "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
                      }`}
                    >
                      {region}
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-amber-700">
                  <MapPin className="h-3.5 w-3.5" /> Nearby location
                </div>
                <button
                  type="button"
                  onClick={handleNearbyClick}
                  disabled={detectingNearby || recsLoading}
                  className="inline-flex items-center gap-2 rounded-full border border-stone-900 bg-stone-900 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-black disabled:opacity-50"
                >
                  {detectingNearby ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <MapPin className="h-3 w-3" />
                  )}
                  {nearby ? `Near ${nearby.label}` : "Use my location"}
                </button>
                {nearby && (
                  <button
                    type="button"
                    onClick={() => setNearby(null)}
                    disabled={recsLoading}
                    className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
                  >
                    Clear
                  </button>
                )}
              </div>

              {filterActive && (
                <div className="mt-3 text-xs text-muted-foreground">
                  Showing properties{" "}
                  {activeRegion
                    ? `in ${activeRegion}`
                    : nearby
                      ? `near ${nearby.label}`
                      : "worldwide"}
                  .
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Matched Hotels */}
        <AnimatePresence>
          {(recommendations.length > 0 || recsLoading) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10"
            >
              <h2 className="text-2xl font-bold">
                Destinations That Match Your Vibe
              </h2>
              <p className="mt-1 text-muted-foreground">
                {activeRegion
                  ? `Hand-picked across ${activeRegion} for the mood in your photo.`
                  : nearby
                    ? `Near ${nearby.label} — matched to the mood in your photo.`
                    : "Tap any card for full details. Add a region filter to localize the picks."}
              </p>

              {recsLoading ? (
                <div className="mt-8 flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-12 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching properties…
                </div>
              ) : (
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {recommendations.map((rec, i) => (
                    <HotelCard
                      key={rec.hotel.id}
                      hotel={rec.hotel}
                      index={i}
                      headline={rec.headline}
                      reason={rec.reason}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
