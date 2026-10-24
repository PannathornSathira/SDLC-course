import { getFeaturedBrands } from "@/lib/db/queries";

export async function GET() {
  try {
    const brands = getFeaturedBrands();
    return Response.json(brands);
  } catch (error) {
    console.error("Error in GET /api/brands/featured:", error);
    return Response.json(
      { code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch featured brands" },
      { status: 500 }
    );
  }
}
