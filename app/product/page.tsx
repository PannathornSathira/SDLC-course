"use client";

import ProductDetailPage from "./[id]/page";
import { DEFAULT_PRODUCT_ID } from "@/app/data/products";

export default function ProductIndexPage() {
  const defaultParams = Promise.resolve({ id: DEFAULT_PRODUCT_ID });
  return <ProductDetailPage params={defaultParams} />;
}
