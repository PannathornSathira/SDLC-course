import { MarkerType, type Edge, type Node } from "@xyflow/react";
import { pages, productHref, sharedComponents } from "./overview-data";

export type View = "pages" | "components" | "flows";
export type AtlasNode = Node<{
  label: string;
  kind: "page" | "component" | "action" | "external";
  description: string;
  pageId?: string;
  href?: string;
  preview?: boolean;
}, "atlas">;

function edge(source: string, target: string, label: string, component = false): Edge {
  return {
    id: `${source}-${target}`,
    source,
    target,
    label,
    type: "smoothstep",
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: component ? "#8b5cf6" : "#b77914", strokeWidth: 1.6, strokeDasharray: component ? "6 4" : undefined },
    labelStyle: { fontSize: 10, fill: "#475569" },
    labelBgStyle: { fill: "#faf9f6", fillOpacity: 0.95 },
    labelBgPadding: [6, 3],
    labelBgBorderRadius: 4,
  };
}

const positions = [
  { x: 0, y: 330 },
  { x: 490, y: 0 },
  { x: 490, y: 330 },
  { x: 980, y: 330 },
  { x: 0, y: 0 },
];

const pageNodes: AtlasNode[] = pages.map((page, i) => ({
  id: page.id,
  type: "atlas",
  position: positions[i],
  data: { label: page.title, kind: "page", pageId: page.id, href: page.href, description: page.description, preview: page.id !== "overview" },
}));

const navigationEdges = pages.flatMap((page) => page.links.flatMap((link) => {
  const target = pages.find((candidate) => candidate.href === link.href)
    ?? (link.href.startsWith("/product/") ? pages.find((candidate) => candidate.id === "product-detail") : undefined);
  return target ? [edge(page.id, target.id, link.label)] : [];
}));

const storybook: AtlasNode = {
  id: "storybook", type: "atlas", position: { x: 980, y: 0 },
  data: { label: "Storybook", kind: "external", href: "http://localhost:6006", description: "Separate component explorer. Start it with npm run storybook; it is not an application page." },
};

export const graphs: Record<View, { nodes: AtlasNode[]; edges: Edge[] }> = {
  pages: {
    nodes: [...pageNodes, storybook],
    edges: [...navigationEdges, edge("design", "storybook", "Component explorer"), edge("product-detail", "storybook", "Footer link"), edge("default-product", "storybook", "Footer link")],
  },
  components: {
    nodes: [
      ...pageNodes.map((node, i) => ({ ...node, position: { x: 0, y: i * 170 }, data: { ...node.data, preview: false } })),
      ...sharedComponents.map((component, i): AtlasNode => ({
        id: component.name, type: "atlas", position: { x: 650, y: i * 170 },
        data: { label: component.name, kind: "component", description: component.description },
      })),
    ],
    edges: pages.flatMap((page) => page.components.map((name) => edge(page.id, name, "uses", true))),
  },
  flows: {
    nodes: [
      { ...pageNodes[0], position: { x: 0, y: 280 } },
      { ...pageNodes[2], position: { x: 470, y: 280 } },
      ...[
        ["configure", "Pack & quantity", "Choose a pack and change quantity. Quantity updates pricing and shipping progress.", 940, 0],
        ["cart", "Add to cart", "Updates local cart totals and shows a toast. There is no checkout page.", 1390, 0],
        ["reviews", "Reviews tab", "Switch to Reviews, then open the review form.", 940, 290],
        ["review-dialog", "Write a review", "Dialog collects name and comment. Submit closes the dialog and shows demo confirmation.", 1390, 290],
        ["coupon", "Claim coupon", "Open the member voucher dialog from the product page.", 940, 580],
        ["coupon-dialog", "Apply voucher", "Coupon dialog shows FARMARTNEW15. Apply closes it and shows feedback.", 1390, 580],
      ].map(([id, label, description, x, y]): AtlasNode => ({
        id: String(id), type: "atlas", position: { x: Number(x), y: Number(y) },
        data: { label: String(label), kind: "action", description: String(description), href: productHref },
      })),
    ],
    edges: [
      edge("storefront", "product-detail", "Click product title"),
      edge("product-detail", "configure", "Select options"),
      edge("configure", "cart", "Add to Cart → toast"),
      edge("product-detail", "reviews", "Open Reviews tab"),
      edge("reviews", "review-dialog", "Write a review → submit"),
      edge("product-detail", "coupon", "Claim Coupon"),
      edge("coupon", "coupon-dialog", "Open → apply → toast"),
    ],
  },
};

export const viewLabels: Record<View, string> = {
  pages: "Page navigation",
  components: "Shared components",
  flows: "Shopping UI flow",
};
