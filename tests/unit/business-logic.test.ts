import { describe, expect, it } from "vitest";
import {
  calculateAverageRating,
  calculateDiscountPercent,
  calculateSalesProgress,
  computeDealCountdown,
  determineStockStatus,
  normalizeSearchParams,
  parseFeaturesJson,
  parseNutritionJson,
  validateReviewInput,
} from "@/lib/services/business-logic";

describe("Unit Tests: Business Logic Service", () => {
  describe("Pricing & Discount Logic", () => {
    it("calculates correct percentage discount rounded to whole number", () => {
      // $19.99 from $29.99 is ~33.34% -> 33%
      expect(calculateDiscountPercent(19.99, 29.99)).toBe(33);
      // $80 from $100 is 20%
      expect(calculateDiscountPercent(80, 100)).toBe(20);
      // $50 from $200 is 75%
      expect(calculateDiscountPercent(50, 200)).toBe(75);
    });

    it("returns 0 discount when price equals or exceeds original price", () => {
      expect(calculateDiscountPercent(100, 100)).toBe(0);
      expect(calculateDiscountPercent(120, 100)).toBe(0);
    });

    it("safely handles 0, negative, or invalid prices without throwing or NaN", () => {
      expect(calculateDiscountPercent(0, 0)).toBe(0);
      expect(calculateDiscountPercent(-10, 50)).toBe(0);
      expect(calculateDiscountPercent(50, -100)).toBe(0);
    });
  });

  describe("Inventory & Stock Level Logic", () => {
    it("identifies out of stock items when stock <= 0", () => {
      const outOfStock1 = determineStockStatus(0);
      expect(outOfStock1.inStock).toBe(false);
      expect(outOfStock1.status).toBe("out_of_stock");

      const outOfStock2 = determineStockStatus(-5);
      expect(outOfStock2.inStock).toBe(false);
      expect(outOfStock2.status).toBe("out_of_stock");
    });

    it("flags low stock warning when stock is between 1 and 5", () => {
      const lowStock = determineStockStatus(3);
      expect(lowStock.inStock).toBe(true);
      expect(lowStock.status).toBe("low_stock");
      expect(lowStock.badgeText).toBe("Only 3 left!");
    });

    it("flags standard in-stock status when stock > 5", () => {
      const inStock = determineStockStatus(25);
      expect(inStock.inStock).toBe(true);
      expect(inStock.status).toBe("in_stock");
      expect(inStock.badgeText).toBe("In Stock");
    });

    it("calculates promotional sales progress percentage clamped to 0-100", () => {
      expect(calculateSalesProgress(20, 100)).toBe(20);
      expect(calculateSalesProgress(50, 50)).toBe(100);
      expect(calculateSalesProgress(60, 50)).toBe(100); // clamped at 100
      expect(calculateSalesProgress(0, 50)).toBe(0);
      expect(calculateSalesProgress(10, 0)).toBe(0); // divide by zero safety
    });
  });

  describe("Query Parameter Normalization & Sanitization", () => {
    it("trims search keyword and normalizes empty strings to undefined", () => {
      const res1 = normalizeSearchParams({ q: "  organic milk  " });
      expect(res1.q).toBe("organic milk");

      const res2 = normalizeSearchParams({ q: "    " });
      expect(res2.q).toBeUndefined();
    });

    it("ignores 'ALL CATEGORIES' selector case-insensitively", () => {
      expect(normalizeSearchParams({ category: "ALL CATEGORIES" }).category).toBeUndefined();
      expect(normalizeSearchParams({ category: "all categories" }).category).toBeUndefined();
      expect(normalizeSearchParams({ category: "fruits" }).category).toBe("fruits");
    });

    it("parses boolean string flags correctly", () => {
      const res = normalizeSearchParams({
        bestSeller: "true",
        topSaver: "1",
        organic: "false",
        inStock: "0",
      });
      expect(res.bestSeller).toBe(true);
      expect(res.topSaver).toBe(true);
      expect(res.organic).toBe(false);
      expect(res.inStock).toBe(false);
    });

    it("validates sort options and falls back to 'relevance' for invalid values", () => {
      expect(normalizeSearchParams({ sort: "price_asc" }).sort).toBe("price_asc");
      expect(normalizeSearchParams({ sort: "rating" }).sort).toBe("rating");
      expect(normalizeSearchParams({ sort: "discount" }).sort).toBe("discount");
      expect(normalizeSearchParams({ sort: "unknown_hack" }).sort).toBe("relevance");
      expect(normalizeSearchParams({}).sort).toBe("relevance");
    });

    it("clamps page >= 1 and limits between 1 and 100", () => {
      const res = normalizeSearchParams({ page: "-5", limit: "999" });
      expect(res.page).toBe(1);
      expect(res.limit).toBe(100); // capped at 100

      const res2 = normalizeSearchParams({ limit: "0" });
      expect(res2.limit).toBe(20); // default limit
    });
  });

  describe("JSON Attribute Parsing & Fault Tolerance", () => {
    it("parses valid JSON features array", () => {
      const json = JSON.stringify(["100% Organic", "Gluten Free", "No Added Sugar"]);
      expect(parseFeaturesJson(json)).toEqual(["100% Organic", "Gluten Free", "No Added Sugar"]);
    });

    it("safely falls back to empty array on malformed or empty features JSON", () => {
      expect(parseFeaturesJson("")).toEqual([]);
      expect(parseFeaturesJson(null)).toEqual([]);
      expect(parseFeaturesJson("invalid-json{]")).toEqual([]);
      expect(parseFeaturesJson('{"notAnArray": true}')).toEqual([]);
    });

    it("parses valid nutrition facts object", () => {
      const json = JSON.stringify({ Calories: "120 kcal", Protein: "5g", Fat: "0g" });
      expect(parseNutritionJson(json)).toEqual({ Calories: "120 kcal", Protein: "5g", Fat: "0g" });
    });

    it("safely falls back to empty object on malformed nutrition facts JSON", () => {
      expect(parseNutritionJson("")).toEqual({});
      expect(parseNutritionJson(null)).toEqual({});
      expect(parseNutritionJson("{malformed}")).toEqual({});
      expect(parseNutritionJson("['an', 'array']")).toEqual({});
    });
  });

  describe("Review Validation & Rating Computations", () => {
    it("validates author, rating range, and comment presence", () => {
      expect(validateReviewInput({ author: "", rating: 5, comment: "Great" }).isValid).toBe(false);
      expect(validateReviewInput({ author: "Alice", rating: 6, comment: "Great" }).isValid).toBe(false);
      expect(validateReviewInput({ author: "Alice", rating: 0, comment: "Great" }).isValid).toBe(false);
      expect(validateReviewInput({ author: "Alice", rating: 4.5, comment: "Great" }).isValid).toBe(false);
      expect(validateReviewInput({ author: "Alice", rating: 5, comment: "" }).isValid).toBe(false);
      expect(validateReviewInput({ author: "Alice", rating: 5, comment: "Great taste!" }).isValid).toBe(true);
    });

    it("computes accurate average ratings rounded to 1 decimal place", () => {
      const result = calculateAverageRating([5, 4, 4, 5, 5]);
      expect(result.count).toBe(5);
      expect(result.average).toBe(4.6);

      const empty = calculateAverageRating([]);
      expect(empty.count).toBe(0);
      expect(empty.average).toBe(0);
    });
  });

  describe("Deal Countdown Logic", () => {
    it("formats countdown accurately for future dates", () => {
      const fixedNow = 1700000000000;
      // 2 hours, 15 minutes, 30 seconds into the future
      const future = new Date(fixedNow + (2 * 3600 + 15 * 60 + 30) * 1000).toISOString();
      const res = computeDealCountdown(future, fixedNow);

      expect(res.isExpired).toBe(false);
      expect(res.remainingSeconds).toBe(2 * 3600 + 15 * 60 + 30);
      expect(res.formatted).toBe("02:15:30");
    });

    it("marks deal as expired when time has elapsed", () => {
      const fixedNow = 1700000000000;
      const past = new Date(fixedNow - 5000).toISOString();
      const res = computeDealCountdown(past, fixedNow);

      expect(res.isExpired).toBe(true);
      expect(res.remainingSeconds).toBe(0);
      expect(res.formatted).toBe("00:00:00");
    });
  });
});
