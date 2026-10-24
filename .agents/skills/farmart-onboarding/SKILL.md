---
name: farmart-onboarding
description: >-
  Use this skill to onboard developers and AI agents to the Farmart Grocery project, initialize or reset the SQLite database, and populate starting seed data (categories, products, reviews, brands, banners, deals) to kickstart local development.
---

# Farmart Project Onboarding & Seed Data Skill

This skill guides developers and AI agents through bootstrapping, seeding, and verifying the Farmart Grocery application for local development.

---

## 1. Quick Start (1-Minute Setup)

Run the automated seeder script from the repository root:

```bash
# Seed or update the database with starting data
npm run db:seed
# Or directly:
node scripts/seed-db.js
```

To wipe and re-seed from a completely clean slate:

```bash
npm run db:reset
# Or directly:
node scripts/reset-db.js
```

---

## 2. Prerequisites & Environment Check

Before seeding, ensure your environment meets these requirements:
- **Node.js**: `v20.0.0` or higher (uses Node's native `node:sqlite` driver; no external native build tools required).
- **SQLite Database Path**: Default is `data/farmart.db`. You can override this using the `FARMART_DB_PATH` environment variable.

Check your Node version:
```bash
node -v
```

---

## 3. Seed Data Specification & Current Records

The seed dataset replicates a production-ready grocery catalog:

| Entity / Table | Count | Description & Key Records |
|---|:---:|---|
| **`categories`** | 8 | `fruits`, `breads`, `seafood`, `meats`, `wines`, `coffee`, `dairy`, `pets` |
| **`products`** | 4 | `ice-golds-beer` (Beer), `british-beef-mince` (Beef), `farmhouse-soft-white` (Bread), `blood-orange` (Fruit) |
| **`reviews`** | 7 | Customer reviews with 1-5 ratings, verified badges, and commentary |
| **`brands`** | 4 | Featured brands: `foodpouch`, `tea365`, `soda-brand`, `farmart` |
| **`banners`** | 2 | Promotional banners: `summer-juice-milk` (hero-main), `seeds-20-off` (hero-side) |
| **`deal_campaigns`** | 1 | Active campaign: `top-saver-today` with 24-hour countdown cycle |
| **`deal_items`** | 4 | Products linked to `top-saver-today`, with `ice-golds-beer` as featured spotlight deal |

---

## 4. Step-by-Step Onboarding Procedures

### Step 4.1: Database Migration & Seeding
Execute the seeder script to create all tables and populate initial records:
```bash
node scripts/seed-db.js
```

Verify that the terminal outputs:
```text
✅ Database seeded successfully with transaction committed.
📊 Seed Records Summary:
- categories: 8
- products: 4
- reviews: 7
- brands: 4
- banners: 2
- deal_campaigns: 1
- deal_items: 4
```

### Step 4.2: Run Automated Backend Tests
Validate that both unit tests and route integration tests pass against the test database:
```bash
# Run unit & integration test suites
./node_modules/.bin/vitest run --project=unit --project=integration

# Or generate the interactive HTML test report
node scripts/generate-test-report.js
```

### Step 4.3: Start Local Development Servers
Start the Next.js development server:
```bash
npm run dev
```

The application will be accessible at:
- **Storefront**: `http://localhost:3000`
- **Interactive ER Diagram**: `http://localhost:3000/mermaid.html`
- **Swagger API Documentation**: `http://localhost:3000/docs`
- **Test Execution Report**: `http://localhost:3000/test-report.html`
- **OpenAPI JSON Spec**: `http://localhost:3000/docs/openapi.json`
- **Storybook UI Explorer**: `npm run storybook` (port `6006`)

---

## 5. Development Verification Checklist

After onboarding, verify the key API endpoints using `curl` or your browser:

```bash
# 1. Categories endpoint
curl -s http://localhost:3000/api/categories | head -c 200

# 2. Products catalog search
curl -s http://localhost:3000/api/products | head -c 200

# 3. Product detail by ID
curl -s http://localhost:3000/api/products/ice-golds-beer | head -c 200

# 4. Top Saver Deals
curl -s http://localhost:3000/api/deals | head -c 200
```

---

## 6. Troubleshooting & Reset

### Problem: Corrupted database or stale test state
Run the reset script to cleanly remove `data/farmart.db`, `farmart.db-wal`, `farmart.db-shm` and rebuild:
```bash
npm run db:reset
```

### Problem: Testing in an isolated environment without touching `data/farmart.db`
Set `FARMART_DB_PATH` to point to a temporary test file:
```bash
FARMART_DB_PATH=data/test-temp.db node scripts/seed-db.js
```
