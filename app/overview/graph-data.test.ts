import { readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { graphs } from "./graph-data";
import { pages, sharedComponents } from "./overview-data";

describe("project atlas", () => {
  it("covers every application route from the filesystem", () => {
    const routes = readdirSync(path.resolve("app"), { recursive: true })
      .map(String)
      .filter((file) => /(^|\/)page\.tsx$/.test(file))
      .map((file) => `/${path.dirname(file) === "." ? "" : path.dirname(file)}`);
    expect(pages.map((page) => page.path).sort()).toEqual(routes.sort());
    expect(graphs.pages.nodes.filter((node) => node.data.kind === "page").map((node) => node.id).sort())
      .toEqual(pages.map((page) => page.id).sort());
  });

  it("has unique nodes and edges, with no dangling connections in any view", () => {
    for (const graph of Object.values(graphs)) {
      const ids = new Set(graph.nodes.map((node) => node.id));
      expect(ids.size).toBe(graph.nodes.length);
      expect(new Set(graph.edges.map((edge) => edge.id)).size).toBe(graph.edges.length);
      for (const edge of graph.edges) {
        expect(ids.has(edge.source), edge.id).toBe(true);
        expect(ids.has(edge.target), edge.id).toBe(true);
      }
      expect(graph.nodes.some((node) => node.data.preview && node.data.href === "/overview"))
        .toBe(false); // Prevent recursive live previews of the atlas itself.
    }
  });

  it("connects shared components to exactly the pages that use them", () => {
    const expected = pages.flatMap((page) => page.components.map((name) => `${page.id}-${name}`));
    expect(graphs.components.edges.map((edge) => edge.id).sort()).toEqual(expected.sort());
    expect(graphs.components.nodes.filter((node) => node.data.kind === "component").map((node) => node.id).sort())
      .toEqual(sharedComponents.map((component) => component.name).sort());
  });
});
