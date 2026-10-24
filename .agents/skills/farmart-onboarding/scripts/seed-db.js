#!/usr/bin/env node
/**
 * Farmart Database Seeder & Onboarding Script
 * 
 * Sets up SQLite database (data/farmart.db) with initial taxonomy,
 * products, reviews, banners, brands, and deals for local development.
 */

const { mkdirSync, existsSync } = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const projectRoot = path.resolve(__dirname, '..');
const dbFile = process.env.FARMART_DB_PATH || path.join(projectRoot, 'data', 'farmart.db');

console.log('🌱 Farmart Database Seeder');
console.log(`📍 Target Database: ${dbFile}`);

if (dbFile !== ':memory:') {
  mkdirSync(path.dirname(dbFile), { recursive: true });
}

const db = new DatabaseSync(dbFile, { enableForeignKeyConstraints: true });
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// 1. Schema DDL
const SCHEMA = `
CREATE TABLE IF NOT EXISTS categories (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS products (
  id                    TEXT PRIMARY KEY,
  name                  TEXT NOT NULL,
  brand                 TEXT NOT NULL,
  category_id           TEXT NOT NULL REFERENCES categories(id),
  price                 REAL NOT NULL,
  original_price        REAL NOT NULL,
  discount_percent      INTEGER NOT NULL DEFAULT 0,
  rating                REAL NOT NULL DEFAULT 0,
  review_count          INTEGER NOT NULL DEFAULT 0,
  unit                  TEXT NOT NULL,
  sku                   TEXT NOT NULL UNIQUE,
  stock_count           INTEGER NOT NULL DEFAULT 0,
  sold_count            INTEGER NOT NULL DEFAULT 0,
  total_stock           INTEGER NOT NULL DEFAULT 0,
  is_best_seller        INTEGER NOT NULL DEFAULT 0,
  is_top_saver          INTEGER NOT NULL DEFAULT 0,
  is_organic            INTEGER NOT NULL DEFAULT 0,
  description           TEXT NOT NULL,
  features_json         TEXT NOT NULL DEFAULT '[]',
  nutrition_json        TEXT NOT NULL DEFAULT '{}',
  storage_instructions  TEXT,
  origin                TEXT,
  shelf_life            TEXT
);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);

CREATE TABLE IF NOT EXISTS reviews (
  id          TEXT PRIMARY KEY,
  product_id  TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  author      TEXT NOT NULL,
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  date        TEXT NOT NULL,
  title       TEXT,
  comment     TEXT NOT NULL,
  verified    INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);

CREATE TABLE IF NOT EXISTS brands (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  headline    TEXT NOT NULL,
  background  TEXT NOT NULL,
  is_featured INTEGER NOT NULL DEFAULT 0,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS banners (
  id          TEXT PRIMARY KEY,
  placement   TEXT NOT NULL,
  title       TEXT NOT NULL,
  subtitle    TEXT,
  cta_label   TEXT NOT NULL,
  href        TEXT,
  is_active   INTEGER NOT NULL DEFAULT 1,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS deal_campaigns (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  ends_at       TEXT NOT NULL,
  cycle_seconds INTEGER NOT NULL DEFAULT 86400
);

CREATE TABLE IF NOT EXISTS deal_items (
  campaign_id TEXT NOT NULL REFERENCES deal_campaigns(id) ON DELETE CASCADE,
  product_id  TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_featured INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (campaign_id, product_id)
);
`;

db.exec(SCHEMA);

// 2. Seed Data
const SEED_CATEGORIES = [
  { id: 'fruits', name: 'Fruits & Vegetables' },
  { id: 'breads', name: 'Breads & Sweets' },
  { id: 'seafood', name: 'Frozen Seafoods' },
  { id: 'meats', name: 'Raw Meats' },
  { id: 'wines', name: 'Wines & Alcohol Drinks' },
  { id: 'coffee', name: 'Coffees and Teas' },
  { id: 'dairy', name: 'Milks and Dairies' },
  { id: 'pets', name: 'Pet Foods' },
];

const SEED_BRANDS = [
  { id: 'foodpouch', name: 'FOODPOUCH', headline: 'New Snacks Release', background: '#f0edf5' },
  { id: 'tea365', name: 'TEA 365', headline: 'Happy Tea 100% Organic, From $29.9', background: '#f6f4ec' },
  { id: 'soda-brand', name: 'SODA BRAND', headline: 'Soda Can Box 24 Pieces - 30% OFF', background: '#edf2f7' },
  { id: 'farmart', name: 'FARMART', headline: 'Fresh Meat Sausage, BUY 2 GET 1', background: '#e9f2ec' },
];

const SEED_BANNERS = [
  {
    id: 'summer-juice-milk', placement: 'hero-main',
    title: 'Active Summer With Juice Milk 300ml',
    subtitle: 'New arrivals with milkshake, fruits, juice drinks, essential for summer.',
    ctaLabel: 'Shop Now',
  },
  {
    id: 'seeds-20-off', placement: 'hero-side',
    title: '20% SALE OFF',
    subtitle: 'Synthetic seeds\nNet 2.0 OZ',
    ctaLabel: 'Shop Now',
  },
];

const SEED_PRODUCTS = [
  {
    id: 'ice-golds-beer',
    name: "Ice Gold's Beer 350ml x 24 Pieces",
    brand: 'Ice Gold Brewery',
    categorySlug: 'fruits',
    price: 19.99,
    originalPrice: 29.99,
    discountPercent: 33,
    rating: 4.8,
    reviewCount: 3,
    unit: '350ml x 24',
    sku: 'BEER-350-24',
    stockCount: 15,
    soldCount: 35,
    totalStock: 50,
    isBestSeller: 1,
    isTopSaver: 1,
    isOrganic: 0,
    description: "Premium brewed golden lager crafted with all-natural barley and select hops. Crisp, refreshing taste with a smooth malty finish. Packaged in a case of 24 convenient 350ml aluminum cans.",
    features: ['Craft brewed with 100% natural hops', 'Refreshing, crisp finish', 'Contains 24 aluminum cans (350ml each)', 'Best served chilled at 4°C'],
    nutritionFacts: { 'Alcohol by Volume': '5.0%', Calories: '142 kcal / 350ml', Carbohydrates: '11g', Sugar: '0g' },
    storageInstructions: 'Store in a cool, dark place away from direct sunlight. Refrigerate before serving.',
    origin: 'Germany',
    shelfLife: '12 Months',
    reviews: [
      { id: 'r1', author: 'Mark D.', rating: 5, date: '2024-03-12', title: 'Top quality beer!', comment: 'Great crisp lager for summer gatherings. Delivery was ice-cold and on time.', verified: 1 },
      { id: 'r2', author: 'Sarah L.', rating: 5, date: '2024-02-28', title: 'Excellent value case', comment: 'Smooth finish, not too bitter. Excellent deal for a 24 pack.', verified: 1 },
      { id: 'r3', author: 'James K.', rating: 4, date: '2024-02-14', title: 'Solid everyday lager', comment: 'Good reliable taste, definitely would order again.', verified: 0 },
    ],
  },
  {
    id: 'british-beef-mince',
    name: 'British Beef Mince (10% Fat)',
    brand: 'Meat Brand Farms',
    categorySlug: 'meats',
    price: 8.49,
    originalPrice: 11.99,
    discountPercent: 29,
    rating: 4.6,
    reviewCount: 2,
    unit: '800g',
    sku: 'BEEF-MINCE-800',
    stockCount: 8,
    soldCount: 42,
    totalStock: 50,
    isBestSeller: 0,
    isTopSaver: 1,
    isOrganic: 0,
    description: 'Lean prime British beef mince prepared from grass-fed cattle. Perfectly balanced with 10% fat for tender, succulent burgers, bolognese, and lasagna.',
    features: ['100% British pasture-raised beef', 'Lean 10% fat ratio', 'High in natural protein and iron', 'Vacuum-sealed for peak freshness'],
    nutritionFacts: { Calories: '175 kcal / 100g', Protein: '20.5g', Fat: '10.2g', Carbohydrates: '0g' },
    storageInstructions: 'Keep refrigerated between 0°C and 4°C. Freeze on day of purchase.',
    origin: 'United Kingdom',
    shelfLife: '4 Days refrigerated',
    reviews: [
      { id: 'r4', author: 'Chef Gordon', rating: 5, date: '2024-03-10', title: 'Super tender mince', comment: 'Barely any shrinkage in the pan. Makes incredible bolognese.', verified: 1 },
      { id: 'r5', author: 'Emma W.', rating: 4, date: '2024-03-01', title: 'Great quality meat', comment: 'Very lean and delicious flavor. Will repurchase.', verified: 1 },
    ],
  },
  {
    id: 'farmhouse-soft-white',
    name: 'Farmart Farmhouse Soft White Bread',
    brand: 'Farmart Bakery',
    categorySlug: 'breads',
    price: 2.49,
    originalPrice: 3.29,
    discountPercent: 24,
    rating: 4.5,
    reviewCount: 1,
    unit: '800g Loaf',
    sku: 'BREAD-WHITE-800',
    stockCount: 22,
    soldCount: 78,
    totalStock: 100,
    isBestSeller: 1,
    isTopSaver: 1,
    isOrganic: 0,
    description: 'Traditional slow-baked farmhouse white loaf with a golden crust and pillowy soft crumb. Baked fresh daily with fortified unbleached wheat flour.',
    features: ['Baked fresh daily', 'No artificial preservatives', 'Fortified with calcium and iron', 'Perfect for toast and hearty sandwiches'],
    nutritionFacts: { Calories: '235 kcal / 100g', Protein: '8.2g', Carbohydrates: '45.1g', Sugar: '3.4g' },
    storageInstructions: 'Store in a cool dry place, ideally in a bread bin. Suitable for freezing.',
    origin: 'United Kingdom',
    shelfLife: '5 Days',
    reviews: [
      { id: 'r6', author: 'David P.', rating: 5, date: '2024-03-14', title: 'Always soft and fresh', comment: 'Makes the best toast. Stays fresh for days.', verified: 1 },
    ],
  },
  {
    id: 'blood-orange',
    name: 'Fresh Blood Orange 1kg',
    brand: 'Sunny Valley Orchards',
    categorySlug: 'fruits',
    price: 3.99,
    originalPrice: 4.99,
    discountPercent: 20,
    rating: 4.9,
    reviewCount: 1,
    unit: '1kg Net Bag',
    sku: 'ORANGE-BLOOD-1KG',
    stockCount: 30,
    soldCount: 20,
    totalStock: 50,
    isBestSeller: 0,
    isTopSaver: 1,
    isOrganic: 1,
    description: 'Juicy Mediterranean blood oranges featuring vibrant crimson flesh and a rich citrus flavor with subtle raspberry notes. Loaded with vitamin C and anthocyanins.',
    features: ['100% Certified Organic', 'Rich in Vitamin C and antioxidants', 'Distinct raspberry-citrus aroma', 'Hand-picked from certified sustainable groves'],
    nutritionFacts: { Calories: '47 kcal / 100g', 'Vitamin C': '53mg (88% DV)', Sugar: '9g', Fiber: '2.4g' },
    storageInstructions: 'Store at room temperature or refrigerate to prolong freshness up to 2 weeks.',
    origin: 'Italy (Sicily)',
    shelfLife: '14 Days refrigerated',
    reviews: [
      { id: 'r7', author: 'Elena R.', rating: 5, date: '2024-03-15', title: 'Incredible deep red color!', comment: 'Super sweet, fragrant and ruby red inside. Best morning juice ever.', verified: 1 },
    ],
  },
];

db.exec('BEGIN TRANSACTION;');

try {
  // Insert Categories
  const insertCat = db.prepare('INSERT OR REPLACE INTO categories (id, name, sort_order) VALUES (?, ?, ?)');
  SEED_CATEGORIES.forEach((c, idx) => insertCat.run(c.id, c.name, idx));

  // Insert Brands
  const insertBrand = db.prepare('INSERT OR REPLACE INTO brands (id, name, headline, background, is_featured, sort_order) VALUES (?, ?, ?, ?, 1, ?)');
  SEED_BRANDS.forEach((b, idx) => insertBrand.run(b.id, b.name, b.headline, b.background, idx));

  // Insert Banners
  const insertBanner = db.prepare('INSERT OR REPLACE INTO banners (id, placement, title, subtitle, cta_label, href, is_active, sort_order) VALUES (?, ?, ?, ?, ?, NULL, 1, ?)');
  SEED_BANNERS.forEach((b, idx) => insertBanner.run(b.id, b.placement, b.title, b.subtitle, b.ctaLabel, idx));

  // Insert Products & Reviews
  const insertProd = db.prepare(`
    INSERT OR REPLACE INTO products (
      id, name, brand, category_id, price, original_price, discount_percent,
      rating, review_count, unit, sku, stock_count, sold_count, total_stock,
      is_best_seller, is_top_saver, is_organic, description, features_json,
      nutrition_json, storage_instructions, origin, shelf_life
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertReview = db.prepare(`
    INSERT OR REPLACE INTO reviews (id, product_id, author, rating, date, title, comment, verified)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  SEED_PRODUCTS.forEach((p) => {
    insertProd.run(
      p.id, p.name, p.brand, p.categorySlug, p.price, p.originalPrice, p.discountPercent,
      p.rating, p.reviewCount, p.unit, p.sku, p.stockCount, p.soldCount, p.totalStock,
      p.isBestSeller, p.isTopSaver, p.isOrganic, p.description,
      JSON.stringify(p.features), JSON.stringify(p.nutritionFacts),
      p.storageInstructions, p.origin, p.shelfLife
    );

    p.reviews.forEach((r) => {
      insertReview.run(r.id, p.id, r.author, r.rating, r.date, r.title, r.comment, r.verified);
    });
  });

  // Insert Deal Campaign & Items
  const endsAt = new Date(Date.now() + (5 * 3600 + 25 * 60 + 37) * 1000).toISOString();
  db.prepare("INSERT OR REPLACE INTO deal_campaigns (id, title, ends_at, cycle_seconds) VALUES ('top-saver-today', 'Top Saver Today', ?, 86400)")
    .run(endsAt);

  const insertDealItem = db.prepare('INSERT OR REPLACE INTO deal_items (campaign_id, product_id, sort_order, is_featured) VALUES (?, ?, ?, ?)');
  SEED_PRODUCTS.forEach((p, idx) => {
    insertDealItem.run('top-saver-today', p.id, idx, idx === 0 ? 1 : 0);
  });

  db.exec('PRAGMA user_version = 1;');
  db.exec('COMMIT;');
  console.log('✅ Database seeded successfully with transaction committed.');
} catch (error) {
  db.exec('ROLLBACK;');
  console.error('❌ Failed to seed database:', error);
  process.exit(1);
}

// 3. Print Row Counts Verification
const counts = [
  { table: 'categories', count: db.prepare('SELECT count(*) as c FROM categories').get().c },
  { table: 'products', count: db.prepare('SELECT count(*) as c FROM products').get().c },
  { table: 'reviews', count: db.prepare('SELECT count(*) as c FROM reviews').get().c },
  { table: 'brands', count: db.prepare('SELECT count(*) as c FROM brands').get().c },
  { table: 'banners', count: db.prepare('SELECT count(*) as c FROM banners').get().c },
  { table: 'deal_campaigns', count: db.prepare('SELECT count(*) as c FROM deal_campaigns').get().c },
  { table: 'deal_items', count: db.prepare('SELECT count(*) as c FROM deal_items').get().c },
];

console.log('\n📊 Seed Records Summary:');
console.table(counts);

db.close();
console.log('🎉 Onboarding seed completed. Ready for development!\n');
