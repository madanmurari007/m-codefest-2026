"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sparkles,
  Loader2,
  MapPin,
  Bot,
  User,
  Camera,
  Mic,
  MessageSquare,
  Globe,
} from "lucide-react";
import HotelCard from "@/components/HotelCard";
import VoiceButton from "@/components/VoiceButton";
import { ChatMessage, ChatHotelRec } from "@/lib/types";
import { generateId } from "@/lib/utils";

const suggestions = [
  "Plan a romantic anniversary weekend within 3 hours of New York, under $500/night",
  "I want a family-friendly beach vacation with snorkeling and water sports",
  "Find me a cozy mountain lodge for a winter ski trip in the Alps",
  "Suggest a signature safari experience in Africa with stargazing",
  "I need a wellness retreat with spa, yoga, and healthy cuisine",
  "Plan a cultural trip to Japan with temples, food tours, and zen gardens",
];

export default function ChatPage() {
  const router = useRouter();
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

      const data: {
        content?: string;
        recommendations?: ChatHotelRec[];
        suggestedRegions?: string[];
        source?: string;
      } = await response.json();

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content:
          data.content ||
          "Here are a few stays that match what you're looking for — each card has my reasoning attached.",
        timestamp: new Date(),
        recommendations: data.recommendations ?? [],
        suggestedRegions: data.suggestedRegions ?? [],
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      // Network error — the API itself already serves a structured fallback,
      // so this branch only catches transport failures.
      const fallbackMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content:
          "I couldn't reach the planner just now. Please try again in a moment.",
        timestamp: new Date(),
        recommendations: [],
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
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-700 to-stone-900 text-white shadow-lg">
              <Bot className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              AI Trip Planner
            </h1>
            <p className="mt-3 max-w-lg text-center text-muted-foreground">
              Tell me about your dream vacation — dates, budget, mood,
              activities — and I&apos;ll create your perfect itinerary with
              hotel recommendations. Type, talk, or share a photo.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1">
                <MessageSquare className="h-3 w-3 text-amber-700" /> Chat
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1">
                <Mic className="h-3 w-3 text-red-500" /> Voice
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1">
                <Camera className="h-3 w-3 text-rose-600" /> Image
              </span>
            </div>

            <div className="mt-8 w-full max-w-2xl">
              <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
                Try one of these:
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    className="rounded-xl border border-border bg-card p-3 text-left text-sm text-card-foreground transition-all hover:border-amber-300 hover:bg-amber-50 hover:shadow-sm"
                  >
                    <MapPin className="mb-1 h-3.5 w-3.5 text-amber-700" />
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
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-700 to-stone-900 text-white">
                      <Sparkles className="h-4 w-4" />
                    </div>
                  )}

                  <div
                    className={`chat-bubble ${
                      message.role === "user"
                        ? "rounded-2xl rounded-tr-md bg-stone-900 px-4 py-3 text-white"
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

                    {message.role === "assistant" &&
                      message.suggestedRegions &&
                      message.suggestedRegions.length > 0 && (
                        <div className="rounded-2xl border border-border bg-card/60 px-4 py-3">
                          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-amber-700">
                            <Globe className="h-3 w-3" /> Filter by region
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {message.suggestedRegions.map((region) => (
                              <button
                                key={region}
                                type="button"
                                onClick={() =>
                                  sendMessage(`Show options in ${region}`)
                                }
                                disabled={loading}
                                className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 transition-colors hover:bg-amber-100 disabled:opacity-50"
                              >
                                {region}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                    {message.recommendations &&
                      message.recommendations.length > 0 && (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {message.recommendations.map((rec, i) => (
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
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-700 to-stone-900 text-white">
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
            <button
              type="button"
              onClick={() => router.push("/image-trip")}
              title="Plan a trip from an image"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-rose-100 hover:text-rose-700"
            >
              <Camera className="h-4 w-4" />
            </button>
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
                className="w-full rounded-xl border border-border bg-card px-4 py-3 pr-12 text-sm focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-200"
                disabled={loading}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-stone-900 p-2 text-white transition-colors hover:bg-black disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            AI-powered recommendations · Best rate guaranteed when you book direct
          </p>
        </div>
      </div>
    </div>
  );
}
