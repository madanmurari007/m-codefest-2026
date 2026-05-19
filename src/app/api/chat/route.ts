import { NextRequest } from "next/server";
import OpenAI from "openai";
import { hotels } from "@/lib/hotels";

const hotelCatalog = hotels
  .map(
    (h) =>
      `- ${h.name} (${h.brand}, ${h.tier}) in ${h.location}: ${h.description} | From $${h.pricePerNight}/night | Amenities: ${h.amenities.join(", ")} | Tags: ${h.tags.join(", ")}`
  )
  .join("\n");

const SYSTEM_PROMPT = `You are Wanderlust AI, an enthusiastic and knowledgeable travel planning assistant for a luxury hotel booking platform. Your goal is to help guests find their perfect hotel stay and book directly.

Available Hotel Catalog:
${hotelCatalog}

Guidelines:
- Be warm, enthusiastic, and concise
- Always recommend 2-3 specific hotels from the catalog that match the user's preferences
- Mention hotel names exactly as listed so they can be linked
- Highlight unique amenities and experiences
- Mention Bonvoy points earning potential
- Encourage direct booking for best rates and maximum points
- If the user mentions budget, filter appropriately
- Suggest activities and experiences at each destination
- If asked about availability, treat all hotels as available (this is a demo)
- Keep responses under 200 words`;

function generateFallbackResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();

  if (msg.includes("beach") || msg.includes("tropical") || msg.includes("island")) {
    return `What an amazing choice! For a tropical getaway, I have some incredible options:\n\n**The Azure Cove Resort** in the Maldives is pure paradise — overwater villas with glass floors, private pools, and world-class diving. Starting at $850/night, you'll earn 85,000 Bonvoy points per stay!\n\n**Coral Reef Retreat** in Australia's Great Barrier Reef offers eco-luxury with incredible snorkeling right off the beach, from $520/night.\n\nFor a Mediterranean twist, **Coastal Breeze Resort & Spa** on Italy's Amalfi Coast combines cliffside infinity pools with authentic Italian cuisine.\n\nWould you like to explore any of these further? I can help with dates and room selection!`;
  }

  if (msg.includes("mountain") || msg.includes("ski") || msg.includes("winter") || msg.includes("snow")) {
    return `Love the mountain vibes! Here are my top picks:\n\n**Alpine Summit Lodge** in Zermatt, Switzerland offers ski-in/ski-out access with Matterhorn views, starting at $450/night. The rustic-chic fireside lounge is unforgettable!\n\n**Northern Lights Lodge** in Tromsø, Norway is truly unique — sleep in heated glass igloos watching the aurora borealis. From $580/night with husky sledding included!\n\nBoth properties offer incredible Bonvoy points — book direct for the best deal. Which speaks to you more?`;
  }

  if (msg.includes("city") || msg.includes("urban") || msg.includes("new york") || msg.includes("tokyo")) {
    return `City adventures are my specialty! Check these out:\n\n**Manhattan Skyline Hotel** (JW Marriott) puts you right in Midtown NYC — steps from Central Park, Times Square, and Broadway. The rooftop bar has jaw-dropping views! From $420/night.\n\n**Sakura Garden Hotel** (W Hotels) in Tokyo's Shibuya district blends ultra-modern design with Japanese zen. The rooftop infinity pool overlooking the skyline is incredible. From $380/night.\n\nFor a harbor-side experience, **Harbor Lights Hotel** in Sydney offers Opera House views from $280/night!\n\nWant me to plan a full itinerary for any of these cities?`;
  }

  if (msg.includes("romantic") || msg.includes("anniversary") || msg.includes("honeymoon") || msg.includes("couple")) {
    return `How exciting! For a romantic escape, these are absolutely perfect:\n\n**The Azure Cove Resort** in the Maldives — nothing says romance like a private overwater villa with sunset views. The Sunset Water Suite ($2,100/night) comes with a personal butler and wine cellar!\n\n**Coastal Breeze Resort & Spa** on Italy's Amalfi Coast offers cliffside suites with private plunge pools overlooking the Mediterranean. Pure magic at $720/night.\n\n**Bamboo Forest Ryokan** in Kyoto provides an intimate Japanese experience with private onsen baths and kaiseki dining in a serene bamboo grove.\n\nBook direct and earn up to 95,000 Bonvoy points per stay! Which destination captures your heart?`;
  }

  if (msg.includes("safari") || msg.includes("africa") || msg.includes("wildlife")) {
    return `Safari is the trip of a lifetime! Here's my top recommendation:\n\n**Savanna Starlight Camp** in the Serengeti is extraordinary — luxury tented camp with front-row seats to the Great Migration. The Starlight Suite has a retractable roof for stargazing from bed! From $950/night.\n\nIncludes private game drives, bush dining under the stars, and photography tours with expert guides. You'll earn 95,000 Bonvoy points per night!\n\nThis is one of those once-in-a-lifetime experiences. Want me to help plan the trip?`;
  }

  return `I'd love to help you plan the perfect trip! Based on what you're looking for, here are some standout options from our collection:\n\n**Bamboo Forest Ryokan** in Kyoto — a serene luxury experience with private onsen baths, kaiseki dining, and tea ceremonies in an ancient bamboo grove. From $620/night.\n\n**Desert Mirage Oasis** in Marrakech — a palatial riad with ornate courtyards, rooftop Atlas Mountain views, and authentic hammam spa. From $390/night.\n\n**Vineyard Estate Hotel** in Tuscany — a restored 15th-century estate with its own winery, farm-to-table dining, and rolling vineyard views. From $350/night.\n\nAll with maximum Bonvoy points when you book direct! Tell me more about what you're looking for — budget, dates, activities, mood — and I'll narrow it down perfectly.`;
}

export async function POST(request: NextRequest) {
  const { messages } = await request.json();

  if (!process.env.OPENAI_API_KEY) {
    const lastUserMessage =
      messages
        .filter((m: { role: string }) => m.role === "user")
        .pop()?.content || "";
    const content = generateFallbackResponse(lastUserMessage);
    return Response.json({ content });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 500,
      temperature: 0.8,
    });

    const content = completion.choices[0].message.content || "";
    return Response.json({ content });
  } catch {
    const lastUserMessage =
      messages
        .filter((m: { role: string }) => m.role === "user")
        .pop()?.content || "";
    const content = generateFallbackResponse(lastUserMessage);
    return Response.json({ content });
  }
}
