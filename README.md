# Farmart Next.js & Storybook (Lab 3 & 4)

Modern e-commerce grocery store and design system built with Next.js 16, React 19, Tailwind CSS v4, SQLite, and Storybook 10.

---

## 🚀 Quick Start

### 1. Install Dependencies & Setup Database
```bash
npm install
npm run db:reset    # Clean and recreate SQLite schema
npm run db:seed     # Populate seed data (categories, products, reviews, deals)
```

### 2. Development Server (Next.js)
```bash
npm run dev
```
- **Storefront Home**: [http://localhost:3000](http://localhost:3000)
- **Interactive Overview & Flow**: [http://localhost:3000/overview](http://localhost:3000/overview)
- **Design System Showcase**: [http://localhost:3000/design](http://localhost:3000/design)
- **API Documentation & Explorer**: [http://localhost:3000/docs](http://localhost:3000/docs)
- **Interactive Database ER Diagram**: [http://localhost:3000/mermaid.html](http://localhost:3000/mermaid.html)

### 3. Storybook UI Explorer
```bash
npm run storybook
```
- **Storybook Dashboard**: [http://localhost:6006](http://localhost:6006)
- **Build Static Storybook**:
```bash
npm run build-storybook
```

---

## 🎨 Design System

The visual language follows the specification defined in [`DESIGN.md`](./DESIGN.md) (compliant with [getdesign.md](https://getdesign.md/what-is-design-md)):
- **Primary Brand Color**: `#FAB528` (Warm golden-amber)
- **Atmosphere**: Bright white grocery canvas (`#FFFFFF`) with pastel category surfaces
- **Typography Scale**: High-legibility modern sans-serif
- **Core Components**:
  - `Dialog` (`app/components/Dialog.tsx`)
  - `Hero Banners` (Summer Juice Milk & 20% Sale Off)
  - `Category Cards` (8 merchandise strips)
  - `Top Saver Today` (Countdown deals with live dynamic pricing)
  - `Quantity Stepper` (`app/components/QuantityStepper.tsx`)
  - `Stock Status Badge` & `Rating Breakdown`

---

## 🛠 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start Next.js development server on `http://localhost:3000` |
| `npm run build` | Build optimized production bundle |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint (Next.js, TypeScript, and Storybook rules) |
| `npm test` | Run backend unit and integration tests via Vitest |
| `npm run test:unit` | Run business logic unit tests |
| `npm run test:integration` | Run API route & SQLite cascade tests |
| `npm run test:report` | Run test suites and regenerate HTML report (`public/test-report.html`) |
| `npm run db:seed` | Seed catalog into SQLite database (`data/farmart.db`) |
| `npm run db:reset` | Reset and re-apply database schema from scratch |
| `npm run storybook` | Launch Storybook on port 6006 |
| `npm run build-storybook`| Generate static Storybook site |

---

## 🏗 Architecture & Modules

- **`app/`**: Next.js App Router (Storefront `/`, Product `/product/[id]`, Design System `/design`, Architecture Overview `/overview`, OpenAPI Docs `/docs`).
- **`app/api/`**: RESTful API endpoints (`/api/products`, `/api/categories`, `/api/deals`, `/api/brands/featured`, `/api/promotions/banners`).
- **`lib/db/`**: SQLite persistence with Node.js native `DatabaseSync` (`node:sqlite`), foreign keys, and cascading deletes.
- **`lib/services/`**: Pure business logic decoupled from I/O for deterministic testing.
- **`stories/`**: Storybook stories and component interaction tests.
- **`.agents/`**: AI Agent Customizations:
  - `skills/farmart-onboarding/`: Onboarding and database seeding runbook.
  - `hooks.json` & `scripts/`: PreToolUse safety hooks blocking `rm -rf` and `git push --force`.
- **`schema.mmd`**: Mermaid Entity-Relationship diagram.

---

## 🧪 Testing

```bash
# Run all unit & integration tests
npm test

# Generate and view interactive visual test report
npm run test:report
```
Test report is exported to `public/test-report.html` and viewable at [http://localhost:3000/test-report.html](http://localhost:3000/test-report.html).
# SDLC-course
