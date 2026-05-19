import { NextRequest } from "next/server";
import OpenAI from "openai";

const FALLBACK_ANALYSES: Record<
  string,
  { mood: string; scenery: string[]; activities: string[]; description: string }
> = {
  beach: {
    mood: "Relaxing & Tropical",
    scenery: ["beach", "tropical", "ocean", "coastal"],
    activities: ["swimming", "snorkeling", "relaxation", "water sports"],
    description:
      "This image captures a stunning tropical paradise with crystal-clear waters and pristine sandy beaches. The warm, inviting atmosphere suggests a destination perfect for relaxation and water activities. The vivid blues and greens evoke a sense of serenity and escape from everyday life.",
  },
  mountain: {
    mood: "Adventurous & Majestic",
    scenery: ["mountain", "winter", "alpine", "scenic"],
    activities: ["skiing", "hiking", "snowboarding", "photography"],
    description:
      "This breathtaking mountain landscape showcases snow-capped peaks and pristine alpine scenery. The dramatic elevation and winter atmosphere suggest thrilling adventure opportunities, from skiing to mountain hiking. The crisp, clean air and vast panoramic views create an unforgettable sense of freedom.",
  },
  city: {
    mood: "Vibrant & Urban",
    scenery: ["urban", "skyline", "modern", "nightlife"],
    activities: ["dining", "shopping", "culture", "nightlife"],
    description:
      "A dazzling cityscape that pulses with energy and excitement. The towering skyscrapers and illuminated streets suggest a destination rich with culture, world-class dining, and vibrant nightlife. This is a place where every corner holds a new discovery.",
  },
  forest: {
    mood: "Serene & Natural",
    scenery: ["nature", "forest", "zen", "serene"],
    activities: ["hiking", "meditation", "wellness", "photography"],
    description:
      "A lush, verdant forest landscape that invites peaceful contemplation and connection with nature. The gentle interplay of light through the canopy creates a magical atmosphere perfect for wellness retreats, forest bathing, and mindful exploration.",
  },
};

export async function POST(request: NextRequest) {
  const { imageUrl } = await request.json();

  if (!process.env.OPENAI_API_KEY) {
    const isDataUrl = imageUrl?.startsWith("data:");
    let category = "beach";

    if (!isDataUrl && imageUrl) {
      const url = imageUrl.toLowerCase();
      if (url.includes("mountain") || url.includes("snow") || url.includes("519681")) {
        category = "mountain";
      } else if (url.includes("city") || url.includes("skyline") || url.includes("480714")) {
        category = "city";
      } else if (url.includes("forest") || url.includes("tree") || url.includes("504893")) {
        category = "forest";
      }
    }

    return Response.json({ analysis: FALLBACK_ANALYSES[category] });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const imageContent: OpenAI.Chat.Completions.ChatCompletionContentPart = imageUrl.startsWith("data:")
      ? { type: "image_url", image_url: { url: imageUrl, detail: "low" } }
      : { type: "image_url", image_url: { url: imageUrl, detail: "low" } };

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a travel vibe analyst. Analyze images and extract travel-related attributes. Respond ONLY with valid JSON.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this travel/destination image and extract:
1. mood: The overall feeling/vibe (e.g., "Relaxing & Tropical", "Adventurous & Majestic")
2. scenery: Array of scenery tags (e.g., ["beach", "tropical", "ocean"])
3. activities: Array of suggested activities (e.g., ["swimming", "snorkeling"])
4. description: A 2-3 sentence evocative description of the travel vibe

Respond as JSON: {"mood":"...","scenery":[...],"activities":[...],"description":"..."}`,
            },
            imageContent,
          ],
        },
      ],
      max_tokens: 300,
    });

    const text = completion.choices[0].message.content || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);
      return Response.json({ analysis });
    }

    return Response.json({ analysis: FALLBACK_ANALYSES.beach });
  } catch {
    return Response.json({ analysis: FALLBACK_ANALYSES.beach });
  }
}
