"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, BadgePercent, Users2 } from "lucide-react";
import { getAmenityInfo } from "@/lib/amenity-info";

interface AmenityHoverProps {
  amenity: string;
  children: React.ReactNode;
}

/**
 * Wraps an amenity chip and reveals a rich popup card on hover / focus
 * with happy hours, discounts, crowd vibe, image and description.
 */
export default function AmenityHover({ amenity, children }: AmenityHoverProps) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const info = getAmenityInfo(amenity);

  const show = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpen(true);
  };

  const hide = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 100);
  };

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      tabIndex={0}
    >
      {children}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 z-30 mt-3 w-72 -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
            role="tooltip"
          >
            <div className="relative h-32 w-full">
              <img
                src={info.image}
                alt={info.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-3 right-3">
                <h4 className="text-base font-semibold text-white">
                  {info.name}
                </h4>
                {info.crowd && (
                  <div className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
                    <Users2 className="h-2.5 w-2.5" />
                    {info.crowd}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2.5 p-3.5">
              <p className="text-xs leading-relaxed text-muted-foreground">
                {info.description}
              </p>

              {info.happyHours && (
                <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-2 text-xs text-amber-900">
                  <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
                  <span>
                    <span className="font-semibold">Happy hours:</span>{" "}
                    {info.happyHours}
                  </span>
                </div>
              )}

              {info.discounts && (
                <div className="flex items-start gap-2 rounded-lg bg-green-50 p-2 text-xs text-green-900">
                  <BadgePercent className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />
                  <span>
                    <span className="font-semibold">Guest perk:</span>{" "}
                    {info.discounts}
                  </span>
                </div>
              )}

              {info.highlights && info.highlights.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {info.highlights.map((h) => (
                    <span
                      key={h}
                      className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-800"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
