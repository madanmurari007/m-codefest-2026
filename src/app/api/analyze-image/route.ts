import { NextRequest } from "next/server";
import OpenAI from "openai";
import { getModel, getOpenAI, logOpenAIError } from "@/lib/openai";

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

function fallbackByUrl(imageUrl: string | undefined) {
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
  return FALLBACK_ANALYSES[category];
}

export async function POST(request: NextRequest) {
  const { imageUrl } = await request.json();

  const openai = getOpenAI();
  if (!openai) {
    // No vision available — assume valid and use fallback analysis.
    return Response.json({
      valid: true,
      analysis: fallbackByUrl(imageUrl),
      source: "fallback-no-key",
    });
  }

  try {
    const imageContent: OpenAI.Chat.Completions.ChatCompletionContentPart = {
      type: "image_url",
      image_url: { url: imageUrl, detail: "low" },
    };

    const completion = await openai.chat.completions.create({
      model: getModel(),
      messages: [
        {
          role: "system",
          content:
            "You are a travel vibe analyst. You first verify whether an image depicts a travel-worthy place (a destination, landscape, landmark, city, building, hotel, beach, mountain, forest, etc.), then extract travel attributes if it does. Respond ONLY with valid JSON.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `First, decide if this image clearly depicts a travel destination or place (scenery, landmark, city, building, nature, hotel, etc.). Reject selfies, portraits, indoor selfies, documents, screenshots, food close-ups, memes, abstract art, blank/blurry photos, or any image that does not represent a real-world location someone could travel to.

If it IS a valid place, respond as JSON:
{"valid": true, "mood": "...", "scenery": ["..."], "activities": ["..."], "description": "2-3 evocative sentences"}

If it is NOT a valid place, respond as JSON:
{"valid": false, "reason": "<one short, friendly sentence telling the user what's wrong and asking them to upload a destination photo>"}`,
            },
            imageContent,
          ],
        },
      ],
      max_tokens: 320,
    });

    const text = completion.choices[0].message.content || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);

      if (parsed.valid === false) {
        return Response.json({
          valid: false,
          reason:
            typeof parsed.reason === "string" && parsed.reason.trim()
              ? parsed.reason
              : "That doesn't look like a travel destination. Please upload a photo of a place, landscape, or landmark.",
          source: "llm",
        });
      }

      const { mood, scenery, activities, description } = parsed;
      if (mood && Array.isArray(scenery) && Array.isArray(activities) && description) {
        return Response.json({
          valid: true,
          analysis: { mood, scenery, activities, description },
          source: "llm",
        });
      }
    }

    return Response.json({
      valid: true,
      analysis: fallbackByUrl(imageUrl),
      source: "fallback-no-json",
    });
  } catch (err) {
    logOpenAIError("analyze-image", err);
    return Response.json({
      valid: true,
      analysis: fallbackByUrl(imageUrl),
      source: "fallback-error",
    });
  }
}
