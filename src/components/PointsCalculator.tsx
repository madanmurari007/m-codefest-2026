"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Gift } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface PointsCalculatorProps {
  pointsPerNight: number;
  pricePerNight: number;
  nights?: number;
}

export default function PointsCalculator({
  pointsPerNight,
  pricePerNight,
  nights = 3,
}: PointsCalculatorProps) {
  const [selectedNights, setSelectedNights] = useState(nights);
  const totalPoints = pointsPerNight * selectedNights;
  const totalCost = pricePerNight * selectedNights;
  const pointsValue = (totalPoints * 0.008).toFixed(0);

  const milestones = [
    { points: 25000, label: "Free Night at Select Hotels" },
    { points: 50000, label: "Free Night at Premium Hotels" },
    { points: 85000, label: "Free Night at Luxury Resorts" },
  ];

  const nextMilestone = milestones.find((m) => m.points > totalPoints);

  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-blue-50 to-purple-50 p-5">
      <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
        <Sparkles className="h-5 w-5 text-purple-500" />
        Bonvoy Points Calculator
      </div>

      <div className="mt-4 flex items-center gap-3">
        <label className="text-sm font-medium text-gray-600">Nights:</label>
        <div className="flex gap-2">
          {[1, 2, 3, 5, 7].map((n) => (
            <button
              key={n}
              onClick={() => setSelectedNights(n)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedNights === n
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-white p-3 text-center shadow-sm">
          <div className="text-xs text-gray-500">Total Cost</div>
          <div className="mt-1 text-lg font-bold text-gray-900">
            ${formatNumber(totalCost)}
          </div>
        </div>
        <div className="rounded-xl bg-white p-3 text-center shadow-sm">
          <div className="text-xs text-gray-500">Points Earned</div>
          <motion.div
            key={totalPoints}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="mt-1 text-lg font-bold text-purple-600"
          >
            {formatNumber(totalPoints)}
          </motion.div>
        </div>
        <div className="rounded-xl bg-white p-3 text-center shadow-sm">
          <div className="text-xs text-gray-500">Points Value</div>
          <div className="mt-1 text-lg font-bold text-green-600">
            ~${pointsValue}
          </div>
        </div>
      </div>

      {nextMilestone && (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-white p-3 shadow-sm">
          <Gift className="mt-0.5 h-4 w-4 shrink-0 text-purple-500" />
          <div>
            <div className="text-sm font-medium text-gray-800">
              {formatNumber(nextMilestone.points - totalPoints)} more points to:
            </div>
            <div className="text-xs text-gray-500">{nextMilestone.label}</div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min(
                    (totalPoints / nextMilestone.points) * 100,
                    100
                  )}%`,
                }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
              />
            </div>
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
        <TrendingUp className="h-3 w-3" />
        Book direct to earn maximum Bonvoy points
      </div>
    </div>
  );
}
