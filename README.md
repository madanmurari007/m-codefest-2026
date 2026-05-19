# Wanderlust AI

**AI-Powered Multi-Modal Travel Companion with Direct Booking**

> Codefest 4.0 — "Your Dream Trip, One Photo Away"

## Features

- **Image to Trip** — Upload any photo and AI matches you with destinations that capture the vibe (GPT-4o Vision)
- **AI Trip Planner** — Conversational chat interface for natural language trip planning
- **Mood Discovery** — Browse destinations by mood (Romance, Adventure, Wellness, Culture, Urban, Nature)
- **Hotel Details** — Rich property pages with image gallery, room types, amenities
- **Smart Booking Nudges** — AI-driven scarcity alerts, points motivation, price comparisons
- **Bonvoy Points Calculator** — Visual points earn/burn tracker with milestone progress
- **Bonvoy Enrollment** — Frictionless member signup flow
- **Voice Booking** — Hands-free booking via Web Speech API
- **Full Booking Flow** — Complete checkout with date selection, guest info, payment, confirmation

## KPI Impact

| KPI | How |
|-----|-----|
| **Digital Direct Share** | Engaging discovery experience that keeps guests on the direct channel |
| **Bonvoy Enrollments** | Enrollment hooks embedded at every touchpoint |
| **RevPAR** | AI-powered contextual upselling |
| **Intent to Recommend** | Shareable trip planning experience |
| **EBITDA Growth** | Higher direct share = lower OTA commissions |

## Tech Stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind CSS v4** + custom design system
- **Framer Motion** for animations
- **OpenAI GPT-4o** (with Vision) for AI features
- **Lucide React** for icons
- **Web Speech API** for voice input

## Getting Started

```bash
# Install dependencies
npm install

# Optional: Add your OpenAI API key for real AI responses
# The app works fully without it using smart fallback responses
cp .env.example .env.local
# Edit .env.local and add your OPENAI_API_KEY

# Run dev server
npm run dev

# Build for production
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page with hero
│   ├── layout.tsx            # Root layout with navbar
│   ├── globals.css           # Design system & theme
│   ├── discover/page.tsx     # Mood board discovery
│   ├── image-trip/page.tsx   # Image-to-Trip feature
│   ├── chat/page.tsx         # AI conversational planner
│   ├── hotels/[id]/page.tsx  # Hotel detail page
│   ├── booking/page.tsx      # Booking checkout flow
│   └── api/
│       ├── chat/route.ts     # AI chat API (GPT-4o)
│       └── analyze-image/route.ts  # Image analysis API (GPT-4o Vision)
├── components/
│   ├── Navbar.tsx            # Navigation bar
│   ├── HotelCard.tsx         # Hotel listing card
│   ├── BookingNudge.tsx      # Smart booking nudges
│   ├── PointsCalculator.tsx  # Bonvoy points calculator
│   ├── BonvoyEnrollment.tsx  # Member enrollment modal
│   └── VoiceButton.tsx       # Voice input button
└── lib/
    ├── hotels.ts             # Mock hotel data (12 properties)
    ├── types.ts              # TypeScript interfaces
    └── utils.ts              # Utility functions
```

## Deployment

```bash
# Build
npm run build

# Deploy to AWS Amplify, Vercel, or any Node.js hosting
npm start
```

Cloud costs: < $100 (well under the $250 limit).

## Team

Built for Marriott Codefest 4.0 by the AEM/Next.js/React frontend team.
