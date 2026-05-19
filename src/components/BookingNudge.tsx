"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Clock, Sparkles, X, Flame } from "lucide-react";

interface Nudge {
  id: string;
  icon: React.ReactNode;
  message: string;
  type: "scarcity" | "points" | "savings" | "trending";
  color: string;
}

const nudges: Nudge[] = [
  {
    id: "scarcity",
    icon: <Flame className="h-4 w-4" />,
    message: "Only 3 rooms left at this rate! 12 people viewed today.",
    type: "scarcity",
    color: "bg-red-50 border-red-200 text-red-800",
  },
  {
    id: "points",
    icon: <Sparkles className="h-4 w-4" />,
    message:
      "You'll earn 42,000 Bonvoy points with this booking — enough for a free night!",
    type: "points",
    color: "bg-purple-50 border-purple-200 text-purple-800",
  },
  {
    id: "savings",
    icon: <TrendingUp className="h-4 w-4" />,
    message: "Book direct and save $45 compared to third-party sites.",
    type: "savings",
    color: "bg-green-50 border-green-200 text-green-800",
  },
  {
    id: "trending",
    icon: <Clock className="h-4 w-4" />,
    message: "Prices for this destination typically rise 15% in the next 2 weeks.",
    type: "trending",
    color: "bg-amber-50 border-amber-200 text-amber-800",
  },
];

export default function BookingNudge() {
  const [currentNudge, setCurrentNudge] = useState(0);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNudge((prev) => {
        let next = (prev + 1) % nudges.length;
        while (dismissed.includes(nudges[next].id) && next !== prev) {
          next = (next + 1) % nudges.length;
        }
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [dismissed]);

  const activeNudge = nudges[currentNudge];
  if (dismissed.includes(activeNudge.id)) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeNudge.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`flex items-center gap-3 rounded-xl border p-3 ${activeNudge.color}`}
      >
        {activeNudge.icon}
        <span className="flex-1 text-sm font-medium">{activeNudge.message}</span>
        <button
          onClick={() => setDismissed([...dismissed, activeNudge.id])}
          className="rounded-full p-1 transition-colors hover:bg-black/10"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
