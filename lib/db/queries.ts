import { getDb } from "./index";
import type { Banner, Brand, Category, DealsResponse, ProductPage, ProductSort, ProductSummary } from "@/lib/api-types";
import type { Product } from "@/app/data/products";

interface ProductRow {
  id: string;
  name: string;
  brand: string;
  category_id: string;
  category_name?: string;
  price: number;
  original_price: number;
  discount_percent: number;
  rating: number;
  review_count: number;
  unit: string;
  sku: string;
  stock_count: number;
  sold_count: number;
  total_stock: number;
  is_best_seller: number;
  is_top_saver: number;
  is_organic: number;
  description: string;
  features_json: string;
  nutrition_json: string;
  storage_instructions: string | null;
  origin: string | null;
  shelf_life: string | null;
  is_featured?: number;
}

function mapRowToSummary(row: ProductRow): ProductSummary {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category_name ?? row.category_id,
    categorySlug: row.category_id,
    price: Number(row.price),
    originalPrice: Number(row.original_price),
    discountPercent: Number(row.discount_percent),
    rating: Number(row.rating),
    reviewCount: Number(row.review_count),
    unit: row.unit,
    inStock: row.stock_count > 0,
    stockCount: Number(row.stock_count),
    soldCount: Number(row.sold_count),
    totalStock: Number(row.total_stock),
    isBestSeller: Boolean(row.is_best_seller),
    isTopSaver: Boolean(row.is_top_saver),
    isOrganic: Boolean(row.is_organic),
  };
}

export function getCategories(): Category[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT c.id, c.name, COUNT(p.id) as productCount
    FROM categories c
    LEFT JOIN products p ON p.category_id = c.id
    GROUP BY c.id, c.name, c.sort_order
    ORDER BY c.sort_order ASC
  `).all() as unknown as { id: string; name: string; productCount: number }[];

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    productCount: Number(r.productCount),
  }));
}

export interface SearchProductsParams {
  q?: string;
  category?: string;
  brand?: string;
  bestSeller?: boolean;
  topSaver?: boolean;
  organic?: boolean;
  inStock?: boolean;
  sort?: ProductSort;
  page?: number;
  limit?: number;
}

export function searchProducts(params: SearchProductsParams = {}): ProductPage {
  const db = getDb();
  const {
    q,
    category,
    brand,
    bestSeller,
    topSaver,
    organic,
    inStock,
    sort = "relevance",
    page = 1,
    limit = 20,
  } = params;

  const conditions: string[] = [];
  const sqlParams: (string | number)[] = [];

  if (q && q.trim()) {
    const term = `%${q.trim()}%`;
    conditions.push("(p.name LIKE ? OR p.brand LIKE ? OR p.description LIKE ?)");
    sqlParams.push(term, term, term);
  }

  if (category && category !== "ALL CATEGORIES") {
    // Matches category id (slug) or name
    conditions.push("(p.category_id = ? OR c.name = ?)");
    sqlParams.push(category, category);
  }

  if (brand) {
    conditions.push("p.brand = ?");
    sqlParams.push(brand);
  }

  if (bestSeller !== undefined) {
    conditions.push("p.is_best_seller = ?");
    sqlParams.push(bestSeller ? 1 : 0);
  }

  if (topSaver !== undefined) {
    conditions.push("p.is_top_saver = ?");
    sqlParams.push(topSaver ? 1 : 0);
  }

  if (organic !== undefined) {
    conditions.push("p.is_organic = ?");
    sqlParams.push(organic ? 1 : 0);
  }

  if (inStock !== undefined) {
    if (inStock) {
      conditions.push("p.stock_count > 0");
    } else {
      conditions.push("p.stock_count = 0");
    }
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // Count total
  const countSql = `
    SELECT COUNT(*) as total
    FROM products p
    JOIN categories c ON c.id = p.category_id
    ${whereClause}
  `;
  const countRow = db.prepare(countSql).get(...sqlParams) as unknown as { total: number };
  const total = Number(countRow?.total ?? 0);

  // Sorting
  let orderBy = "p.rowid ASC";
  if (sort === "price_asc") {
    orderBy = "p.price ASC";
  } else if (sort === "price_desc") {
    orderBy = "p.price DESC";
  } else if (sort === "rating") {
    orderBy = "p.rating DESC";
  } else if (sort === "discount") {
    orderBy = "p.discount_percent DESC";
  }

  const offset = Math.max(0, (page - 1) * limit);

  const dataSql = `
    SELECT p.*, c.name as category_name
    FROM products p
    JOIN categories c ON c.id = p.category_id
    ${whereClause}
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
  `;

  const rows = db.prepare(dataSql).all(...sqlParams, limit, offset) as unknown as ProductRow[];

  return {
    data: rows.map(mapRowToSummary),
    page,
    limit,
    total,
  };
}

export function getProductById(id: string): Product | null {
  const db = getDb();
  const row = db.prepare(`
    SELECT p.*, c.name as category_name
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE p.id = ?
  `).get(id) as unknown as ProductRow | undefined;

  if (!row) return null;

  const reviewRows = db.prepare(`
    SELECT id, author, rating, date, title, comment, verified
    FROM reviews
    WHERE product_id = ?
    ORDER BY rowid ASC
  `).all(id) as unknown as {
    id: string;
    author: string;
    rating: number;
    date: string;
    title: string | null;
    comment: string;
    verified: number;
  }[];

  return {
    ...mapRowToSummary(row),
    sku: row.sku,
    description: row.description,
    features: JSON.parse(row.features_json || "[]"),
    nutritionFacts: JSON.parse(row.nutrition_json || "{}"),
    storageInstructions: row.storage_instructions ?? "",
    origin: row.origin ?? "",
    shelfLife: row.shelf_life ?? "",
    reviews: reviewRows.map((r) => ({
      id: r.id,
      author: r.author,
      rating: r.rating,
      date: r.date,
      title: r.title ?? "",
      comment: r.comment,
      verified: Boolean(r.verified),
    })),
    relatedProductIds: ["ice-golds-beer", "british-beef-mince", "farmhouse-soft-white", "blood-orange"].filter(
      (pid) => pid !== id
    ),
  };
}

export function getDeals(): DealsResponse {
  const db = getDb();
  const campaign = db.prepare(`
    SELECT id, title, ends_at
    FROM deal_campaigns
    WHERE id = 'top-saver-today'
  `).get() as unknown as { id: string; title: string; ends_at: string } | undefined;

  const rows = db.prepare(`
    SELECT p.*, c.name as category_name, di.is_featured
    FROM deal_items di
    JOIN products p ON p.id = di.product_id
    JOIN categories c ON c.id = p.category_id
    WHERE di.campaign_id = 'top-saver-today'
    ORDER BY di.sort_order ASC
  `).all() as unknown as (ProductRow & { is_featured: number })[];

  const featuredRow = rows.find((r) => r.is_featured === 1);

  return {
    id: campaign?.id ?? "top-saver-today",
    title: campaign?.title ?? "Top Saver Today",
    endsAt: campaign?.ends_at ?? new Date(Date.now() + 5 * 3600 * 1000).toISOString(),
    featuredProductId: featuredRow?.id ?? rows[0]?.id ?? null,
    products: rows.map(mapRowToSummary),
  };
}

export function getBanners(): Banner[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT id, placement, title, subtitle, cta_label as ctaLabel, href
    FROM banners
    WHERE is_active = 1
    ORDER BY sort_order ASC
  `).all() as unknown as Banner[];

  return rows;
}

export function getFeaturedBrands(): Brand[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT id, name, headline, background
    FROM brands
    WHERE is_featured = 1
    ORDER BY sort_order ASC
  `).all() as unknown as Brand[];

  return rows;
}
