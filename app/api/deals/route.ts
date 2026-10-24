import { getDeals } from "@/lib/db/queries";

export async function GET() {
  try {
    const deals = getDeals();
    return Response.json(deals);
  } catch (error) {
    console.error("Error in GET /api/deals:", error);
    return Response.json(
      { code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch deals" },
      { status: 500 }
    );
  }
}
