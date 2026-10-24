import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { setupTestDatabase, teardownTestDatabase } from "./setup-test-db";

import { GET as getCategoriesRoute } from "@/app/api/categories/route";
import { GET as getProductsRoute } from "@/app/api/products/route";
import { GET as getProductByIdRoute } from "@/app/api/products/[id]/route";
import { GET as getDealsRoute } from "@/app/api/deals/route";
import { GET as getFeaturedBrandsRoute } from "@/app/api/brands/featured/route";
import { GET as getBannersRoute } from "@/app/api/promotions/banners/route";
import { GET as getHelloRoute } from "@/app/api/hello/route";

describe("Integration Tests: API Routes with SQLite Backend", () => {
  beforeAll(() => {
    setupTestDatabase();
  });

  afterAll(() => {
    teardownTestDatabase();
  });

  describe("GET /api/hello", () => {
    it("returns 200 with Hello World message", async () => {
      const response = await getHelloRoute();
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json).toEqual({ message: "Hello World" });
    });
  });

  describe("GET /api/categories", () => {
    it("returns 200 with all 8 seed categories and accurate product counts", async () => {
      const response = await getCategoriesRoute();
      expect(response.status).toBe(200);

      const categories = await response.json();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBe(8);

      // Verify category structure
      const first = categories[0];
      expect(first).toHaveProperty("id");
      expect(first).toHaveProperty("name");
      expect(first).toHaveProperty("productCount");
      expect(typeof first.productCount).toBe("number");

      // Verify specific category exists
      const fruitCategory = categories.find((c: { id: string }) => c.id === "fruits");
      expect(fruitCategory).toBeDefined();
      expect(fruitCategory.name).toBe("Fruits & Vegetables");
      expect(fruitCategory.productCount).toBeGreaterThanOrEqual(1);
    });
  });

  describe("GET /api/products (Catalog Search & Filtering)", () => {
    it("returns 200 with paginated product catalog", async () => {
      const req = new Request("http://localhost:3000/api/products");
      const response = await getProductsRoute(req);
      expect(response.status).toBe(200);

      const result = await response.json();
      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("page", 1);
      expect(result).toHaveProperty("limit", 20);
      expect(result).toHaveProperty("total", 4);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBe(4);
    });

    it("filters products by text query ?q=", async () => {
      const req = new Request("http://localhost:3000/api/products?q=beer");
      const response = await getProductsRoute(req);
      expect(response.status).toBe(200);

      const result = await response.json();
      expect(result.total).toBe(1);
      expect(result.data[0].id).toBe("ice-golds-beer");
      expect(result.data[0].name).toContain("Beer");
    });

    it("filters products by category slug ?category=", async () => {
      const req = new Request("http://localhost:3000/api/products?category=fruits");
      const response = await getProductsRoute(req);
      expect(response.status).toBe(200);

      const result = await response.json();
      expect(result.total).toBe(1);
      expect(result.data[0].categorySlug).toBe("fruits");
      expect(result.data[0].id).toBe("blood-orange");
    });

    it("sorts products by price ascending ?sort=price_asc", async () => {
      const req = new Request("http://localhost:3000/api/products?sort=price_asc");
      const response = await getProductsRoute(req);
      expect(response.status).toBe(200);

      const result = await response.json();
      const prices = result.data.map((p: { price: number }) => p.price);
      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
      }
    });

    it("sorts products by price descending ?sort=price_desc", async () => {
      const req = new Request("http://localhost:3000/api/products?sort=price_desc");
      const response = await getProductsRoute(req);
      expect(response.status).toBe(200);

      const result = await response.json();
      const prices = result.data.map((p: { price: number }) => p.price);
      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).toBeLessThanOrEqual(prices[i - 1]);
      }
    });

    it("sorts products by rating ?sort=rating", async () => {
      const req = new Request("http://localhost:3000/api/products?sort=rating");
      const response = await getProductsRoute(req);
      expect(response.status).toBe(200);

      const result = await response.json();
      const ratings = result.data.map((p: { rating: number }) => p.rating);
      for (let i = 1; i < ratings.length; i++) {
        expect(ratings[i]).toBeLessThanOrEqual(ratings[i - 1]);
      }
    });

    it("supports pagination with ?page= &limit=", async () => {
      const req = new Request("http://localhost:3000/api/products?page=1&limit=2");
      const response = await getProductsRoute(req);
      expect(response.status).toBe(200);

      const result = await response.json();
      expect(result.page).toBe(1);
      expect(result.limit).toBe(2);
      expect(result.data.length).toBe(2);
      expect(result.total).toBe(4);
    });

    it("filters boolean flags ?organic=true & ?bestSeller=true", async () => {
      const req = new Request("http://localhost:3000/api/products?organic=true");
      const response = await getProductsRoute(req);
      expect(response.status).toBe(200);

      const result = await response.json();
      expect(result.data.every((p: { isOrganic: boolean }) => p.isOrganic)).toBe(true);
    });
  });

  describe("GET /api/products/[id]", () => {
    it("returns 200 with full product details and reviews for existing ID", async () => {
      const dummyReq = new Request("http://localhost:3000/api/products/ice-golds-beer");
      const response = await getProductByIdRoute(dummyReq, {
        params: Promise.resolve({ id: "ice-golds-beer" }),
      });
      expect(response.status).toBe(200);

      const product = await response.json();
      expect(product.id).toBe("ice-golds-beer");
      expect(product.name).toBe("Ice Gold's Beer 350ml x 24 Pieces");
      expect(product.sku).toBe("BEER-350-24");
      expect(Array.isArray(product.features)).toBe(true);
      expect(product.features.length).toBeGreaterThan(0);
      expect(typeof product.nutritionFacts).toBe("object");
      expect(Array.isArray(product.reviews)).toBe(true);
      expect(product.reviews.length).toBe(3);
      expect(product.reviews[0].verified).toBe(true);
    });

    it("returns 404 with structured error message when product is not found", async () => {
      const dummyReq = new Request("http://localhost:3000/api/products/unknown-item-999");
      const response = await getProductByIdRoute(dummyReq, {
        params: Promise.resolve({ id: "unknown-item-999" }),
      });
      expect(response.status).toBe(404);

      const error = await response.json();
      expect(error.code).toBe("NOT_FOUND");
      expect(error.message).toContain('Product with id "unknown-item-999" not found');
    });
  });

  describe("GET /api/deals", () => {
    it("returns 200 with promotional campaign, countdown, and featured product", async () => {
      const response = await getDealsRoute();
      expect(response.status).toBe(200);

      const deals = await response.json();
      expect(deals.id).toBe("top-saver-today");
      expect(deals.title).toBe("Top Saver Today");
      expect(deals.endsAt).toBeDefined();
      expect(deals.featuredProductId).toBe("ice-golds-beer");
      expect(Array.isArray(deals.products)).toBe(true);
      expect(deals.products.length).toBe(4);
    });
  });

  describe("GET /api/brands/featured", () => {
    it("returns 200 with active featured brands", async () => {
      const response = await getFeaturedBrandsRoute();
      expect(response.status).toBe(200);

      const brands = await response.json();
      expect(Array.isArray(brands)).toBe(true);
      expect(brands.length).toBe(4);
      expect(brands[0]).toHaveProperty("id");
      expect(brands[0]).toHaveProperty("headline");
      expect(brands[0]).toHaveProperty("background");
    });
  });

  describe("GET /api/promotions/banners", () => {
    it("returns 200 with active hero promotional banners", async () => {
      const response = await getBannersRoute();
      expect(response.status).toBe(200);

      const banners = await response.json();
      expect(Array.isArray(banners)).toBe(true);
      expect(banners.length).toBe(2);
      expect(banners[0].placement).toBe("hero-main");
      expect(banners[0].ctaLabel).toBe("Shop Now");
      expect(banners[1].placement).toBe("hero-side");
    });
  });
});
