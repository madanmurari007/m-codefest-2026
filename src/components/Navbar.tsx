"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  MessageSquare,
  Camera,
  Menu,
  X,
  Sparkles,
  User,
} from "lucide-react";

const navLinks = [
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/image-trip", label: "Image to Trip", icon: Camera },
  { href: "/chat", label: "AI Planner", icon: MessageSquare },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-blue-500" />
          <span className="text-xl font-bold tracking-tight">
            Wanderlust<span className="text-blue-500">AI</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/booking"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Book Now
          </Link>
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-blue-100 hover:text-blue-600">
            <User className="h-4 w-4" />
          </button>
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border md:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
              <Link
                href="/booking"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-medium text-white"
              >
                Book Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
