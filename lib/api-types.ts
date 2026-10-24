/** API response shapes shared by route handlers and the storefront client. */

export interface Category {
  id: string;
  name: string;
  productCount: number;
}

export interface ProductSummary {
  id: string;
  name: string;
  brand: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  unit: string;
  inStock: boolean;
  stockCount: number;
  soldCount: number;
  totalStock: number;
  isBestSeller: boolean;
  isTopSaver: boolean;
  isOrganic: boolean;
}

export interface ProductPage {
  data: ProductSummary[];
  page: number;
  limit: number;
  total: number;
}

export interface Brand {
  id: string;
  name: string;
  headline: string;
  background: string;
}

export interface Banner {
  id: string;
  placement: "hero-main" | "hero-side" | string;
  title: string;
  subtitle: string | null;
  ctaLabel: string;
  href: string | null;
}

export interface DealsResponse {
  id: string;
  title: string;
  endsAt: string;
  featuredProductId: string | null;
  products: ProductSummary[];
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export const PRODUCT_SORTS = ["relevance", "price_asc", "price_desc", "rating", "discount"] as const;
export type ProductSort = (typeof PRODUCT_SORTS)[number];
