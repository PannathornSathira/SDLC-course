import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { seedDatabase } from "./seed";

/**
 * SQLite connection for the Farmart backend.
 *
 * Uses Node's built-in `node:sqlite` driver (no native npm dependency).
 * The file lives at `data/farmart.db` (override with FARMART_DB_PATH) and is
 * created, migrated, and seeded automatically on first use.
 */

const SCHEMA_VERSION = 1;

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

function openDatabase(): DatabaseSync {
  const file = process.env.FARMART_DB_PATH ?? path.join(process.cwd(), "data", "farmart.db");
  if (file !== ":memory:") mkdirSync(path.dirname(file), { recursive: true });

  const db = new DatabaseSync(file, { enableForeignKeyConstraints: true });
  db.exec("PRAGMA journal_mode = WAL;");

  const { user_version: version } = db.prepare("PRAGMA user_version").get() as { user_version: number };
  if (version < SCHEMA_VERSION) {
    db.exec("BEGIN");
    try {
      db.exec(SCHEMA);
      seedDatabase(db);
      db.exec(`PRAGMA user_version = ${SCHEMA_VERSION}`);
      db.exec("COMMIT");
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  }
  return db;
}

// Reuse one connection across hot reloads in development.
const globalForDb = globalThis as typeof globalThis & { __farmartDb?: DatabaseSync };

export function getDb(): DatabaseSync {
  globalForDb.__farmartDb ??= openDatabase();
  return globalForDb.__farmartDb;
}

export function closeDb(): void {
  if (globalForDb.__farmartDb) {
    try {
      globalForDb.__farmartDb.close();
    } catch {
      // ignore
    }
    globalForDb.__farmartDb = undefined;
  }
}

