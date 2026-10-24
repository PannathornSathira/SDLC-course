/**
 * Pure business logic for the Farmart Grocery Catalog & Storefront.
 * Completely free of database or network side-effects to enable fast, deterministic unit testing.
 */

import type { ProductSort } from "@/lib/api-types";
import { PRODUCT_SORTS } from "@/lib/api-types";

export interface RawSearchParams {
  q?: string | null;
  category?: string | null;
  brand?: string | null;
  bestSeller?: string | boolean | null;
  topSaver?: string | boolean | null;
  organic?: string | boolean | null;
  inStock?: string | boolean | null;
  sort?: string | null;
  page?: string | number | null;
  limit?: string | number | null;
}

export interface NormalizedSearchParams {
  q?: string;
  category?: string;
  brand?: string;
  bestSeller?: boolean;
  topSaver?: boolean;
  organic?: boolean;
  inStock?: boolean;
  sort: ProductSort;
  page: number;
  limit: number;
}

/**
 * Calculates integer discount percent rounded to nearest whole number.
 * Returns 0 if prices are invalid or current price >= original price.
 */
export function calculateDiscountPercent(price: number, originalPrice: number): number {
  if (originalPrice <= 0 || price < 0 || price >= originalPrice) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

/**
 * Determines product stock status and display badges.
 */
export function determineStockStatus(stockCount: number): {
  inStock: boolean;
  status: "in_stock" | "low_stock" | "out_of_stock";
  badgeText: string;
} {
  if (stockCount <= 0) {
    return { inStock: false, status: "out_of_stock", badgeText: "Out of Stock" };
  }
  if (stockCount <= 5) {
    return { inStock: true, status: "low_stock", badgeText: `Only ${stockCount} left!` };
  }
  return { inStock: true, status: "in_stock", badgeText: "In Stock" };
}

/**
 * Calculates promotional sales progress percentage (0 - 100).
 */
export function calculateSalesProgress(soldCount: number, totalStock: number): number {
  if (totalStock <= 0 || soldCount <= 0) return 0;
  const progress = Math.round((soldCount / totalStock) * 100);
  return Math.min(100, Math.max(0, progress));
}

/**
 * Normalizes, validates and sanitizes incoming query parameters.
 */
export function normalizeSearchParams(raw: RawSearchParams = {}): NormalizedSearchParams {
  const q = raw.q?.trim() ? raw.q.trim() : undefined;

  let category: string | undefined = undefined;
  if (raw.category && raw.category.trim() && raw.category.trim().toUpperCase() !== "ALL CATEGORIES") {
    category = raw.category.trim();
  }

  const brand = raw.brand?.trim() ? raw.brand.trim() : undefined;

  const parseBoolean = (val: string | boolean | null | undefined): boolean | undefined => {
    if (typeof val === "boolean") return val;
    if (typeof val === "string") {
      const lower = val.trim().toLowerCase();
      if (lower === "true" || lower === "1") return true;
      if (lower === "false" || lower === "0") return false;
    }
    return undefined;
  };

  const bestSeller = parseBoolean(raw.bestSeller);
  const topSaver = parseBoolean(raw.topSaver);
  const organic = parseBoolean(raw.organic);
  const inStock = parseBoolean(raw.inStock);

  const rawSort = raw.sort as ProductSort;
  const sort: ProductSort = PRODUCT_SORTS.includes(rawSort) ? rawSort : "relevance";

  let page = typeof raw.page === "number" ? raw.page : parseInt(raw.page ?? "1", 10);
  if (isNaN(page) || page < 1) page = 1;

  let limit = typeof raw.limit === "number" ? raw.limit : parseInt(raw.limit ?? "20", 10);
  if (isNaN(limit) || limit < 1) limit = 20;
  limit = Math.min(100, limit);

  return {
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
  };
}

/**
 * Safely parses features JSON array.
 */
export function parseFeaturesJson(jsonStr: string | null | undefined): string[] {
  if (!jsonStr || !jsonStr.trim()) return [];
  try {
    const parsed = JSON.parse(jsonStr);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

/**
 * Safely parses nutrition facts key-value JSON object.
 */
export function parseNutritionJson(jsonStr: string | null | undefined): Record<string, string> {
  if (!jsonStr || !jsonStr.trim()) return {};
  try {
    const parsed = JSON.parse(jsonStr);
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      return Object.fromEntries(
        Object.entries(parsed).map(([k, v]) => [k, String(v)])
      );
    }
    return {};
  } catch {
    return {};
  }
}

/**
 * Validates review submission inputs.
 */
export function validateReviewInput(input: {
  author?: string | null;
  rating?: number | null;
  comment?: string | null;
}): { isValid: boolean; error?: string } {
  if (!input.author || !input.author.trim()) {
    return { isValid: false, error: "Author name is required" };
  }
  if (
    typeof input.rating !== "number" ||
    !Number.isInteger(input.rating) ||
    input.rating < 1 ||
    input.rating > 5
  ) {
    return { isValid: false, error: "Rating must be an integer between 1 and 5" };
  }
  if (!input.comment || !input.comment.trim()) {
    return { isValid: false, error: "Review comment cannot be empty" };
  }
  return { isValid: true };
}

/**
 * Computes average review rating rounded to 1 decimal place.
 */
export function calculateAverageRating(ratings: number[]): { average: number; count: number } {
  if (!ratings.length) return { average: 0, count: 0 };
  const validRatings = ratings.filter((r) => typeof r === "number" && r >= 1 && r <= 5);
  if (!validRatings.length) return { average: 0, count: 0 };
  const sum = validRatings.reduce((acc, curr) => acc + curr, 0);
  const average = Math.round((sum / validRatings.length) * 10) / 10;
  return { average, count: validRatings.length };
}

/**
 * Computes deal countdown time remaining and formatted HH:MM:SS string.
 */
export function computeDealCountdown(endsAtIso: string, nowMs = Date.now()): {
  isExpired: boolean;
  remainingSeconds: number;
  formatted: string;
} {
  const targetTime = new Date(endsAtIso).getTime();
  if (isNaN(targetTime)) {
    return { isExpired: true, remainingSeconds: 0, formatted: "00:00:00" };
  }
  const diffSec = Math.max(0, Math.floor((targetTime - nowMs) / 1000));
  if (diffSec <= 0) {
    return { isExpired: true, remainingSeconds: 0, formatted: "00:00:00" };
  }
  const hours = Math.floor(diffSec / 3600);
  const minutes = Math.floor((diffSec % 3600) / 60);
  const seconds = diffSec % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    isExpired: false,
    remainingSeconds: diffSec,
    formatted: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
  };
}
