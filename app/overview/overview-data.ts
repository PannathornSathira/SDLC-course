import { DEFAULT_PRODUCT_ID, PRODUCTS } from "@/app/data/products";

export const products = Object.values(PRODUCTS);
export const productHref = `/product/${DEFAULT_PRODUCT_ID}`;
export const sharedComponents = [
  { name: "Badge", description: "Deals, savings, stock status, and quality labels." },
  { name: "QuantityStepper", description: "Quantity controls with bounds, sizes, and disabled states." },
  { name: "FreeShippingBar", description: "Live progress toward the $99 free-shipping threshold." },
  { name: "Breadcrumb", description: "Navigation back to the storefront and category context." },
  { name: "Dialog", description: "Coupon and review dialogs, plus design showcase demos." },
];

export const pages = [
  {
    id: "storefront", title: "Storefront", path: "/", href: "/", label: "Shopping entry",
    description: "Browse grocery categories, featured brands, and today’s deals.",
    source: "app/page.tsx",
    modules: ["Header & category selector", "Promotional banners", "Category & brand cards", "Deal cards & countdown", "Member signup & toast feedback"],
    components: [],
    links: [{ label: "Product details", href: productHref }, { label: "Design system", href: "/design" }, { label: "Overview", href: "/overview" }],
  },
  {
    id: "default-product", title: "Default product", path: "/product", href: "/product", label: "Convenience entry",
    description: "Renders the Ice Gold’s Beer detail view using the default product ID.",
    source: "app/product/page.tsx",
    modules: ["Reuses the product detail page", "Default product: ice-golds-beer"],
    components: sharedComponents.map((component) => component.name),
    links: [{ label: "Storefront", href: "/" }, { label: "Related products", href: productHref }, { label: "Design system", href: "/design" }, { label: "Overview", href: "/overview" }],
  },
  {
    id: "product-detail", title: "Product detail", path: "/product/[id]", href: productHref, label: "4 product views",
    description: "One template presents each product’s pricing, options, and information.",
    source: "app/product/[id]/page.tsx",
    modules: ["Product gallery & badges", "Pack selector & quantity", "Shipping progress & cart feedback", "Description, nutrition, reviews & shipping tabs", "Coupon & review dialogs", "Related products & sticky cart bar"],
    components: sharedComponents.map((component) => component.name),
    links: [{ label: "Storefront", href: "/" }, { label: "Another product", href: "/product/british-beef-mince" }, { label: "Design system", href: "/design" }, { label: "Overview", href: "/overview" }],
  },
  {
    id: "design", title: "Design system", path: "/design", href: "/design", label: "UI reference",
    description: "Explore visual tokens and interactive examples of the storefront UI.",
    source: "app/design/page.tsx",
    modules: ["Colors & typography", "Spacing, radius & layout", "Buttons, cards & dialogs", "Product component demos", "Elevation & motion guidance"],
    components: sharedComponents.map((component) => component.name),
    links: [{ label: "Storefront", href: "/" }, { label: "Default product", href: "/product" }, { label: "Product details", href: productHref }, { label: "Overview", href: "/overview" }],
  },
  {
    id: "overview", title: "Project overview", path: "/overview", href: "/overview", label: "You are here",
    description: "A connected index of routes, screen sections, and reusable components.",
    source: "app/overview/page.tsx",
    modules: ["Navigation map", "Page inventory", "Interaction flows", "Component usage & product URLs"],
    components: ["Breadcrumb"],
    links: [{ label: "Storefront", href: "/" }, { label: "Default product", href: "/product" }, { label: "Product details", href: productHref }, { label: "Design system", href: "/design" }],
  },
];

export const flows = [
  { title: "Browse & select", kind: "Page navigation", steps: ["Storefront", "Product title", "Product detail", "Related product"], detail: "Product titles open one of four detail URLs. Breadcrumbs and the logo return to the storefront.", href: "/", action: "Start browsing" },
  { title: "Storefront demo controls", kind: "On-page state", steps: ["Category / banner / brand", "Selection or click", "Local feedback"], detail: "The search category dropdown changes its label. Category cards update selection; banner and brand buttons show toasts. These actions do not open category or search-result pages.", href: "/", action: "Try storefront controls" },
  { title: "Wishlist & member signup", kind: "On-page state", steps: ["Wishlist or signup", "Count update / form submit", "Demo feedback"], detail: "Storefront wishlist buttons update the local count. Product wishlist toggles its selected state. The member form shows a success toast; no account is created.", href: "/", action: "View storefront actions" },
  { title: "Configure & add", kind: "On-page state", steps: ["Product detail", "Pack & quantity", "Add to Cart", "Cart totals & toast"], detail: "Quantity changes update pricing and shipping progress. Cart feedback is local to the current page; no cart or checkout route exists.", href: productHref, action: "Explore a product" },
  { title: "Coupons & reviews", kind: "On-page dialogs", steps: ["Product detail", "Coupon or review", "Dialog", "Confirmation toast"], detail: "Claim a coupon or open the Reviews tab to write a review. Submitting closes the dialog and shows demo feedback.", href: productHref, action: "Open product interactions" },
  { title: "Inspect product information", kind: "On-page state", steps: ["Product detail", "Gallery / pack / tab", "Selected view"], detail: "Gallery thumbnails and pack buttons change selection. Description, nutrition, reviews, and shipping tabs swap the information panel without navigating to another route.", href: productHref, action: "Inspect product details" },
  { title: "Explore the UI library", kind: "Reference navigation", steps: ["Design system", "Component demos", "Product examples / Storybook"], detail: "The showcase links to live product pages and the separate Storybook explorer. Storybook requires its own development server on port 6006.", href: "/design", action: "Explore design system" },
  { title: "Try design-system demos", kind: "On-page demos", steps: ["Section tab", "Token or component", "Preview / dialog / feedback"], detail: "Section tabs filter the showcase. Token cards copy values; typography input updates its preview. Quantity and shipping controls update live examples, while dialog buttons open confirmation, quick-view, and offer demos.", href: "/design", action: "Try component demos" },
];

