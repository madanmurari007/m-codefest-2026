"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Loader2 } from "lucide-react";

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
}

export default function VoiceButton({ onTranscript }: VoiceButtonProps) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<ReturnType<typeof createRecognition> | null>(null);

  const createRecognition = useCallback(() => {
    const SpeechRecognition =
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return null;
    }
    const recognition = new (SpeechRecognition as new () => SpeechRecognition)();
    (recognition as unknown as Record<string, unknown>).continuous = false;
    (recognition as unknown as Record<string, unknown>).interimResults = false;
    (recognition as unknown as Record<string, unknown>).lang = "en-US";
    return recognition;
  }, []);

  interface SpeechRecognition {
    start: () => void;
    stop: () => void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onend: (() => void) | null;
    onerror: (() => void) | null;
  }

  interface SpeechRecognitionEvent {
    results: { [key: number]: { [key: number]: { transcript: string } } };
  }

  const toggleListening = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = createRecognition();
    if (!recognition) return;

    recognitionRef.current = recognition;
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.start();
    setListening(true);
  };

  if (!supported) return null;

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleListening}
      className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
        listening
          ? "bg-red-500 text-white"
          : "bg-muted text-muted-foreground hover:bg-blue-100 hover:text-blue-600"
      }`}
      title={listening ? "Stop listening" : "Voice input"}
    >
      <AnimatePresence mode="wait">
        {listening ? (
          <motion.div
            key="listening"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <MicOff className="h-4 w-4" />
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <Mic className="h-4 w-4" />
          </motion.div>
        )}
      </AnimatePresence>

      {listening && (
        <>
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-red-400"
            animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-red-300"
            animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
          />
        </>
      )}
    </motion.button>
  );
}
