"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sparkles,
  MessageSquare,
  Loader2,
  MapPin,
  Bot,
  User,
} from "lucide-react";
import HotelCard from "@/components/HotelCard";
import VoiceButton from "@/components/VoiceButton";
import { ChatMessage, Hotel } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { hotels, getHotelsByTags, searchHotels } from "@/lib/hotels";

const suggestions = [
  "Plan a romantic anniversary weekend within 3 hours of New York, under $500/night",
  "I want a family-friendly beach vacation with snorkeling and water sports",
  "Find me a cozy mountain lodge for a winter ski trip in the Alps",
  "Suggest a luxury safari experience in Africa with stargazing",
  "I need a wellness retreat with spa, yoga, and healthy cuisine",
  "Plan a cultural trip to Japan with temples, food tours, and zen gardens",
];

function extractHotelsFromResponse(content: string): Hotel[] {
  const contentLower = content.toLowerCase();
  const matchedHotels: Hotel[] = [];

  for (const hotel of hotels) {
    if (
      contentLower.includes(hotel.name.toLowerCase()) ||
      contentLower.includes(hotel.city.toLowerCase()) ||
      contentLower.includes(hotel.location.toLowerCase())
    ) {
      matchedHotels.push(hotel);
    }
  }

  if (matchedHotels.length === 0) {
    const keywords = contentLower.match(
      /\b(beach|mountain|city|luxury|spa|ski|safari|culture|zen|romantic|adventure|tropical|urban|desert|arctic|wine)\b/g
    );
    if (keywords) {
      return getHotelsByTags([...new Set(keywords)]).slice(0, 3);
    }
    return hotels.slice(0, 2);
  }
  return matchedHotels.slice(0, 3);
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();
      const responseContent =
        data.content ||
        "I'd be happy to help you plan your perfect trip! Based on what you're looking for, here are some amazing options I've found.";

      const matchedHotels = extractHotelsFromResponse(
        content + " " + responseContent
      );

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
        hotels: matchedHotels,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const tags = content
        .toLowerCase()
        .split(/\s+/)
        .filter((w) =>
          [
            "beach",
            "mountain",
            "city",
            "luxury",
            "romantic",
            "adventure",
            "spa",
            "ski",
            "safari",
            "culture",
            "family",
            "urban",
            "tropical",
            "zen",
            "wine",
            "nature",
            "winter",
            "cozy",
            "desert",
          ].includes(w)
        );

      const matchedHotels =
        tags.length > 0
          ? getHotelsByTags(tags).slice(0, 3)
          : hotels.slice(0, 3);

      const fallbackMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: `Great choice! Based on your preferences, I've curated some fantastic options for you. Each of these properties offers a unique experience that aligns perfectly with what you're looking for.\n\nI've selected properties that offer the best combination of location, amenities, and value. You'll earn maximum Bonvoy points when you book direct — and I can help you with that right here!\n\nWould you like more details about any of these, or should I adjust the search? I can filter by budget, dates, or specific amenities.`,
        timestamp: new Date(),
        hotels: matchedHotels,
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col bg-background">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4">
        {/* Header */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-1 flex-col items-center justify-center py-12"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
              <Bot className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              AI Trip Planner
            </h1>
            <p className="mt-3 max-w-lg text-center text-muted-foreground">
              Tell me about your dream vacation — dates, budget, mood, activities
              — and I&apos;ll create your perfect itinerary with hotel
              recommendations.
            </p>

            <div className="mt-8 w-full max-w-2xl">
              <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
                Try one of these:
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    className="rounded-xl border border-border bg-card p-3 text-left text-sm text-card-foreground transition-all hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm"
                  >
                    <MapPin className="mb-1 h-3.5 w-3.5 text-blue-500" />
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Messages */}
        {messages.length > 0 && (
          <div className="flex-1 overflow-y-auto py-6">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-6 flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      <Sparkles className="h-4 w-4" />
                    </div>
                  )}

                  <div
                    className={`chat-bubble ${
                      message.role === "user"
                        ? "rounded-2xl rounded-tr-md bg-blue-600 px-4 py-3 text-white"
                        : "flex flex-col gap-4"
                    }`}
                  >
                    <div
                      className={
                        message.role === "assistant"
                          ? "rounded-2xl rounded-tl-md bg-muted px-4 py-3 text-foreground"
                          : ""
                      }
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </p>
                    </div>

                    {message.hotels && message.hotels.length > 0 && (
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {message.hotels.map((hotel, i) => (
                          <HotelCard key={hotel.id} hotel={hotel} index={i} />
                        ))}
                      </div>
                    )}
                  </div>

                  {message.role === "user" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-600">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="rounded-2xl rounded-tl-md bg-muted px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Planning your perfect trip...
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input */}
        <div className="sticky bottom-0 border-t border-border bg-background py-4">
          <div className="flex items-center gap-2">
            <VoiceButton
              onTranscript={(text) => {
                setInput(text);
                sendMessage(text);
              }}
            />
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(input);
                  }
                }}
                placeholder="Describe your dream vacation..."
                className="w-full rounded-xl border border-border bg-card px-4 py-3 pr-12 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                disabled={loading}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            AI-powered recommendations · Book direct for maximum Bonvoy points
          </p>
        </div>
      </div>
    </div>
  );
}
