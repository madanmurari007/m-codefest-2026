import { NextRequest } from "next/server";
import { getHotelById } from "@/lib/hotels";

/**
 * GET /api/hotels/[id]
 *
 * Returns one Hotel object with all attributes (including roomTypes array).
 * Responds with 404 if the id is unknown.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const hotel = getHotelById(id);
  if (!hotel) {
    return Response.json({ error: "Hotel not found", id }, { status: 404 });
  }
  return Response.json({ hotel });
}
