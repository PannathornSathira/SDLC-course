"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  Background, Controls, Handle, MiniMap, Position, ReactFlow,
  useEdgesState, useNodesState,
  type NodeProps, type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Badge } from "@/app/components/Badge";
import { Breadcrumb } from "@/app/components/Breadcrumb";
import { Dialog } from "@/app/components/Dialog";
import { FreeShippingBar } from "@/app/components/FreeShippingBar";
import { QuantityStepper } from "@/app/components/QuantityStepper";
import { graphs, viewLabels, type AtlasNode, type View } from "./graph-data";
import { flows, pages, products, sharedComponents } from "./overview-data";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-600";

function ScreenNode({ data, selected, width }: NodeProps<AtlasNode>) {
  return (
    <div className={`w-[320px] overflow-hidden rounded-xl border bg-white text-left shadow-sm transition-shadow ${selected ? "border-amber-500 ring-2 ring-amber-200 shadow-lg" : "border-gray-200"}`}>
      <Handle type="target" position={Position.Left} className="bg-amber-500!" />
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest ${data.kind === "component" ? "bg-violet-50 text-violet-700" : data.kind === "action" ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>{data.kind}</span>
          <span className="text-[9px] text-gray-400">DRAG TO MOVE</span>
        </div>
        <h3 className="text-sm font-bold text-gray-900">{data.label}</h3>
        {data.href && <code className="mt-1 block text-[10px] text-gray-500">{data.pageId ? pages.find((page) => page.id === data.pageId)?.path : data.href}</code>}
        {!data.preview && <p className="mt-2 text-[11px] leading-5 text-gray-500">{data.description}</p>}
      </div>
      {data.preview && data.href && (
        <div className="pointer-events-none relative h-[180px] overflow-hidden border-t border-gray-100 bg-gray-50">
          {width ? <iframe src={data.href} title={`${data.label} thumbnail`} tabIndex={-1} className="absolute left-0 top-0 h-[720px] w-[1280px] origin-top-left scale-25 border-0" /> : <p className="p-4 text-xs text-gray-400">Loading live preview…</p>}
        </div>
      )}
      <Handle type="source" position={Position.Right} className="bg-amber-500!" />
    </div>
  );
}

const nodeTypes = { atlas: ScreenNode };

function ComponentDemo({ name }: { name: string }) {
  const [quantity, setQuantity] = useState(2);
  const [amount, setAmount] = useState(64.5);
  const [open, setOpen] = useState(false);

  if (name === "Badge") return <div className="flex flex-wrap gap-2"><Badge variant="save">Save 15%</Badge><Badge variant="instock">In Stock</Badge><Badge variant="organic">Organic</Badge></div>;
  if (name === "QuantityStepper") return <div className="space-y-3"><QuantityStepper value={quantity} onChange={setQuantity} /><p className="text-xs text-gray-500">Selected quantity: {quantity}</p></div>;
  if (name === "FreeShippingBar") return <div className="space-y-4"><FreeShippingBar currentAmount={amount} /><label className="block text-xs font-semibold">Cart amount: ${amount.toFixed(2)}<input aria-label="Demo cart amount" type="range" min="0" max="150" step="0.5" value={amount} onChange={(event) => setAmount(Number(event.target.value))} className="mt-3 block w-full accent-amber-500" /></label></div>;
  if (name === "Breadcrumb") return <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Overview", href: "/overview" }, { label: "Component preview" }]} />;
  return <><button onClick={() => setOpen(true)} className={`rounded-lg bg-[#fab528] px-4 py-2 text-xs font-bold ${focus}`}>Open real Dialog component</button><Dialog isOpen={open} onClose={() => setOpen(false)} title="Shared Dialog preview" description="This is the same component used by the product and design pages."><p className="text-sm text-gray-600">Dismiss with Escape, the backdrop, or the close button.</p></Dialog></>;
}

export default function OverviewFlow() {
  const [mode, setMode] = useState<View>("pages");
  const [nodes, setNodes, onNodesChange] = useNodesState<AtlasNode>(graphs.pages.nodes.map((node) => ({ ...node, selected: node.id === "storefront" })));
  const [edges, setEdges, onEdgesChange] = useEdgesState(graphs.pages.edges);
  const [selectedId, setSelectedId] = useState("storefront");
  const [connection, setConnection] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [reset, setReset] = useState(0);
  const [live, setLive] = useState(false);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [productId, setProductId] = useState(products[0].id);
  const instance = useRef<ReactFlowInstance<AtlasNode> | null>(null);
  const selected = nodes.find((node) => node.id === selectedId) ?? nodes[0];
  const page = pages.find((entry) => entry.id === selected.data.pageId);
  const previewHref = page?.id === "product-detail" ? `/product/${productId}` : selected.data.href;
  const canPreview = !!previewHref && selected.data.kind !== "external" && selected.id !== "overview";
  const connections = edges.filter((edge) => edge.source === selected.id || edge.target === selected.id);

  function selectNode(id: string, fit = false) {
    setSelectedId(id);
    setConnection(null);
    setLive(false);
    setNodes((current) => current.map((node) => ({ ...node, selected: node.id === id })));
    if (fit) void instance.current?.fitView({ nodes: [{ id }], padding: 0.5, maxZoom: 1, duration: 300 });
  }

  function changeView(view: View, selection = "storefront") {
    setMode(view);
    setNodes(graphs[view].nodes.map((node) => ({ ...node, selected: node.id === selection })));
    setEdges(graphs[view].edges);
    setSelectedId(selection);
    setQuery("");
    setConnection(null);
    setLive(false);
    setReset((value) => value + 1);
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] text-gray-900">
      <header className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4"><Link href="/" className={`text-2xl font-black tracking-tight ${focus}`}>Farmart<span className="text-amber-500">.</span></Link><span className="h-6 border-l border-gray-200" /><div><h1 className="text-sm font-bold">Project overview</h1><p className="mt-0.5 text-[10px] text-gray-500">Interactive UI atlas · Powered by React Flow</p></div></div>
          <div className="flex flex-wrap items-center gap-3 text-xs"><span><strong>{pages.length}</strong> routes</span><span className="text-gray-300">/</span><span><strong>{pages.length - 1 + products.length}</strong> URLs</span><span className="text-gray-300">/</span><span><strong>{sharedComponents.length}</strong> components</span><Link href="/" className={`rounded-lg bg-[#fab528] px-3 py-2 font-bold ${focus}`}>Open storefront ↗</Link></div>
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div role="group" aria-label="Graph view" className="flex flex-wrap gap-1 rounded-lg bg-gray-100 p-1">{(Object.keys(viewLabels) as View[]).map((view) => <button key={view} onClick={() => changeView(view)} aria-pressed={mode === view} className={`rounded-md px-3 py-2 text-xs font-semibold transition ${mode === view ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"} ${focus}`}>{viewLabels[view]}</button>)}</div>
        <div className="flex gap-2"><button onClick={() => void instance.current?.fitView({ padding: 0.12, duration: 300 })} className={`rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold hover:bg-gray-50 ${focus}`}>Fit map</button><button onClick={() => changeView(mode)} className={`rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold hover:bg-gray-50 ${focus}`}>Reset layout</button></div>
      </div>

      <main className="grid min-h-0 lg:h-[calc(100dvh-139px)] lg:min-h-[650px] lg:grid-cols-[minmax(0,1fr)_350px]">
        <section aria-label={`${viewLabels[mode]} interactive canvas`} className="relative h-[65dvh] min-h-[480px] overflow-hidden border-b border-gray-200 lg:h-full lg:border-b-0 lg:border-r">
          <ReactFlow<AtlasNode>
            key={`${mode}-${reset}`}
            nodes={nodes}
            edges={edges.map((edge) => ({ ...edge, animated: edge.source === selectedId, style: { ...edge.style, opacity: edge.source === selectedId || edge.target === selectedId ? 1 : 0.18 }, label: edge.source === selectedId || edge.target === selectedId ? edge.label : undefined }))}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onInit={(flow) => { instance.current = flow; }}
            onNodeClick={(_, node) => selectNode(node.id)}
            onEdgeClick={(_, edge) => { selectNode(edge.target); setConnection(`${nodes.find((node) => node.id === edge.source)?.data.label} → ${nodes.find((node) => node.id === edge.target)?.data.label}: ${String(edge.label ?? "connection")}`); }}
            fitView
            fitViewOptions={{ padding: 0.12, maxZoom: 0.85 }}
            minZoom={0.15}
            maxZoom={1.7}
            nodesConnectable={false}
            edgesReconnectable={false}
            deleteKeyCode={null}
            colorMode="light"
          >
            <Background color="#d6d3cb" gap={22} size={1} />
            <Controls showInteractive={false} />
            <MiniMap pannable zoomable nodeColor={(node) => node.data.kind === "component" ? "#c4b5fd" : node.data.kind === "action" ? "#a7f3d0" : "#fcd34d"} className="hidden sm:block" />
          </ReactFlow>
          <div className="pointer-events-none absolute left-4 top-4 max-w-[230px] rounded-xl border border-gray-200 bg-white/95 p-3 shadow-sm"><p className="text-[10px] font-bold uppercase tracking-wider text-amber-800">{viewLabels[mode]}</p><p className="mt-1 text-[11px] leading-5 text-gray-500">Drag cards to rearrange. Drag the canvas to pan. Scroll to zoom. Select a node or line to inspect.</p></div>
        </section>

        <aside aria-label="Node inspector" className="min-w-0 overflow-y-auto bg-white">
          <div className="border-b border-gray-100 p-5">
            <label htmlFor="find-node" className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Find a screen or component</label>
            <input id="find-node" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search this map…" className={`mt-2 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs ${focus}`} />
            <div className="mt-3 flex max-h-36 flex-wrap gap-1.5 overflow-y-auto">{nodes.filter((node) => `${node.data.label} ${node.data.href ?? ""}`.toLowerCase().includes(query.toLowerCase())).map((node) => <button key={node.id} aria-pressed={selectedId === node.id} onClick={() => selectNode(node.id, true)} className={`rounded-md border px-2 py-1.5 text-[11px] ${selectedId === node.id ? "border-amber-300 bg-amber-50 font-bold text-amber-900" : "border-gray-200 text-gray-500 hover:border-amber-300"} ${focus}`}>{node.data.label}</button>)}{!nodes.some((node) => `${node.data.label} ${node.data.href ?? ""}`.toLowerCase().includes(query.toLowerCase())) && <p className="text-xs text-gray-500">No nodes match this search.</p>}</div>
          </div>

          <div className="space-y-5 p-5" aria-live="polite">
            <div><p className="text-[10px] font-bold uppercase tracking-widest text-amber-800">Selected {selected.data.kind}</p><h2 className="mt-2 text-xl font-bold tracking-tight">{selected.data.label}</h2>{page && <code className="mt-1 block text-xs text-gray-500">{page.path}</code>}<p className="mt-3 text-xs leading-6 text-gray-600">{selected.data.description}</p></div>
            {connection && <p className="rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-900">{connection}</p>}
            {selected.id === "overview" && <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Overview" }]} />}
            {page?.id === "product-detail" && <label className="block text-xs font-semibold">Product variant<select aria-label="Product variant" value={productId} onChange={(event) => setProductId(event.target.value)} className="mt-2 block w-full rounded-lg border border-gray-200 p-2 text-xs">{products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select></label>}
            {previewHref && <div className="flex flex-wrap gap-2">{canPreview && <button onClick={() => setLive(true)} className={`rounded-lg bg-[#fab528] px-3 py-2.5 text-xs font-bold ${focus}`}>Interact with live page</button>}<a href={previewHref} target="_blank" rel="noopener noreferrer" className={`rounded-lg border border-gray-200 px-3 py-2.5 text-xs font-semibold hover:bg-gray-50 ${focus}`}>Open page ↗</a></div>}
            {selected.data.kind === "component" && <div className="rounded-xl border border-gray-200 bg-gray-50 p-4"><p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Real component · Try it</p><ComponentDemo key={selected.id} name={selected.id} /></div>}
            {page && <div><h3 className="text-xs font-bold">UI on this page</h3><ul className="mt-3 space-y-2 text-xs leading-5 text-gray-500">{page.modules.map((module) => <li key={module} className="flex gap-2"><span className="text-amber-500">•</span>{module}</li>)}</ul>{page.components.length > 0 && <div className="mt-3 flex flex-wrap gap-1">{page.components.map((name) => <button key={name} onClick={() => { changeView("components", name); }} className={`rounded-md bg-violet-50 px-2 py-1 text-[10px] font-semibold text-violet-700 ${focus}`}>{name} ↗</button>)}</div>}<code className="mt-3 block break-all text-[10px] text-gray-400">{page.source}</code></div>}
            <div><h3 className="text-xs font-bold">Connected to · {connections.length}</h3><ul className="mt-2 space-y-1">{connections.map((edge) => { const other = nodes.find((node) => node.id === (edge.source === selected.id ? edge.target : edge.source)); return <li key={edge.id}><button onClick={() => other && selectNode(other.id, true)} className={`w-full rounded-lg px-2 py-2 text-left text-xs text-gray-500 hover:bg-amber-50 ${focus}`}><span className="font-semibold text-gray-800">{edge.source === selected.id ? "→" : "←"} {other?.data.label}</span><span className="mt-1 block pl-4 text-[10px]">{String(edge.label)}</span></button></li>; })}</ul>{connections.length === 0 && <p className="mt-2 text-xs leading-5 text-gray-500">No shared-component connections. The storefront currently implements its controls inline.</p>}</div>
            {mode === "flows" && <details className="rounded-lg border border-gray-200 p-3"><summary className="cursor-pointer text-xs font-semibold">Other interactions in the project</summary><div className="mt-3 space-y-3">{flows.map((flow) => <div key={flow.title}><h3 className="text-xs font-bold">{flow.title}</h3><p className="mt-1 text-[11px] leading-5 text-gray-500">{flow.detail}</p></div>)}</div></details>}
            <p className="border-t border-gray-100 pt-4 text-[10px] leading-5 text-gray-400">{mode === "components" ? "Dashed purple edges show shared component usage." : "Arrows show real navigation or on-page actions."} Cart, coupon, and review actions are local demos. Storybook runs separately on port 6006. Layout changes last until reset or reload.</p>
          </div>
        </aside>
      </main>

      <Dialog isOpen={live && canPreview} onClose={() => setLive(false)} title={`${selected.data.label} · Live UI`} description="Use the real page here, or open it in a separate tab." maxWidth="xl">
        <div className="mb-3 flex items-center justify-between gap-2"><div className="flex gap-2">{(["desktop", "mobile"] as const).map((value) => <button key={value} aria-pressed={device === value} onClick={() => setDevice(value)} className={`rounded-lg px-3 py-2 text-xs font-bold ${device === value ? "bg-amber-100 text-amber-900" : "bg-gray-100 text-gray-500"} ${focus}`}>{value === "desktop" ? "Responsive" : "Mobile · 390px"}</button>)}</div><a href={previewHref} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-amber-800">Open ↗</a></div>
        {live && canPreview && <div className="overflow-x-auto rounded-xl border border-gray-200 bg-gray-100"><iframe key={previewHref} title={`${selected.data.label} interactive preview`} src={previewHref} className={`mx-auto h-[62dvh] min-h-[360px] border-0 bg-white ${device === "mobile" ? "w-[390px]" : "w-full"}`} /></div>}
      </Dialog>
    </div>
  );
}
