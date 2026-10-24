import { getBanners } from "@/lib/db/queries";

export async function GET() {
  try {
    const banners = getBanners();
    return Response.json(banners);
  } catch (error) {
    console.error("Error in GET /api/promotions/banners:", error);
    return Response.json(
      { code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch banners" },
      { status: 500 }
    );
  }
}
