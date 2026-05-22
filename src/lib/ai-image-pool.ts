/**
 * Stock image pool used to illustrate LLM-generated hotel cards.
 *
 * The chat planner asks the model to return an `imageCategory` for each
 * recommendation; we then pick a deterministic image from this pool so the
 * card always has a relevant photograph (the LLM cannot return real,
 * working image URLs on its own).
 */

export type ImageCategory =
  | "tropical"
  | "beach"
  | "mountain"
  | "alpine"
  | "urban"
  | "skyline"
  | "safari"
  | "wildlife"
  | "wellness"
  | "spa"
  | "cultural"
  | "historic"
  | "desert"
  | "arctic"
  | "vineyard"
  | "wedding"
  | "honeymoon"
  | "nature"
  | "forest";

const POOL: Record<ImageCategory, string[]> = {
  tropical: [
    "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80",
    "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
    "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80",
    "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&q=80",
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80",
    "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80",
  ],
  beach: [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80",
    "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&q=80",
  ],
  mountain: [
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80",
  ],
  alpine: [
    "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
  ],
  urban: [
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    "https://images.unsplash.com/photo-1590490360182-c33d955a75fa?w=800&q=80",
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
  ],
  skyline: [
    "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80",
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
  ],
  safari: [
    "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&q=80",
    "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
    "https://images.unsplash.com/photo-1504432842672-1a79f78e4084?w=800&q=80",
  ],
  wildlife: [
    "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
    "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&q=80",
    "https://images.unsplash.com/photo-1504432842672-1a79f78e4084?w=800&q=80",
  ],
  wellness: [
    "https://images.unsplash.com/photo-1540555700478-4be289fbec6e?w=800&q=80",
    "https://images.unsplash.com/photo-1590490360182-c33d955a75fa?w=800&q=80",
    "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80",
  ],
  spa: [
    "https://images.unsplash.com/photo-1540555700478-4be289fbec6e?w=800&q=80",
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80",
  ],
  cultural: [
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    "https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&q=80",
  ],
  historic: [
    "https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&q=80",
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
  ],
  desert: [
    "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=800&q=80",
    "https://images.unsplash.com/photo-1547234935-80c7145ec969?w=800&q=80",
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
  ],
  arctic: [
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
  ],
  vineyard: [
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    "https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&q=80",
  ],
  wedding: [
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&q=80",
  ],
  honeymoon: [
    "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&q=80",
    "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80",
  ],
  nature: [
    "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80",
    "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&q=80",
  ],
  forest: [
    "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80",
    "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
  ],
};

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&q=80",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
  "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80",
];

/**
 * Resolve a category + offset to a stock image URL. Unknown or empty
 * categories degrade gracefully to a generic travel pool.
 */
export function pickImage(rawCategory: string | undefined, offset: number): string {
  const key = (rawCategory ?? "").trim().toLowerCase() as ImageCategory;
  const pool = POOL[key] ?? FALLBACK_IMAGES;
  return pool[Math.abs(offset) % pool.length];
}
