"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, X, Award, Gift, Globe } from "lucide-react";

export default function BonvoyEnrollment() {
  const [isOpen, setIsOpen] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [email, setEmail] = useState("");

  const benefits = [
    { icon: <Award className="h-5 w-5" />, text: "Earn points on every stay" },
    { icon: <Gift className="h-5 w-5" />, text: "Free nights starting at 25K points" },
    { icon: <Globe className="h-5 w-5" />, text: "Access to 8,000+ properties worldwide" },
  ];

  if (enrolled) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-green-200 bg-green-50 p-5 text-center"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500">
          <Check className="h-6 w-6 text-white" />
        </div>
        <h3 className="mt-3 text-lg font-semibold text-green-800">
          Welcome to Bonvoy!
        </h3>
        <p className="mt-1 text-sm text-green-600">
          You&apos;re now earning points on every stay. Your member ID has been sent
          to {email}.
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 p-5 text-left transition-all hover:shadow-md"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">
                Join Bonvoy — It&apos;s Free
              </div>
              <div className="text-sm text-gray-500">
                Save your travel preferences & earn points
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white">
            Enroll
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Join Bonvoy
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-1 hover:bg-gray-100"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              <p className="mt-2 text-sm text-gray-500">
                Unlock exclusive benefits and start earning points toward free
                stays worldwide.
              </p>

              <div className="mt-5 space-y-3">
                {benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-700">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      {b.icon}
                    </div>
                    <span className="text-sm font-medium">{b.text}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
                <button
                  onClick={() => {
                    setEnrolled(true);
                    setIsOpen(false);
                  }}
                  className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Create My Bonvoy Account
                </button>
              </div>

              <p className="mt-3 text-center text-xs text-gray-400">
                By enrolling you agree to the Bonvoy Terms & Conditions
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
