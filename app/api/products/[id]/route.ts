import { getProductById } from "@/lib/db/queries";

export async function GET(
  _request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const product = getProductById(id);

    if (!product) {
      return Response.json(
        { code: "NOT_FOUND", message: `Product with id "${id}" not found` },
        { status: 404 }
      );
    }

    return Response.json(product);
  } catch (error) {
    console.error("Error in GET /api/products/[id]:", error);
    return Response.json(
      { code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
