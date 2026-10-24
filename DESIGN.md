---
version: 1.0.0
name: Farmart-design-system
description: "A fresh, modern, and vibrant e-commerce grocery design system inspired by Farmart Supermarket. Built around a clean white canvas, warm golden-amber primary accents, pastel surface containers, and crisp micro-interactions optimized for AI coding agents and frontend engineers."

colors:
  # Primary Brand Colors
  primary: "#fab528"
  primary-hover: "#e5a420"
  primary-active: "#c98f16"
  primary-subtle: "#fef3c7"
  on-primary: "#111827"

  # Accents & Semantics
  accent-deal: "#e05638"
  accent-deal-bg: "#fee2e2"
  accent-save: "#ff4d4f"
  accent-success: "#22c55e"
  accent-rating: "#f59e0b"

  # Ink & Typography
  ink: "#0f172a"
  ink-strong: "#030712"
  body: "#374151"
  body-muted: "#6b7280"
  body-subtle: "#9ca3af"

  # Canvas & Backgrounds
  canvas: "#ffffff"
  canvas-subtle: "#f9fafb"
  canvas-muted: "#f3f4f6"

  # Surfaces & Containers
  surface-card: "#ffffff"
  surface-hero-main: "#ebf1f5"
  surface-hero-promo: "#fab528"
  surface-brand-purple: "#f0edf5"
  surface-brand-tea: "#f6f4ec"
  surface-brand-blue: "#edf2f7"
  surface-brand-mint: "#e9f2ec"
  surface-signup: "#fff8f2"

  # Borders & Dividers
  hairline: "#e5e7eb"
  hairline-soft: "#f3f4f6"
  hairline-strong: "#d1d5db"

typography:
  display-hero:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "36px"
    fontWeight: 800
    lineHeight: "1.15"
    letterSpacing: "-0.02em"
  display-promo:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "28px"
    fontWeight: 900
    lineHeight: "1.1"
    letterSpacing: "-0.01em"
  heading-section:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: "1.3"
    letterSpacing: "-0.01em"
  title-card:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: "1.35"
    letterSpacing: "0"
  body-regular:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.5"
    letterSpacing: "0"
  caption:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "1.4"
    letterSpacing: "0"
  tag-uppercase:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "10px"
    fontWeight: 700
    lineHeight: "1.2"
    letterSpacing: "0.08em"
    textTransform: "uppercase"

rounded:
  none: "0px"
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  xxl: "24px"
  pill: "9999px"

spacing:
  xxs: "4px"
  xs: "8px"
  sm: "12px"
  base: "16px"
  md: "20px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
  section: "40px"

components:
  top-header:
    backgroundColor: "{colors.canvas}"
    borderBottom: "1px solid {colors.hairline-soft}"
    height: "64px"
  search-bar:
    backgroundColor: "{colors.canvas}"
    borderColor: "{colors.hairline}"
    focusBorderColor: "{colors.primary}"
    rounded: "{rounded.md}"
    height: "44px"
  category-button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.xs}"
    padding: "10px 16px"
  hero-main:
    backgroundColor: "{colors.surface-hero-main}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xxl}"
    padding: "32px 40px"
  hero-promo:
    backgroundColor: "{colors.surface-hero-promo}"
    textColor: "{colors.ink-strong}"
    rounded: "{rounded.xxl}"
    padding: "32px"
  category-card:
    backgroundColor: "{colors.canvas}"
    borderColor: "{colors.hairline-soft}"
    rounded: "{rounded.xl}"
    padding: "16px"
  brand-card:
    rounded: "{rounded.xl}"
    imageHeight: "192px"
  product-deal-card:
    backgroundColor: "{colors.canvas}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.xl}"
    padding: "20px"
  countdown-badge:
    backgroundColor: "{colors.accent-deal}"
    textColor: "#ffffff"
    rounded: "{rounded.xs}"
    padding: "4px 10px"
  signup-card:
    backgroundColor: "{colors.surface-signup}"
    borderColor: "#ffedd5"
    rounded: "{rounded.xl}"
    padding: "24px"
  modal-dialog:
    overlayBackgroundColor: "rgba(15, 23, 42, 0.45)"
    backdropBlur: "4px"
    backgroundColor: "{colors.canvas}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"
    shadow: "shadow-2xl"
    headerTypography: "{typography.heading-section}"
    bodyTypography: "{typography.body-regular}"
    primaryAction: "{components.button-primary}"
  button-primary:
    backgroundColor: "{colors.primary}"
    hoverColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    padding: "10px 18px"
  button-pill-white:
    backgroundColor: "#ffffff"
    hoverColor: "#f9fafb"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "10px 24px"
  badge:
    variants:
      deal: { backgroundColor: "{colors.accent-deal}", textColor: "#ffffff" }
      save: { backgroundColor: "{colors.accent-save}", textColor: "#ffffff" }
      bestseller: { backgroundColor: "#fef3c7", textColor: "#78350f", borderColor: "#fcd34d" }
      topsaver: { backgroundColor: "#d1fae5", textColor: "#065f46", borderColor: "#6ee7b7" }
      instock: { backgroundColor: "#ecfdf5", textColor: "#047857", borderColor: "#a7f3d0" }
      outstock: { backgroundColor: "#f3f4f6", textColor: "#6b7280", borderColor: "#e5e7eb" }
      organic: { backgroundColor: "#dcfce7", textColor: "#166534", borderColor: "#86efac" }
    rounded: "{rounded.xs}"
    fontSize: "10px"
    fontWeight: "700"
  quantity-stepper:
    backgroundColor: "{colors.canvas}"
    borderColor: "{colors.hairline}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    sizes: { sm: "h-7 text-xs", md: "h-9 text-xs", lg: "h-11 text-sm" }
  free-shipping-bar:
    backgroundColor: "#fffbeb"
    borderColor: "#fde68a"
    progressGradient: "from-amber-400 to-[#fab528]"
    qualifiedColor: "{colors.accent-success}"
    threshold: 99.0
  breadcrumb:
    fontSize: "12px"
    textColor: "{colors.body-muted}"
    activeTextColor: "{colors.ink}"
    separator: "/"
---

# Farmart Design System (DESIGN.md)

This document establishes the comprehensive visual language, design tokens, component constraints, and behavioral rules for the Farmart grocery platform, adhering to the standard specification from [getdesign.md](https://getdesign.md/what-is-design-md).

---

## 1. Visual Theme & Atmosphere

### 1.1 Brand Personality
Farmart communicates **freshness, clarity, reliability, and warm hospitality**. It rejects sterile developer minimalism and cluttered discount-warehouse noise in favor of a curated, modern grocery supermarket experience.

- **Primary Sensation**: Sunlit freshness, clean aisles, high accessibility, and joyful food discovery.
- **Atmospheric Palette**: A crisp white canvas (`#FFFFFF`) grounded by deep slate typography (`#0F172A`), illuminated by radiant golden-amber brand accents (`#FAB528`), and cushioned by soft pastel packaging surfaces (lavender, soft sage mint, chilled blue, and warm tea tints).
- **Visual Rhythm**: High-density functional navigation transitioning seamlessly into comfortable, card-based merchandising modules with clear call-to-actions.

---

## 2. Color Palette & Roles

Every color in the system possesses a designated semantic role to eliminate ad-hoc styling and aesthetic divergence.

| Token | Hex Value | Semantic Job / Role |
| :--- | :--- | :--- |
| `primary` | `#FAB528` | Main brand color, "SHOP BY CATEGORY" button, primary CTAs, active carousel arrows |
| `primary-hover` | `#E5A420` | Hover state for interactive primary actions |
| `primary-active` | `#C98F16` | Active/pressed state for primary actions |
| `primary-subtle` | `#FEF3C7` | Background highlight for active category cards |
| `accent-deal` | `#E05638` | Countdown timer badges ("Expires in"), flash deal highlights |
| `accent-save` | `#FF4D4F` | Percentage discount tags ("Save 15%") |
| `accent-rating` | `#F59E0B` | 5-star customer feedback rating stars |
| `accent-success` | `#22C55E` | In-stock indicators, organic freshness badges |
| `ink` | `#0F172A` | Primary titles, price tags, and high-emphasis labels |
| `body` | `#374151` | Default paragraph text, feature descriptions |
| `body-muted` | `#6B7280` | Secondary links, brand tags, breadcrumbs |
| `body-subtle` | `#9CA3AF` | Inactive pagination, input placeholders |
| `canvas` | `#FFFFFF` | Main page background, card surfaces, search inputs |
| `canvas-subtle` | `#F9FAFB` | Section dividers, subtle footer background |
| `surface-hero-main` | `#EBF1F5` | Cool gray-cyan tinted container for the active summer hero |
| `surface-hero-promo` | `#FAB528` | Warm sunny yellow container for promotional sale banners |
| `surface-brand-purple` | `#F0EDF5` | Pastel lilac background for snack & confectionery cards |
| `surface-brand-tea` | `#F6F4EC` | Warm wheat/sand background for organic tea canisters |
| `surface-brand-blue` | `#EDF2F7` | Cool slate-sky background for chilled canned beverages |
| `surface-brand-mint` | `#E9F2EC` | Fresh pale sage background for butcher & charcuterie |
| `surface-signup` | `#FFF8F2` | Warm apricot cream background for membership sign-up |
| `hairline` | `#E5E7EB` | Standard card borders, input borders, search dividers |
| `hairline-soft` | `#F3F4F6` | Internal row dividers, subtle card separators |

> [!IMPORTANT]
> **No Dark Mode by Default**: Food and fresh produce e-commerce relies heavily on natural light, vibrant fruit colors, and clean backgrounds. Do not force pitch-black dark modes unless explicitly requested.

---

## 3. Typography

The typography uses high-legibility modern sans-serif typography (`Inter`, `Geist Sans`, or system fonts) with strict hierarchies.

### 3.1 Type Scale Hierarchy

| Style Token | Font Size | Weight | Line Height | Letter Spacing | Target Elements |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `display-hero` | 36px | 800 | 1.15 | -0.02em | Main hero banner headline |
| `display-promo` | 28px | 900 | 1.10 | -0.01em | Promo box headlines ("20% SALE OFF") |
| `heading-section`| 20px | 700 | 1.30 | -0.01em | Section titles ("Browse by Category", "Top Saver Today") |
| `title-card` | 14px | 600 | 1.35 | 0.00em | Product titles, card names |
| `body-regular` | 14px | 400 | 1.50 | 0.00em | Descriptive copy, subtitles |
| `caption` | 12px | 500 | 1.40 | 0.00em | Prices, links, dropdowns, input text |
| `tag-uppercase` | 10px | 700 | 1.20 | +0.08em | Category meta tags (`FOODPOUCH`, `TEA 365`, `FARMART`) |
| `countdown` | 12px | 700 | 1.00 | +0.05em | Monospace countdown digits (`05 : 25 : 37`) |

---

## 4. Spacing & Layout

### 4.1 Structural Layout Rules
- **Container Max-Width**: `1280px` (`max-w-7xl` in Tailwind), horizontally centered with responsive horizontal padding:
  - Mobile: `16px` (`px-4`)
  - Tablet: `24px` (`px-6`)
  - Desktop: `32px` (`px-8`)
- **Vertical Rhythm**:
  - Distance between major sections: `40px` to `48px` (`space-y-10` or `space-y-12`).
  - Section header to content grid: `16px` (`space-y-4`).
  - Card internal padding: `16px` (compact) to `24px` (featured deals and banners).

### 4.2 Standard Layout Ratios
- **Hero Module**: Asymmetrical 2-column split (Left ~68% width `col-span-8`, Right ~32% width `col-span-4`).
- **Category Strip**: 8 equal columns on desktop (`grid-cols-8`), collapsing to 4 on tablet and 2 on mobile.
- **Featured Brands**: 4 equal columns on desktop (`grid-cols-4`).
- **Top Saver Today**: 3-part layout (Left deal `col-span-3`, Center products `col-span-6` with 3 columns, Right signup card `col-span-3`).

---

## 5. Component Rules

### 5.1 Top Navigation Bar
- **Logo**: Bold black wordmark (`text-2xl font-black`) accompanied by an amber accent dot (`#FAB528`) and small tracked subtext `GROCERY`.
- **Search Bar**:
  - Integrated pill container with `1px solid #E5E7EB`.
  - Left: Dropdown category selector with trailing arrow (`ALL CATEGORIES ▾`).
  - Center: Full-width text input with placeholder `"I'm searching for..."`.
  - Right: Search button with magnifying glass icon.
- **Customer Utility Area**:
  - Hotline display: phone icon, bold number (`8 800 332 65-66`), caption `"Support 24/7"`.
  - Icon triggers: User account, Wishlist (with amber counter badge), and Cart (with item badge, `"Your Cart"`, and formatted total price).

### 5.2 Category Navigation Bar
- **"SHOP BY CATEGORY"**: Prominent button with warm amber background (`#FAB528`), dark bold text, and 3-line hamburger icon.
- **Navigation Links**: Horizontal scrolling flex row with hover transitions (`hover:text-amber-600`), dropdown chevrons for multi-level menus, and a special highlight for `⚡ Deals Today`.
- **Right Item**: `"Recently Viewed"` with clock history icon.

### 5.3 Hero Banner Cards
- **Main Banner**:
  - Gentle gradient surface (`#EBF1F5` to `#E2EBF1`), `24px` corner radius.
  - Left content zone with bold heading, descriptive paragraph, and white pill button (`Shop Now`).
  - Right graphic zone displaying angled packaging visuals and ambient drop shadows.
  - Bottom right: Active carousel step pills (`1` active amber, `2` subtle white).
- **Promo Banner**:
  - Radiant amber background (`#FAB528`), `24px` corner radius.
  - Bold discount headline, item meta, white pill CTA, and 3D food packaging illustration.

### 5.4 Category Cards
- **Dimensions & Box**: Square/portrait ratio, `16px` rounded corners, `1px solid #F3F4F6`.
- **Resting State**: Clean white card, centered 48px vectorized icon, 2-line title.
- **Active / Selected State**: Highlighted with `2px solid #FAB528`, gentle ambient shadow, and warm background tint.

### 5.5 Featured Brand Cards
- **Image Showcase**: Dedicated pastel container (`192px` height) with soft thematic background color matching the product type (e.g. lilac for snacks, mint for meats).
- **Metadata**: Uppercase tracking brand label (`text-[10px] text-gray-400 font-bold`) followed by item proposition.

### 5.6 Top Saver Deal Cards
- **Featured Deal**:
  - Top right heart icon for instant wishlist toggling.
  - Bold product mockup, rating stars, price, and `"Sold: X/Y"` stock progress bar.
  - Integrated stepper `[-] [qty] [+]` with real-time price calculation (`Total: $XX.XX`).
  - Full-width `+ Add to Cart` CTA in primary amber.
- **Standard Product Grid**:
  - Discount ribbon badge at top-left (`Save 15%`).
  - Star ratings with review count.
  - Dual price display (current bold price + line-through original price).
  - Visual stock status indicator.

### 5.7 Membership Sign-up Module
- **Atmosphere**: Warm light-apricot background (`#FFF8F2`) with subtle organic background accents.
- **Header**: High-impact `"15% OFF"` heading in terracotta orange (`#E05638`).
- **Form Controls**: Three white inputs with embedded left icons (Email, Password, Confirm Password) and a full-width `"Register Now"` CTA.

### 5.8 Modal Dialog System
- **Backdrop Overlay**: Semi-transparent dark slate `rgba(15, 23, 42, 0.45)` with `backdrop-blur-sm` (4px). Smooth fade-in animation (`duration-200 ease-out`). Clicking outside closes the modal.
- **Dialog Surface**: Pure white canvas (`#FFFFFF`), `rounded-xl` (`16px`), 1px hairline border (`#E5E7EB`), and `shadow-2xl` floating elevation.
- **Header Structure**:
  - Title: `heading-section` (`text-lg sm:text-xl font-bold text-gray-950`).
  - Subtitle: `body-regular` (`text-xs sm:text-sm text-gray-500 mt-1`).
  - Close Trigger: Circular or rounded `✕` button (`text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1.5`).
- **Body Content**: Flexible padded area (`p-6`) housing confirmation copy, forms, or product quick-views.
- **Footer Actions**: Distinct action bar separated by `border-t border-gray-100` (`px-6 py-4 bg-gray-50/50 rounded-b-xl flex justify-end gap-3`):
  - Secondary/Dismiss: Ghost or border button (`border border-gray-200 text-gray-700 hover:bg-gray-100 font-semibold px-4 py-2 rounded-lg text-xs`).
  - Primary Confirm: Signature amber button (`bg-[#FAB528] hover:bg-[#E5A420] text-gray-950 font-bold px-5 py-2 rounded-lg text-xs shadow-xs`).
- **Accessibility & Interaction**:
  - Escape key listener automatically dismisses the active dialog.
  - Background body scroll locking (`overflow: hidden`) when visible.
  - Scale entrance animation: initiates at `scale-95 opacity-0` and transitions smoothly to `scale-100 opacity-100` within 200ms.

### 5.9 Product Detail & Catalog Components
- **Badge System (`Badge.tsx`)**:
  - `deal`: Urgent terracotta red (`#E05638`) for flash deals.
  - `save`: Vivid coral (`#FF4D4F`) indicating discount percentages (`Save 15%`).
  - `bestseller`: Amber tint with flame icon (`🔥 Best Seller`).
  - `topsaver`: Mint green tint with coin icon (`💰 Top Saver`).
  - `instock`: Soft green badge with animated pulsing live indicator dot (`● In Stock`).
  - `outstock`: Muted gray with static indicator dot (`● Out of Stock`).
  - `organic`: Fresh leaf green badge (`🌿 100% Organic`).
- **Quantity Stepper (`QuantityStepper.tsx`)**:
  - Precision unit counter with decrement (`−`), monospace quantity display, and increment (`+`).
  - Bordered container with subtle shadow (`border border-gray-200 bg-white rounded-lg`).
  - Size variants: `sm` (height 28px), `md` (height 36px), `lg` (height 44px).
  - Built-in bounds clamping (`min`, `max`) and disabled state styling.
- **Free Shipping Progress Tracker (`FreeShippingBar.tsx`)**:
  - Gamified spending threshold bar calculating distance to the $99.00 free shipping minimum.
  - Ambient amber container (`bg-amber-50/70 border border-amber-200/80 rounded-xl`).
  - Dynamic progress indicator transitioning to radiant emerald upon qualification (`🎉 Congratulations! You unlocked FREE Delivery!`).
- **Breadcrumb Trail (`Breadcrumb.tsx`)**:
  - Semantic navigational trail (`Home / Category / Product Name`).
  - Subdued gray links (`hover:text-amber-600 transition-colors`) with bold current page terminal indicator.
- **Product Detail Page Architecture (`/product/[id]`)**:
  - Left column: Dynamic SVG product visual presentation, thumbnail gallery picker, and quality badges.
  - Right column: Pricing matrix with discount badges, interactive pack selector, live quantity stepper, savings calculator, Free Shipping tracker, and direct add-to-cart CTAs.
  - Detail tabs: Deep information hierarchy encompassing Description, Nutrition Facts, Verified Customer Reviews, and Cold-Chain Shipping Guarantees.
  - Sticky bottom action bar: Fixed viewport footer bar keeping Add to Cart and live total accessible regardless of scroll depth.

---

## 6. Elevation & Surfaces

Farmart uses a **soft, non-intrusive elevation system** to maintain a crisp, clean aesthetic.

| Level | CSS / Tailwind Equivalent | Application |
| :--- | :--- | :--- |
| **Flat** | `border border-gray-100 bg-white` | Standard resting category cards, secondary links |
| **Subtle (xs)** | `shadow-xs border border-gray-200` | Search input, top saver deal card, product items |
| **Card Hover** | `shadow-md -translate-y-0.5` | Hovered products and brand cards |
| **Selected** | `shadow-lg border-2 border-amber-400` | Active category card |
| **Floating** | `shadow-2xl border border-gray-700` | Toast notifications, modal popups, floating alerts |

---

## 7. Motion & Interaction

- **Duration Token**: Standard micro-interactions run at `150ms` to `200ms` using `ease-in-out`.
- **Hover Transitions**:
  - Links shift smoothly to `text-amber-600`.
  - Cards scale subtly (`scale-[1.02]`) or lift (`-translate-y-1`).
  - Buttons transition between background shades without abrupt jumps.
- **Real-Time Data Feedback**:
  - The countdown timer ticks every 1,000ms with fixed tabular monospace numbers (`font-mono`) to prevent layout jitter.
  - Steppers update total pricing instantly on click.
  - Adding items to cart triggers an animated floating toast notification.

---

## 8. Responsive Behavior

| Breakpoint | Viewport Width | Layout Adaptations |
| :--- | :--- | :--- |
| **Mobile (`< 640px`)** | `< 640px` | 1-column hero stack, 2-column categories, 1-column brands, horizontal scrolling sub-nav |
| **Tablet (`640px - 1024px`)** | `640px - 1023px` | 4-column categories, 2-column brands, stacked Top Saver modules |
| **Desktop (`>= 1024px`)** | `1024px+` | Full 12-column layouts, 8-column categories, 4-column brand grid, 3-column Top Saver split |

---

## 9. Do's and Don'ts (Agent Guardrails)

These explicit guardrails ensure AI agents and contributors do not deviate from the Farmart visual identity:

### ✅ DO:
1. **DO** maintain the warm golden-amber primary color (`#FAB528`) as the signature brand anchor.
2. **DO** use clean white backgrounds (`#FFFFFF`) with subtle hairlines (`#E5E7EB`) for cards.
3. **DO** provide colorful, product-specific pastel container backgrounds (`#F0EDF5`, `#F6F4EC`, `#EDF2F7`, `#E9F2EC`) for merchandising brand cards.
4. **DO** include live interactive functionality (e.g. quantity steppers, ticking countdown, live toast feedback) on transaction-oriented components.
5. **DO** use clear, high-contrast typography hierarchy with bold prices and muted secondary metadata.

### ❌ DON'T:
1. **DON'T** apply generic tech-startup dark mode (`#0F172A` / `#000000` body backgrounds) to grocery catalog pages.
2. **DON'T** replace the warm amber buttons with generic cobalt blue or cold purple buttons.
3. **DON'T** use heavy 4px dark borders or harsh black drop shadows; keep borders at 1px hairline scale.
4. **DON'T** invent random font families; stick to the specified clean sans-serif type hierarchy.
5. **DON'T** use broken or generic image placeholders; use crisp SVG illustrations or vetted product assets.
