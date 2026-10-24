import type { DatabaseSync } from "node:sqlite";
import { PRODUCTS } from "@/app/data/products";

/**
 * Initial data for the storefront. Product records come from
 * `app/data/products.ts` so the product detail pages and the DB agree.
 */

export const SEED_CATEGORIES = [
  { id: "fruits", name: "Fruits & Vegetables" },
  { id: "breads", name: "Breads & Sweets" },
  { id: "seafood", name: "Frozen Seafoods" },
  { id: "meats", name: "Raw Meats" },
  { id: "wines", name: "Wines & Alcohol Drinks" },
  { id: "coffee", name: "Coffees and Teas" },
  { id: "dairy", name: "Milks and Dairies" },
  { id: "pets", name: "Pet Foods" },
];

export const SEED_BRANDS = [
  { id: "foodpouch", name: "FOODPOUCH", headline: "New Snacks Release", background: "#f0edf5" },
  { id: "tea365", name: "TEA 365", headline: "Happy Tea 100% Organic, From $29.9", background: "#f6f4ec" },
  { id: "soda-brand", name: "SODA BRAND", headline: "Soda Can Box 24 Pieces - 30% OFF", background: "#edf2f7" },
  { id: "farmart", name: "FARMART", headline: "Fresh Meat Sausage, BUY 2 GET 1", background: "#e9f2ec" },
];

export const SEED_BANNERS = [
  {
    id: "summer-juice-milk", placement: "hero-main",
    title: "Active Summer With Juice Milk 300ml",
    subtitle: "New arrivals with milkshake, fruits, juice drinks, essential for summer.",
    ctaLabel: "Shop Now",
  },
  {
    id: "seeds-20-off", placement: "hero-side",
    title: "20% SALE OFF",
    subtitle: "Synthetic seeds\nNet 2.0 OZ",
    ctaLabel: "Shop Now",
  },
];

/** Top Saver Today: first item is the featured "super deal" card. */
export const SEED_DEAL_PRODUCT_IDS = ["ice-golds-beer", "british-beef-mince", "farmhouse-soft-white", "blood-orange"];

/** Matches the storefront's original 05:25:37 countdown. */
const INITIAL_DEAL_DURATION_MS = (5 * 3600 + 25 * 60 + 37) * 1000;

export function seedDatabase(db: DatabaseSync) {
  const insertCategory = db.prepare("INSERT OR IGNORE INTO categories (id, name, sort_order) VALUES (?, ?, ?)");
  SEED_CATEGORIES.forEach((c, i) => insertCategory.run(c.id, c.name, i));

  const insertProduct = db.prepare(`
    INSERT OR IGNORE INTO products (
      id, name, brand, category_id, price, original_price, discount_percent, rating, review_count,
      unit, sku, stock_count, sold_count, total_stock, is_best_seller, is_top_saver, is_organic,
      description, features_json, nutrition_json, storage_instructions, origin, shelf_life
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const insertReview = db.prepare(`
    INSERT OR IGNORE INTO reviews (id, product_id, author, rating, date, title, comment, verified)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);

  for (const p of Object.values(PRODUCTS)) {
    insertProduct.run(
      p.id, p.name, p.brand, p.categorySlug, p.price, p.originalPrice, p.discountPercent, p.rating, p.reviewCount,
      p.unit, p.sku, p.stockCount, p.soldCount, p.totalStock, Number(!!p.isBestSeller), Number(!!p.isTopSaver),
      Number(!!p.isOrganic), p.description, JSON.stringify(p.features), JSON.stringify(p.nutritionFacts),
      p.storageInstructions, p.origin, p.shelfLife,
    );
    for (const r of p.reviews) {
      insertReview.run(r.id, p.id, r.author, r.rating, r.date, r.title, r.comment, Number(r.verified));
    }
  }

  const insertBrand = db.prepare(
    "INSERT OR IGNORE INTO brands (id, name, headline, background, is_featured, sort_order) VALUES (?, ?, ?, ?, 1, ?)",
  );
  SEED_BRANDS.forEach((b, i) => insertBrand.run(b.id, b.name, b.headline, b.background, i));

  const insertBanner = db.prepare(
    "INSERT OR IGNORE INTO banners (id, placement, title, subtitle, cta_label, href, is_active, sort_order) VALUES (?, ?, ?, ?, ?, NULL, 1, ?)",
  );
  SEED_BANNERS.forEach((b, i) => insertBanner.run(b.id, b.placement, b.title, b.subtitle, b.ctaLabel, i));

  db.prepare("INSERT OR IGNORE INTO deal_campaigns (id, title, ends_at, cycle_seconds) VALUES (?, ?, ?, 86400)")
    .run("top-saver-today", "Top Saver Today", new Date(Date.now() + INITIAL_DEAL_DURATION_MS).toISOString());
  const insertDealItem = db.prepare(
    "INSERT OR IGNORE INTO deal_items (campaign_id, product_id, sort_order, is_featured) VALUES ('top-saver-today', ?, ?, ?)",
  );
  SEED_DEAL_PRODUCT_IDS.forEach((id, i) => insertDealItem.run(id, i, Number(i === 0)));
}
