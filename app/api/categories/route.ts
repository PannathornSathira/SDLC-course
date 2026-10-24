import { getCategories } from "@/lib/db/queries";

export async function GET() {
  try {
    const categories = getCategories();
    return Response.json(categories);
  } catch (error) {
    console.error("Error in GET /api/categories:", error);
    return Response.json(
      { code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
