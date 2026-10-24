import { searchProducts } from "@/lib/db/queries";
import type { ProductSort } from "@/lib/api-types";
import { PRODUCT_SORTS } from "@/lib/api-types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const q = searchParams.get("q") ?? undefined;
    const category = searchParams.get("category") ?? undefined;
    const brand = searchParams.get("brand") ?? undefined;

    const bestSeller = searchParams.has("bestSeller")
      ? searchParams.get("bestSeller") === "true"
      : undefined;
    const topSaver = searchParams.has("topSaver")
      ? searchParams.get("topSaver") === "true"
      : undefined;
    const organic = searchParams.has("organic")
      ? searchParams.get("organic") === "true"
      : undefined;
    const inStock = searchParams.has("inStock")
      ? searchParams.get("inStock") === "true"
      : undefined;

    const rawSort = searchParams.get("sort");
    const sort: ProductSort = PRODUCT_SORTS.includes(rawSort as ProductSort)
      ? (rawSort as ProductSort)
      : "relevance";

    const rawPage = parseInt(searchParams.get("page") ?? "1", 10);
    const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

    const rawLimit = parseInt(searchParams.get("limit") ?? "20", 10);
    const limit = isNaN(rawLimit) || rawLimit < 1 ? 20 : Math.min(100, rawLimit);

    const result = searchProducts({
      q,
      category,
      brand,
      bestSeller,
      topSaver,
      organic,
      inStock,
      sort,
      page,
      limit,
    });

    return Response.json(result);
  } catch (error) {
    console.error("Error in GET /api/products:", error);
    return Response.json(
      { code: "INTERNAL_SERVER_ERROR", message: "Failed to search products" },
      { status: 500 }
    );
  }
}
