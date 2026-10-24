import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { setupTestDatabase, teardownTestDatabase } from "./setup-test-db";
import { getDb } from "@/lib/db/index";

describe("Integration Tests: Database Integrity & Relational Constraints", () => {
  beforeAll(() => {
    setupTestDatabase();
  });

  afterAll(() => {
    teardownTestDatabase();
  });

  it("enforces foreign key constraints: fails to insert product with invalid category_id", () => {
    const db = getDb();
    expect(() => {
      db.prepare(`
        INSERT INTO products (
          id, name, brand, category_id, price, original_price, discount_percent,
          rating, review_count, unit, sku, stock_count, sold_count, total_stock,
          is_best_seller, is_top_saver, is_organic, description
        ) VALUES (
          'fake-product', 'Fake Product', 'Fake Brand', 'non-existent-category',
          9.99, 12.99, 23, 4.5, 10, '1kg', 'FAKE-SKU-001', 50, 10, 60, 0, 0, 0, 'Desc'
        )
      `).run();
    }).toThrow();
  });

  it("enforces unique constraint: fails to insert duplicate SKU", () => {
    const db = getDb();
    expect(() => {
      // 'BEER-350-24' already exists in seed data
      db.prepare(`
        INSERT INTO products (
          id, name, brand, category_id, price, original_price, discount_percent,
          rating, review_count, unit, sku, stock_count, sold_count, total_stock,
          is_best_seller, is_top_saver, is_organic, description
        ) VALUES (
          'another-beer', 'Another Beer', 'Brewery', 'fruits',
          15.00, 20.00, 25, 4.0, 5, '350ml', 'BEER-350-24', 10, 2, 12, 0, 0, 0, 'Desc'
        )
      `).run();
    }).toThrow();
  });

  it("enforces review rating check constraint (BETWEEN 1 AND 5)", () => {
    const db = getDb();
    expect(() => {
      db.prepare(`
        INSERT INTO reviews (id, product_id, author, rating, date, comment)
        VALUES ('rev-invalid', 'ice-golds-beer', 'Bob', 6, '2024-01-01', 'Invalid rating')
      `).run();
    }).toThrow();
  });

  it("cascades deletion: deleting a product cascades to delete associated reviews and deal items", () => {
    const db = getDb();

    // Verify product has reviews before deletion
    const reviewsBefore = db.prepare("SELECT count(*) as cnt FROM reviews WHERE product_id = 'ice-golds-beer'").get() as { cnt: number };
    expect(reviewsBefore.cnt).toBeGreaterThan(0);

    // Verify product is in deal_items before deletion
    const dealsBefore = db.prepare("SELECT count(*) as cnt FROM deal_items WHERE product_id = 'ice-golds-beer'").get() as { cnt: number };
    expect(dealsBefore.cnt).toBeGreaterThan(0);

    // Delete the product
    db.prepare("DELETE FROM products WHERE id = 'ice-golds-beer'").run();

    // Verify reviews were cascaded and deleted automatically
    const reviewsAfter = db.prepare("SELECT count(*) as cnt FROM reviews WHERE product_id = 'ice-golds-beer'").get() as { cnt: number };
    expect(reviewsAfter.cnt).toBe(0);

    // Verify deal items were cascaded and deleted automatically
    const dealsAfter = db.prepare("SELECT count(*) as cnt FROM deal_items WHERE product_id = 'ice-golds-beer'").get() as { cnt: number };
    expect(dealsAfter.cnt).toBe(0);
  });
});
