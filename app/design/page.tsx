"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Dialog } from "../components/Dialog";
import { Badge } from "../components/Badge";
import { QuantityStepper } from "../components/QuantityStepper";
import { FreeShippingBar } from "../components/FreeShippingBar";
import { Breadcrumb } from "../components/Breadcrumb";

export default function DesignSystemPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [stepperQty, setStepperQty] = useState(1);
  const [selectedDemoCat, setSelectedDemoCat] = useState("Breads & Sweets");
  const [typographySample, setTypographySample] = useState(
    "Active Summer With Juice Milk 300ml"
  );
  const [countdown, setCountdown] = useState({ h: 5, m: 25, s: 37 });

  // Product Detail Components State
  const [stepperDemoSm, setStepperDemoSm] = useState(1);
  const [stepperDemoMd, setStepperDemoMd] = useState(2);
  const [stepperDemoLg, setStepperDemoLg] = useState(4);
  const [shippingSimAmount, setShippingSimAmount] = useState(64.5);

  // Dialog demonstration states
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [quickViewQty, setQuickViewQty] = useState(1);

  // Ticking countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: 59, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedToken(`${label} copied!`);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const colorGroups = [
    {
      title: "Primary Brand Tokens",
      description: "Signature golden-amber anchor driving all primary visual energy and CTAs",
      colors: [
        { name: "primary", hex: "#FAB528", role: "Main brand color, CTAs, icons", textDark: true },
        { name: "primary-hover", hex: "#E5A420", role: "Hover state for primary actions", textDark: true },
        { name: "primary-active", hex: "#C98F16", role: "Active/pressed primary state", textDark: false },
        { name: "primary-subtle", hex: "#FEF3C7", role: "Highlight tint for selected cards", textDark: true },
        { name: "on-primary", hex: "#111827", role: "High-contrast text on primary", textDark: false },
      ],
    },
    {
      title: "Accents & Semantics",
      description: "High-visibility signals for discounts, urgency, ratings, and fresh status",
      colors: [
        { name: "accent-deal", hex: "#E05638", role: "Timer badge, urgent flash discounts", textDark: false },
        { name: "accent-save", hex: "#FF4D4F", role: "Discount percentage badges ('Save 15%')", textDark: false },
        { name: "accent-rating", hex: "#F59E0B", role: "5-star customer review rating stars", textDark: false },
        { name: "accent-success", hex: "#22C55E", role: "Stock status & organic leaf accents", textDark: false },
      ],
    },
    {
      title: "Ink & Typography",
      description: "Structured high-contrast scales for deep legibility",
      colors: [
        { name: "ink-strong", hex: "#030712", role: "Hero titles, brand names", textDark: false },
        { name: "ink", hex: "#0F172A", role: "Standard headings, product names, prices", textDark: false },
        { name: "body", hex: "#374151", role: "Default body copy, descriptions", textDark: false },
        { name: "body-muted", hex: "#6B7280", role: "Secondary metadata, tags, breadcrumbs", textDark: false },
        { name: "body-subtle", hex: "#9CA3AF", role: "Input placeholders, inactive indicators", textDark: false },
      ],
    },
    {
      title: "Pastel Merchandising Surfaces",
      description: "Tailored category background tints preventing product visual monotony",
      colors: [
        { name: "surface-brand-purple", hex: "#F0EDF5", role: "Snacks & confectionery packaging", textDark: true },
        { name: "surface-brand-tea", hex: "#F6F4EC", role: "Organic tea & grains containers", textDark: true },
        { name: "surface-brand-blue", hex: "#EDF2F7", role: "Chilled beverages & canned sodas", textDark: true },
        { name: "surface-brand-mint", hex: "#E9F2EC", role: "Butcher, sausages & fresh produce", textDark: true },
        { name: "surface-hero-main", hex: "#EBF1F5", role: "Summer hero banner cool surface", textDark: true },
        { name: "surface-signup", hex: "#FFF8F2", role: "Membership 15% OFF card warm cream", textDark: true },
      ],
    },
    {
      title: "Canvas & Hairline Borders",
      description: "Fresh white canvas foundation and crisp 1px hairline structural dividers",
      colors: [
        { name: "canvas", hex: "#FFFFFF", role: "Main base canvas, white product cards", textDark: true, border: true },
        { name: "canvas-subtle", hex: "#F9FAFB", role: "Subtle section contrast, footer base", textDark: true, border: true },
        { name: "hairline", hex: "#E5E7EB", role: "Standard card borders, input borders", textDark: true },
        { name: "hairline-soft", hex: "#F3F4F6", role: "Subtle internal card dividers", textDark: true },
      ],
    },
  ];

  const typographyTokens = [
    {
      token: "display-hero",
      size: "36px",
      weight: "800 (Extrabold)",
      lineHeight: "1.15",
      tracking: "-0.02em",
      role: "Hero banner primary headline",
      previewClass: "text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight",
    },
    {
      token: "display-promo",
      size: "28px",
      weight: "900 (Black)",
      lineHeight: "1.10",
      tracking: "-0.01em",
      role: "Promo sale banner headings ('20% SALE OFF')",
      previewClass: "text-2xl sm:text-3xl font-black tracking-tight leading-none",
    },
    {
      token: "heading-section",
      size: "20px",
      weight: "700 (Bold)",
      lineHeight: "1.30",
      tracking: "-0.01em",
      role: "Section titles ('Browse by Category', 'Top Saver Today')",
      previewClass: "text-xl font-bold tracking-tight",
    },
    {
      token: "title-card",
      size: "14px",
      weight: "600 (Semibold)",
      lineHeight: "1.35",
      tracking: "0.00em",
      role: "Product names, brand card titles",
      previewClass: "text-sm font-semibold",
    },
    {
      token: "body-regular",
      size: "14px",
      weight: "400 (Regular)",
      lineHeight: "1.50",
      tracking: "0.00em",
      role: "Standard descriptive paragraphs and guidance copy",
      previewClass: "text-sm font-normal text-gray-600",
    },
    {
      token: "caption",
      size: "12px",
      weight: "500 (Medium)",
      lineHeight: "1.40",
      tracking: "0.00em",
      role: "Navigation links, stock progress, buttons, inputs",
      previewClass: "text-xs font-medium",
    },
    {
      token: "tag-uppercase",
      size: "10px",
      weight: "700 (Bold)",
      lineHeight: "1.20",
      tracking: "+0.08em",
      role: "Brand identifiers (e.g. 'FOODPOUCH', 'TEA 365')",
      previewClass: "text-[10px] font-bold tracking-wider uppercase text-gray-400",
    },
    {
      token: "countdown",
      size: "12px",
      weight: "700 (Bold Monospace)",
      lineHeight: "1.00",
      tracking: "+0.05em",
      role: "Real-time ticking deal countdown clocks",
      previewClass: "font-mono text-xs font-bold tracking-wider",
    },
  ];

  const spacingTokens = [
    { token: "xxs", val: "4px", previewClass: "w-1", rem: "0.25rem", role: "Micro gaps, icon offsets" },
    { token: "xs", val: "8px", previewClass: "w-2", rem: "0.5rem", role: "Badge padding, tight card margins" },
    { token: "sm", val: "12px", previewClass: "w-3", rem: "0.75rem", role: "Input padding, tag spacing" },
    { token: "base", val: "16px", previewClass: "w-4", rem: "1.0rem", role: "Standard card padding, component gaps" },
    { token: "md", val: "20px", previewClass: "w-5", rem: "1.25rem", role: "Deal card padding, header heights" },
    { token: "lg", val: "24px", previewClass: "w-6", rem: "1.5rem", role: "Container gutters, large card padding" },
    { token: "xl", val: "32px", previewClass: "w-8", rem: "2.0rem", role: "Hero banner vertical spacing" },
    { token: "xxl", val: "48px", previewClass: "w-12", rem: "3.0rem", role: "Section gutters" },
    { token: "section", val: "40-64px", previewClass: "w-[100px]", rem: "2.5-4.0rem", role: "Spacing between main page sections" },
  ];

  const radiusTokens = [
    { token: "rounded.xs", val: "4px", previewClass: "rounded-sm", role: "Badges, category dropdown trigger, stepper" },
    { token: "rounded.sm", val: "6px", previewClass: "rounded-md", role: "Standard form inputs, compact buttons" },
    { token: "rounded.md", val: "8px", previewClass: "rounded-lg", role: "Action buttons, search container" },
    { token: "rounded.lg", val: "12px", previewClass: "rounded-xl", role: "Card corners, toast notifications" },
    { token: "rounded.xl", val: "16px", previewClass: "rounded-2xl", role: "Category cards, product deal cards" },
    { token: "rounded.xxl", val: "24px", previewClass: "rounded-3xl", role: "Hero banner corners" },
    { token: "rounded.pill", val: "9999px", previewClass: "rounded-full", role: "Shop Now buttons, counter badges" },
  ];

  const navTabs = [
    { id: "all", label: "All Sections" },
    { id: "overview", label: "1. Theme" },
    { id: "colors", label: "2. Colors" },
    { id: "typography", label: "3. Typography" },
    { id: "spacing", label: "4. Spacing & Grid" },
    { id: "components", label: "5. Components" },
    { id: "elevation", label: "6. Elevation" },
    { id: "motion", label: "7. Motion" },
    { id: "guardrails", label: "9. Do's & Don'ts" },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 selection:bg-amber-100 selection:text-amber-900 font-sans pb-24">
      {/* Toast Notification */}
      {copiedToken && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2 border border-gray-700 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-[#fab528]"></span>
          <span>{copiedToken}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="group flex items-center gap-1.5 text-xs text-gray-500 hover:text-amber-600 transition-colors mr-3"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Store</span>
            </Link>

            <div className="h-5 w-px bg-gray-200"></div>

            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-gray-950">Farmart</span>
              <span className="w-2 h-2 rounded-full bg-[#fab528] mb-1"></span>
              <span className="bg-amber-100 text-amber-900 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ml-1">
                DESIGN.md Spec v1.0.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://getdesign.md/what-is-design-md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1 underline hidden md:inline"
            >
              getdesign.md Spec ↗
            </a>
            <a
              href="http://localhost:6006"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 font-bold px-3 py-1.5 rounded-md text-xs transition shadow-xs flex items-center gap-1.5"
              title="Storybook runs on port 6006"
            >
              <span>📕</span>
              <span>Storybook</span>
            </a>
            <Link
              href="/"
              className="bg-[#fab528] hover:bg-[#e5a420] text-gray-950 font-bold px-4 py-1.5 rounded-md text-xs transition shadow-xs"
            >
              View Live Store
            </Link>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto py-2 border-t border-gray-100 text-xs">
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-md font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:text-gray-950 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* HERO SYSTEM BANNER */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border-b border-amber-200/50 py-10 px-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase font-mono font-bold tracking-widest text-amber-700">
                  DESIGN SYSTEM SPECIFICATION
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-xs text-gray-500">According to getdesign.md standard</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
                Farmart Design System & Visual Language
              </h1>
              <p className="mt-2 text-sm text-gray-600 max-w-2xl leading-relaxed">
                This interactive design catalog showcases every token, component, typographic rule,
                and agent guardrail established in <code className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded text-xs font-mono">lab3/DESIGN.md</code>.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs text-center min-w-[120px]">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Core Tokens</p>
                <p className="text-xl font-black text-gray-900 mt-0.5">24+</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs text-center min-w-[120px]">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Components</p>
                <p className="text-xl font-black text-amber-600 mt-0.5">12 Live</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs text-center min-w-[120px]">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Spec Format</p>
                <p className="text-xl font-black text-gray-900 mt-0.5">9 Sections</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {/* 1. VISUAL THEME & ATMOSPHERE */}
        {(activeTab === "all" || activeTab === "overview") && (
          <section id="overview" className="space-y-6">
            <div className="flex items-baseline justify-between border-b border-gray-200 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-amber-600 uppercase">Section 01</span>
                <h2 className="text-2xl font-bold text-gray-950 tracking-tight">Visual Theme & Atmosphere</h2>
              </div>
              <span className="text-xs text-gray-500 font-mono">Brand Philosophy</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 text-lg mb-4">
                  ☀️
                </div>
                <h3 className="text-base font-bold text-gray-900">Sunlit Freshness</h3>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  Food and grocery e-commerce thrives on cleanliness, vitality, and appetite appeal.
                  We avoid gloomy, dark backgrounds in favor of bright white canvases illuminated by warm golden sun.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700 text-lg mb-4">
                  🎨
                </div>
                <h3 className="text-base font-bold text-gray-900">Curated Pastel Surfaces</h3>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  Each product category enjoys a unique, pastel packaging container (lilac for snacks, wheat for tea,
                  slate for drinks, mint for meats) creating delightful visual rhythm without garish clashing.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 text-lg mb-4">
                  ⚡
                </div>
                <h3 className="text-base font-bold text-gray-900">High-Density Usability</h3>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  Combines quick-action category navigation, real-time quantity steppers, dynamic price recalculation,
                  and ticking urgency badges into a reliable, friction-free purchasing flow.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* 2. COLOR PALETTE & ROLES */}
        {(activeTab === "all" || activeTab === "colors") && (
          <section id="colors" className="space-y-8">
            <div className="flex items-baseline justify-between border-b border-gray-200 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-amber-600 uppercase">Section 02</span>
                <h2 className="text-2xl font-bold text-gray-950 tracking-tight">Color Palette & Semantic Roles</h2>
              </div>
              <span className="text-xs text-gray-400">Click any card to copy HEX code</span>
            </div>

            <div className="space-y-8">
              {colorGroups.map((group, idx) => (
                <div key={idx} className="space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{group.title}</h3>
                    <p className="text-xs text-gray-500">{group.description}</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                    {group.colors.map((c) => (
                      <div
                        key={c.name}
                        onClick={() => copyToClipboard(c.hex, c.name)}
                        className={`group bg-white rounded-xl p-3 border cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                          c.border ? "border-gray-300" : "border-gray-200"
                        }`}
                      >
                        {/* Swatch */}
                        <div
                          className="h-16 w-full rounded-lg mb-3 flex items-center justify-center font-mono text-[11px] font-bold shadow-inner relative overflow-hidden"
                          style={{
                            backgroundColor: c.hex,
                            color: c.textDark ? "#111827" : "#FFFFFF",
                            border: c.hex === "#FFFFFF" ? "1px solid #E5E7EB" : "none",
                          }}
                        >
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white px-2 py-0.5 rounded text-[10px]">
                            Copy Hex
                          </span>
                        </div>

                        {/* Metadata */}
                        <div>
                          <p className="text-xs font-bold text-gray-900 font-mono tracking-tight">{c.name}</p>
                          <p className="text-[11px] font-mono text-gray-500 uppercase">{c.hex}</p>
                          <p className="text-[11px] text-gray-500 mt-1 leading-snug line-clamp-2">{c.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. TYPOGRAPHY */}
        {(activeTab === "all" || activeTab === "typography") && (
          <section id="typography" className="space-y-6">
            <div className="flex items-baseline justify-between border-b border-gray-200 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-amber-600 uppercase">Section 03</span>
                <h2 className="text-2xl font-bold text-gray-950 tracking-tight">Typography Scale & Hierarchy</h2>
              </div>
              <span className="text-xs text-gray-500 font-mono">Font: System Sans / Inter</span>
            </div>

            {/* Interactive Tester Input */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center gap-3 shadow-xs">
              <span className="text-xs font-bold text-gray-700 whitespace-nowrap">Live Tester:</span>
              <input
                type="text"
                value={typographySample}
                onChange={(e) => setTypographySample(e.target.value)}
                placeholder="Type your preview text..."
                className="w-full text-xs text-gray-900 bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 outline-none focus:border-amber-400"
              />
            </div>

            {/* Typography Table & Live Preview */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs divide-y divide-gray-100">
              {typographyTokens.map((t) => (
                <div key={t.token} className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                  <div className="lg:w-1/3 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                        {t.token}
                      </span>
                      <span className="text-xs text-amber-600 font-bold">{t.size}</span>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Weight: {t.weight} • Leading: {t.lineHeight} • Tracking: {t.tracking}
                    </p>
                    <p className="text-[11px] text-gray-400">{t.role}</p>
                  </div>

                  <div className="lg:w-2/3 overflow-hidden">
                    <div className={t.previewClass}>
                      {typographySample || "Active Summer With Juice Milk 300ml"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. SPACING, RADIUS & GRID */}
        {(activeTab === "all" || activeTab === "spacing") && (
          <section id="spacing" className="space-y-6">
            <div className="flex items-baseline justify-between border-b border-gray-200 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-amber-600 uppercase">Section 04</span>
                <h2 className="text-2xl font-bold text-gray-950 tracking-tight">Spacing, Radius & Layout Grid</h2>
              </div>
              <span className="text-xs text-gray-500 font-mono">12-Column Responsive</span>
            </div>

            {/* Spacing tokens visual */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-gray-900">Spacing Scale (4px Base Multiples)</h3>
                <div className="space-y-2.5">
                  {spacingTokens.map((s) => (
                    <div key={s.token} className="flex items-center justify-between text-xs py-1 border-b border-gray-50">
                      <div className="flex items-center gap-3 w-36">
                        <span className="font-mono font-bold text-gray-900">{s.token}</span>
                        <span className="text-gray-400 font-mono">{s.val}</span>
                      </div>
                      <div className="flex-1 px-4">
                        <div
                          className={`h-3 bg-[#fab528] rounded-xs ${s.previewClass}`}
                        ></div>
                      </div>
                      <span className="text-[11px] text-gray-400 text-right w-48 truncate">{s.role}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Radius Scale */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-gray-900">Border Radius Scale</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {radiusTokens.map((r) => (
                    <div key={r.token} className="border border-gray-200 p-3 flex flex-col items-center text-center">
                      <div
                        className={`w-16 h-12 bg-amber-100 border-2 border-amber-400 mb-2 flex items-center justify-center font-mono text-[10px] text-amber-900 font-bold ${r.previewClass}`}
                      >
                        {r.val}
                      </div>
                      <p className="font-mono text-xs font-bold text-gray-900">{r.token}</p>
                      <p className="text-[10px] text-gray-500 mt-1 leading-tight">{r.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Layout Grid Blueprint */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">12-Column Responsive Merchandising Grid</h3>
                  <p className="text-xs text-gray-500">Max container width: 1280px (max-w-7xl) with 16px to 32px gutters</p>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 text-center font-mono text-[10px] text-amber-800 font-bold">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="bg-amber-100/70 border border-amber-300/60 rounded py-2">
                    C{i + 1}
                  </div>
                ))}
              </div>

              {/* Visual Breakdown of Page Sections */}
              <div className="space-y-2 pt-2 text-xs font-semibold">
                <div className="grid grid-cols-12 gap-2 text-center text-white">
                  <div className="col-span-8 bg-slate-700 rounded py-2 shadow-xs">
                    Main Hero Card (col-span-8 / ~68%)
                  </div>
                  <div className="col-span-4 bg-[#fab528] text-gray-950 rounded py-2 shadow-xs">
                    Promo Card (col-span-4 / ~32%)
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-2 text-center">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="col-span-12 sm:col-span-3 lg:col-span-1.5 bg-white border border-gray-200 rounded py-2 text-gray-700 text-[10px]">
                      Cat {i + 1}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-12 gap-2 text-center text-white">
                  <div className="col-span-3 bg-emerald-700 rounded py-2 text-xs">
                    Top Saver Deal (col-span-3)
                  </div>
                  <div className="col-span-6 bg-slate-800 rounded py-2 text-xs">
                    Products Grid 3x (col-span-6)
                  </div>
                  <div className="col-span-3 bg-amber-700 rounded py-2 text-xs">
                    Member 15% OFF (col-span-3)
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 5. COMPONENT RULES & LIVE SHOWCASE */}
        {(activeTab === "all" || activeTab === "components") && (
          <section id="components" className="space-y-8">
            <div className="flex items-baseline justify-between border-b border-gray-200 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-amber-600 uppercase">Section 05</span>
                <h2 className="text-2xl font-bold text-gray-950 tracking-tight">Interactive Component Library</h2>
              </div>
              <span className="text-xs text-gray-500 font-mono">Live Interactive React Code</span>
            </div>

            {/* COMPONENT 1: Buttons */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">5.1 Button Tokens & States</h3>
                  <p className="text-xs text-gray-500">Primary yellow, white pill hero actions, counter steppers</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {/* Primary Button */}
                <button
                  type="button"
                  onClick={() => copyToClipboard("bg-[#fab528] hover:bg-[#e5a420] text-gray-950 font-bold px-5 py-2.5 rounded-lg text-xs", "Primary Button Class")}
                  className="bg-[#fab528] hover:bg-[#e5a420] active:bg-[#c98f16] text-gray-950 font-bold px-5 py-2.5 rounded-lg text-xs transition shadow-xs cursor-pointer"
                >
                  Primary Action (&quot;+ Add to Cart&quot;)
                </button>

                {/* White Pill Button */}
                <button
                  type="button"
                  className="bg-white hover:bg-gray-50 text-gray-900 font-bold px-6 py-2.5 rounded-full shadow-sm border border-gray-100 text-xs transition cursor-pointer"
                >
                  White Pill CTA (&quot;Shop Now&quot;)
                </button>

                {/* Category Button */}
                <button
                  type="button"
                  className="bg-[#fab528] hover:bg-[#e5a420] text-gray-950 px-4 py-2 rounded font-bold flex items-center gap-2 text-xs uppercase"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span>SHOP BY CATEGORY</span>
                </button>

                {/* Arrow Carousel Buttons */}
                <div className="flex items-center gap-1.5">
                  <button type="button" className="w-6 h-6 rounded border border-gray-200 text-gray-400 hover:text-gray-800 flex items-center justify-center text-xs">
                    &lt;
                  </button>
                  <button type="button" className="w-6 h-6 rounded bg-[#fab528] text-gray-950 font-bold flex items-center justify-center text-xs">
                    &gt;
                  </button>
                </div>
              </div>
            </div>

            {/* COMPONENT 2: Top Saver Deal Card Demo */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">5.2 Featured Top Saver Deal Component</h3>
                  <p className="text-xs text-gray-500">Live interactive quantity stepper with dynamic total price computation</p>
                </div>
                <div className="bg-[#e05638] text-white px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5">
                  <span className="font-normal opacity-90">Expires in:</span>
                  <span className="font-mono font-bold">
                    {String(countdown.h).padStart(2, "0")} : {String(countdown.m).padStart(2, "0")} : {String(countdown.s).padStart(2, "0")}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {/* Live Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs relative">
                  <button type="button" className="absolute top-4 right-4 text-gray-300 hover:text-red-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>

                  <div className="h-32 w-full flex items-center justify-center py-2 bg-emerald-50/50 rounded-lg mb-2">
                    <span className="text-3xl">🍺</span>
                  </div>

                  <p className="text-[10px] text-gray-400 font-medium">Brand Name</p>
                  <h4 className="text-xs font-semibold text-gray-900 mt-0.5">Ice Gold&apos;s Beer 350ml x 24 Pieces</h4>

                  <div className="flex items-center gap-1 mt-1 text-xs">
                    <span className="text-amber-400">★★★★★</span>
                    <span className="text-[10px] text-gray-400">(3)</span>
                  </div>

                  <div className="mt-2 text-base font-bold text-gray-950">$49.50</div>

                  <div className="mt-3">
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-[#fab528] h-full rounded-full w-[50%]"></div>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">Sold: 20/40</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center border border-gray-200 rounded overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setStepperQty((q) => Math.max(1, q - 1))}
                          className="px-2.5 py-1 text-gray-500 hover:bg-gray-100 font-bold"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 font-semibold text-gray-800">{stepperQty}</span>
                        <button
                          type="button"
                          onClick={() => setStepperQty((q) => q + 1)}
                          className="px-2.5 py-1 text-gray-500 hover:bg-gray-100 font-bold"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-semibold text-gray-900">
                        Total: ${(49.5 * stepperQty).toFixed(2)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(`Added ${stepperQty}x items`, "Cart notification")}
                      className="w-full bg-[#fab528] hover:bg-[#e5a420] text-gray-950 font-bold py-2 rounded-lg text-xs"
                    >
                      + Add to Cart
                    </button>
                  </div>
                </div>

                {/* Explanation Code Snippet */}
                <div className="md:col-span-2 space-y-3 text-xs">
                  <h4 className="font-bold text-gray-900">Design System Rules for Deal Cards:</h4>
                  <ul className="space-y-1.5 text-gray-600 list-disc list-inside">
                    <li>Card corner radius must be <code className="font-mono bg-gray-100 px-1 py-0.5 rounded">rounded-xl (16px)</code> with hairline border <code className="font-mono bg-gray-100 px-1 py-0.5 rounded">#E5E7EB</code>.</li>
                    <li>Always provide a wishlist icon trigger at top-right for fast saving.</li>
                    <li>Progress bar must use <code className="font-mono bg-gray-100 px-1 py-0.5 rounded">#FAB528</code> filled bar over <code className="font-mono bg-gray-100 px-1 py-0.5 rounded">#F3F4F6</code> track.</li>
                    <li>Quantity stepper updates total price dynamically without screen reloads.</li>
                    <li>Countdown badge uses high-urgency terracotta red <code className="font-mono bg-gray-100 px-1 py-0.5 rounded">#E05638</code> with fixed tabular digits.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* COMPONENT 3: Category Cards (Resting vs Active) */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">5.3 Category Cards (Resting vs Active Selected State)</h3>
                  <p className="text-xs text-gray-500">Interactive demo — Click between cards to see highlight state</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { name: "Fruits & Vegetables", icon: "🍎" },
                  { name: "Breads & Sweets", icon: "🥐" },
                  { name: "Frozen Seafoods", icon: "🦀" },
                  { name: "Raw Meats", icon: "🥩" },
                ].map((item) => {
                  const isSelected = selectedDemoCat === item.name;
                  return (
                    <div
                      key={item.name}
                      onClick={() => setSelectedDemoCat(item.name)}
                      className={`bg-white rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "border-2 border-[#fab528] shadow-lg -translate-y-1 bg-amber-50/20"
                          : "border border-gray-100 hover:border-gray-200 hover:shadow-md"
                      }`}
                    >
                      <div className="text-3xl mb-2">{item.icon}</div>
                      <span className={`text-xs font-semibold ${isSelected ? "text-gray-950 font-bold" : "text-gray-700"}`}>
                        {item.name}
                      </span>
                      <span className="text-[10px] font-mono mt-1 text-gray-400">
                        {isSelected ? "State: ACTIVE" : "State: RESTING"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* COMPONENT 4: Modal Dialog System (DESIGN.md Spec) */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-3 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900">5.4 Modal Dialog System</h3>
                    <span className="bg-amber-100 text-amber-900 font-mono text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                      New Component
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Spec: <code className="font-mono bg-gray-100 px-1 py-0.5 rounded">backdrop-blur-xs</code>, <code className="font-mono bg-gray-100 px-1 py-0.5 rounded">bg-white rounded-2xl border border-gray-200 shadow-2xl</code>, ESC key listener, focus trap & body scroll locking.
                  </p>
                </div>

                <span className="text-[11px] font-mono text-gray-400">components/Dialog.tsx</span>
              </div>

              {/* Interactive Demo Triggers */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-700">Live Triggers — Click to launch Dialog variants:</p>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setConfirmDialogOpen(true)}
                    className="bg-white hover:bg-gray-50 text-gray-900 font-bold border border-gray-200 px-4 py-2.5 rounded-lg text-xs transition shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <span>⚠️</span>
                    <span>Launch Confirmation Dialog</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProductDialogOpen(true)}
                    className="bg-[#fab528] hover:bg-[#e5a420] text-gray-950 font-bold px-4 py-2.5 rounded-lg text-xs transition shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <span>🔍</span>
                    <span>Launch Product Quick View Dialog</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOfferDialogOpen(true)}
                    className="bg-orange-50 hover:bg-orange-100 text-[#e05638] border border-orange-200 font-bold px-4 py-2.5 rounded-lg text-xs transition shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <span>🎁</span>
                    <span>Launch 15% OFF Member Dialog</span>
                  </button>
                </div>
              </div>

              {/* Code Usage Snippet */}
              <div className="bg-gray-900 text-gray-100 rounded-xl p-4 font-mono text-xs overflow-x-auto space-y-2">
                <div className="flex items-center justify-between text-[11px] text-gray-400 border-b border-gray-800 pb-2">
                  <span>Usage Example: Import & integrate &lt;Dialog /&gt;</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(`import { Dialog } from "@/app/components/Dialog";\n\n<Dialog\n  isOpen={isOpen}\n  onClose={() => setIsOpen(false)}\n  title="Dialog Title"\n  description="Supporting description"\n  footer={\n    <button className="bg-[#fab528] px-4 py-2 rounded-lg font-bold">Confirm</button>\n  }\n>\n  <p>Dialog body content...</p>\n</Dialog>`, "Dialog Code Snippet")}
                    className="text-amber-400 hover:text-amber-300 cursor-pointer"
                  >
                    Copy Code
                  </button>
                </div>
                <pre className="text-gray-300 leading-relaxed">
{`import { Dialog } from "@/app/components/Dialog";

<Dialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Dialog Title"
  description="Supporting explanation or guidance"
  footer={
    <div className="flex gap-2">
      <button onClick={() => setIsOpen(false)} className="border px-3 py-1.5 rounded-lg">Cancel</button>
      <button className="bg-[#fab528] px-4 py-1.5 rounded-lg font-bold">Confirm</button>
    </div>
  }
>
  <p>Your interactive modal content here...</p>
</Dialog>`}
                </pre>
              </div>
            </div>

            {/* DIALOG 1: Confirmation Modal */}
            <Dialog
              isOpen={confirmDialogOpen}
              onClose={() => setConfirmDialogOpen(false)}
              title="Empty Shopping Cart?"
              description="Are you sure you want to remove all 3 items ($2,450.59) from your cart?"
              maxWidth="sm"
              footer={
                <>
                  <button
                    type="button"
                    onClick={() => setConfirmDialogOpen(false)}
                    className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-lg text-xs font-semibold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmDialogOpen(false);
                      copyToClipboard("Cart has been emptied", "Action");
                    }}
                    className="px-4 py-2 bg-[#ff4d4f] hover:bg-red-600 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    Yes, Empty Cart
                  </button>
                </>
              }
            >
              <div className="p-3 bg-red-50/70 border border-red-100 rounded-xl flex items-start gap-3">
                <span className="text-red-500 text-lg">⚠️</span>
                <p className="text-xs text-red-900 leading-relaxed">
                  This action cannot be undone. Saved special deals and promotional coupon reserves will be released.
                </p>
              </div>
            </Dialog>

            {/* DIALOG 2: Product Quick View Modal */}
            <Dialog
              isOpen={productDialogOpen}
              onClose={() => setProductDialogOpen(false)}
              title="Ice Gold's Beer 350ml x 24 Pieces"
              description="Brand: Brand Name • Category: Chilled Beverages • SKU: BEER-350-24"
              maxWidth="lg"
              footer={
                <>
                  <button
                    type="button"
                    onClick={() => setProductDialogOpen(false)}
                    className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-lg text-xs font-semibold transition cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProductDialogOpen(false);
                      copyToClipboard(`Added ${quickViewQty}x Ice Gold's Beer to cart ($${(49.5 * quickViewQty).toFixed(2)})`, "Cart Updated");
                    }}
                    className="px-5 py-2 bg-[#fab528] hover:bg-[#e5a420] text-gray-950 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    + Add to Cart • ${(49.5 * quickViewQty).toFixed(2)}
                  </button>
                </>
              }
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="bg-emerald-50/60 rounded-xl p-4 flex items-center justify-center h-48 border border-emerald-100">
                  <div className="text-center">
                    <span className="text-6xl">🍺</span>
                    <p className="text-[10px] font-bold text-emerald-800 mt-2 uppercase tracking-wider">Premium Lager 24-Pack</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-1.5">
                    <div className="flex text-amber-400 text-sm">★★★★★</div>
                    <span className="text-xs text-gray-400 font-medium">(3 customer reviews)</span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-gray-950">$49.50</span>
                    <span className="text-xs text-gray-400 line-through">$58.00</span>
                    <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded">Save 15%</span>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    Freshly chilled premium golden lager crafted with all-natural barley. Sold in convenient 24-can party box.
                  </p>

                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-[11px] font-semibold text-gray-700 mb-1.5">Quantity:</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gray-200 rounded overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setQuickViewQty((q) => Math.max(1, q - 1))}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 font-bold"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 font-semibold text-gray-900">{quickViewQty}</span>
                        <button
                          type="button"
                          onClick={() => setQuickViewQty((q) => q + 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 font-bold"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-xs text-gray-500">In Stock: 20 packs left</span>
                    </div>
                  </div>
                </div>
              </div>
            </Dialog>

            {/* DIALOG 3: Member Offer Modal */}
            <Dialog
              isOpen={offerDialogOpen}
              onClose={() => setOfferDialogOpen(false)}
              title="🎁 Unlock 15% OFF Your First Order"
              description="Join the Farmart Member Circle to receive immediate savings on your grocery basket."
              maxWidth="md"
              footer={
                <>
                  <button
                    type="button"
                    onClick={() => setOfferDialogOpen(false)}
                    className="px-4 py-2 text-gray-500 hover:text-gray-800 text-xs font-semibold transition cursor-pointer"
                  >
                    No thanks, maybe later
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOfferDialogOpen(false);
                      copyToClipboard("Member account registered! 15% discount applied.", "Registration Success");
                    }}
                    className="px-5 py-2 bg-[#fab528] hover:bg-[#e5a420] text-gray-950 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    Register Now & Claim 15%
                  </button>
                </>
              }
            >
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="yourdomain@gmail.com"
                    defaultValue="customer@example.com"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="Create a password"
                    defaultValue="farmart2026"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-amber-400"
                  />
                </div>
                <p className="text-[10px] text-gray-400">
                  By joining, you agree to Farmart Terms of Service and Privacy Policy. Discount code automatically applies at checkout.
                </p>
              </div>
            </Dialog>

            {/* COMPONENT 5: Badge System */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">5.5 Semantic Badge System</h3>
                  <p className="text-xs text-gray-500">
                    High-contrast status signals for discounts, inventory velocity, and fresh certification
                  </p>
                </div>
                <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                  components/Badge.tsx
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                <div className="p-3 border border-gray-100 rounded-xl bg-gray-50/50 flex flex-col items-center gap-2">
                  <Badge variant="deal">SALE 20% OFF</Badge>
                  <span className="text-[10px] text-gray-500 font-mono">deal</span>
                </div>
                <div className="p-3 border border-gray-100 rounded-xl bg-gray-50/50 flex flex-col items-center gap-2">
                  <Badge variant="save">Save 15%</Badge>
                  <span className="text-[10px] text-gray-500 font-mono">save</span>
                </div>
                <div className="p-3 border border-gray-100 rounded-xl bg-gray-50/50 flex flex-col items-center gap-2">
                  <Badge variant="bestseller">Best Seller</Badge>
                  <span className="text-[10px] text-gray-500 font-mono">bestseller</span>
                </div>
                <div className="p-3 border border-gray-100 rounded-xl bg-gray-50/50 flex flex-col items-center gap-2">
                  <Badge variant="topsaver">Top Saver</Badge>
                  <span className="text-[10px] text-gray-500 font-mono">topsaver</span>
                </div>
                <div className="p-3 border border-gray-100 rounded-xl bg-gray-50/50 flex flex-col items-center gap-2">
                  <Badge variant="instock">In Stock</Badge>
                  <span className="text-[10px] text-gray-500 font-mono">instock</span>
                </div>
                <div className="p-3 border border-gray-100 rounded-xl bg-gray-50/50 flex flex-col items-center gap-2">
                  <Badge variant="outstock">Sold Out</Badge>
                  <span className="text-[10px] text-gray-500 font-mono">outstock</span>
                </div>
                <div className="p-3 border border-gray-100 rounded-xl bg-gray-50/50 flex flex-col items-center gap-2">
                  <Badge variant="organic">100% Organic</Badge>
                  <span className="text-[10px] text-gray-500 font-mono">organic</span>
                </div>
              </div>
            </div>

            {/* COMPONENT 6: Quantity Stepper */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">5.6 Quantity Stepper System</h3>
                  <p className="text-xs text-gray-500">
                    Numeric stepper with min/max bounds, size variants, and disabled state
                  </p>
                </div>
                <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                  components/QuantityStepper.tsx
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 flex flex-col items-center gap-2">
                  <span className="text-[11px] font-semibold text-gray-600">Size: Small (sm)</span>
                  <QuantityStepper
                    value={stepperDemoSm}
                    onChange={setStepperDemoSm}
                    size="sm"
                    min={1}
                    max={10}
                  />
                  <span className="text-[10px] text-gray-400 font-mono">Value: {stepperDemoSm}</span>
                </div>

                <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 flex flex-col items-center gap-2">
                  <span className="text-[11px] font-semibold text-gray-600">Size: Medium (md - Default)</span>
                  <QuantityStepper
                    value={stepperDemoMd}
                    onChange={setStepperDemoMd}
                    size="md"
                    min={1}
                    max={20}
                  />
                  <span className="text-[10px] text-gray-400 font-mono">Value: {stepperDemoMd}</span>
                </div>

                <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 flex flex-col items-center gap-2">
                  <span className="text-[11px] font-semibold text-gray-600">Size: Large (lg)</span>
                  <QuantityStepper
                    value={stepperDemoLg}
                    onChange={setStepperDemoLg}
                    size="lg"
                    min={1}
                    max={50}
                  />
                  <span className="text-[10px] text-gray-400 font-mono">Value: {stepperDemoLg}</span>
                </div>

                <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 flex flex-col items-center gap-2">
                  <span className="text-[11px] font-semibold text-gray-600">State: Disabled</span>
                  <QuantityStepper
                    value={5}
                    onChange={() => {}}
                    size="md"
                    disabled={true}
                  />
                  <span className="text-[10px] text-gray-400 font-mono">disabled=true</span>
                </div>
              </div>
            </div>

            {/* COMPONENT 7: Free Shipping Progress Tracker */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">5.7 Free Shipping Progress Tracker</h3>
                  <p className="text-xs text-gray-500">
                    Dynamic gamified basket progress calculating threshold distance to $99.00 free shipping
                  </p>
                </div>
                <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                  components/FreeShippingBar.tsx
                </span>
              </div>

              <div className="space-y-4 max-w-2xl">
                <FreeShippingBar currentAmount={shippingSimAmount} threshold={99} />

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs font-semibold text-gray-600 mr-2">Simulate Basket Total:</span>
                  <button
                    type="button"
                    onClick={() => setShippingSimAmount(25)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      shippingSimAmount === 25
                        ? "bg-amber-400 text-gray-950 shadow-xs"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    $25.00 (Low)
                  </button>
                  <button
                    type="button"
                    onClick={() => setShippingSimAmount(64.5)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      shippingSimAmount === 64.5
                        ? "bg-amber-400 text-gray-950 shadow-xs"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    $64.50 (Mid)
                  </button>
                  <button
                    type="button"
                    onClick={() => setShippingSimAmount(95)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      shippingSimAmount === 95
                        ? "bg-amber-400 text-gray-950 shadow-xs"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    $95.00 (Near Goal)
                  </button>
                  <button
                    type="button"
                    onClick={() => setShippingSimAmount(112)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      shippingSimAmount === 112
                        ? "bg-emerald-500 text-white shadow-xs"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    $112.00 (Unlocked! 🎉)
                  </button>
                </div>
              </div>
            </div>

            {/* COMPONENT 8: Breadcrumb Navigation */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">5.8 Breadcrumb Navigation</h3>
                  <p className="text-xs text-gray-500">
                    Semantic breadcrumb hierarchy guiding user location within grocery departments
                  </p>
                </div>
                <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                  components/Breadcrumb.tsx
                </span>
              </div>

              <div className="p-4 bg-gray-50/70 border border-gray-100 rounded-xl space-y-3">
                <Breadcrumb
                  items={[
                    { label: "Home", href: "/" },
                    { label: "Beverages & Cold Drinks", href: "/" },
                    { label: "Craft & Canned Beer", href: "/" },
                    { label: "Ice Golds Beer Can (24 x 330ml)" },
                  ]}
                />
              </div>
            </div>

            {/* COMPONENT 9: Product Detail Page Link Showcase */}
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-orange-400/10 rounded-2xl p-6 border border-amber-300 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-gray-950 font-bold text-[10px] uppercase tracking-wider mb-1">
                    NEW FEATURE • /product/[id]
                  </div>
                  <h3 className="text-base font-bold text-gray-950">
                    5.9 Complete Product Detail Page Implementation
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 max-w-xl leading-relaxed">
                    Built according to the Farmart Design System &amp; PLAN.md requirements. Includes SVG product graphics, interactive gallery, live price calculator, savings badge, free shipping meter, product nutrition tabs, and sticky bottom action bar.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href="/product"
                    className="px-5 py-2.5 bg-[#fab528] hover:bg-[#e5a420] text-gray-950 font-bold rounded-xl text-xs shadow-sm transition inline-flex items-center gap-2"
                  >
                    <span>View Product Detail</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <Link
                  href="/product/ice-golds-beer"
                  className="p-3 bg-white/80 hover:bg-white rounded-xl border border-amber-200 transition text-left group"
                >
                  <p className="text-[10px] text-amber-700 font-bold uppercase">Beverages</p>
                  <p className="text-xs font-bold text-gray-900 group-hover:text-amber-600 transition truncate">
                    Ice Golds Beer Can
                  </p>
                  <p className="text-[11px] font-bold text-gray-900 mt-1">$29.99</p>
                </Link>

                <Link
                  href="/product/british-beef-mince"
                  className="p-3 bg-white/80 hover:bg-white rounded-xl border border-amber-200 transition text-left group"
                >
                  <p className="text-[10px] text-rose-700 font-bold uppercase">Butcher &amp; Meat</p>
                  <p className="text-xs font-bold text-gray-900 group-hover:text-amber-600 transition truncate">
                    British Beef Mince 500g
                  </p>
                  <p className="text-[11px] font-bold text-gray-900 mt-1">$9.50</p>
                </Link>

                <Link
                  href="/product/farmhouse-soft-white"
                  className="p-3 bg-white/80 hover:bg-white rounded-xl border border-amber-200 transition text-left group"
                >
                  <p className="text-[10px] text-amber-800 font-bold uppercase">Bakery</p>
                  <p className="text-xs font-bold text-gray-900 group-hover:text-amber-600 transition truncate">
                    Farmhouse Soft White Bread
                  </p>
                  <p className="text-[11px] font-bold text-gray-900 mt-1">$3.20</p>
                </Link>

                <Link
                  href="/product/blood-orange"
                  className="p-3 bg-white/80 hover:bg-white rounded-xl border border-amber-200 transition text-left group"
                >
                  <p className="text-[10px] text-emerald-700 font-bold uppercase">Fresh Produce</p>
                  <p className="text-xs font-bold text-gray-900 group-hover:text-amber-600 transition truncate">
                    Organic Blood Oranges 1kg
                  </p>
                  <p className="text-[11px] font-bold text-gray-900 mt-1">$5.80</p>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* 6. ELEVATION & SURFACES */}
        {(activeTab === "all" || activeTab === "elevation") && (
          <section id="elevation" className="space-y-6">
            <div className="flex items-baseline justify-between border-b border-gray-200 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-amber-600 uppercase">Section 06</span>
                <h2 className="text-2xl font-bold text-gray-950 tracking-tight">Elevation & Shadow Scale</h2>
              </div>
              <span className="text-xs text-gray-500 font-mono">Soft Depth Hierarchy</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-center">
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-none">
                <p className="font-mono text-xs font-bold text-gray-900">01. Flat</p>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">shadow-none</p>
                <p className="text-[11px] text-gray-500 mt-2">Resting category cards, secondary pills</p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs">
                <p className="font-mono text-xs font-bold text-gray-900">02. Subtle (xs)</p>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">shadow-xs</p>
                <p className="text-[11px] text-gray-500 mt-2">Search bar, deal cards, standard products</p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-md -translate-y-0.5">
                <p className="font-mono text-xs font-bold text-gray-900">03. Hovered</p>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">shadow-md</p>
                <p className="text-[11px] text-gray-500 mt-2">Interactive cards during cursor hover</p>
              </div>

              <div className="bg-amber-50/30 rounded-xl p-5 border-2 border-[#fab528] shadow-lg -translate-y-1">
                <p className="font-mono text-xs font-bold text-gray-900">04. Selected</p>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">shadow-lg</p>
                <p className="text-[11px] text-gray-500 mt-2">Active category card, chosen filter</p>
              </div>

              <div className="bg-gray-900 text-white rounded-xl p-5 shadow-2xl border border-gray-700">
                <p className="font-mono text-xs font-bold text-amber-400">05. Floating</p>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">shadow-2xl</p>
                <p className="text-[11px] text-gray-300 mt-2">Modal dialogs, popovers, toast alerts</p>
              </div>
            </div>
          </section>
        )}

        {/* 7. MOTION & INTERACTION */}
        {(activeTab === "all" || activeTab === "motion") && (
          <section id="motion" className="space-y-6">
            <div className="flex items-baseline justify-between border-b border-gray-200 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-amber-600 uppercase">Section 07</span>
                <h2 className="text-2xl font-bold text-gray-950 tracking-tight">Motion & Interaction Tokens</h2>
              </div>
              <span className="text-xs text-gray-500 font-mono">150ms – 200ms ease-in-out</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-2">
                <span className="font-mono text-xs font-bold text-amber-600">Motion 01</span>
                <h3 className="text-sm font-bold text-gray-900">Smooth Micro-Lift on Hover</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Interactive merchandise cards translate upwards by 2px to 4px with gentle drop shadows,
                  giving tactile satisfaction without disorienting layout reflows.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-2">
                <span className="font-mono text-xs font-bold text-amber-600">Motion 02</span>
                <h3 className="text-sm font-bold text-gray-900">Jitter-Free Monospace Clocks</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  All deal countdown timers utilize tabular fixed-width numbers (<code className="font-mono bg-gray-100 px-1 py-0.5 rounded text-[11px]">font-mono</code>)
                  ensuring the badge width remains rock-solid as digits tick down.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-2">
                <span className="font-mono text-xs font-bold text-amber-600">Motion 03</span>
                <h3 className="text-sm font-bold text-gray-900">Asynchronous Toast Confirmation</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Cart and Wishlist mutations pop non-blocking floating dark toasts in the top-right corner with 3000ms auto-dismiss.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* 9. DO'S AND DON'TS (AGENT GUARDRAILS) */}
        {(activeTab === "all" || activeTab === "guardrails") && (
          <section id="guardrails" className="space-y-6">
            <div className="flex items-baseline justify-between border-b border-gray-200 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-amber-600 uppercase">Section 09</span>
                <h2 className="text-2xl font-bold text-gray-950 tracking-tight">Do&apos;s and Don&apos;ts (AI Agent Guardrails)</h2>
              </div>
              <span className="text-xs text-gray-500 font-mono">Strict Coding Constraints</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* DO */}
              <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-200 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <h3 className="text-base font-bold text-emerald-950">DO (Mandatory Best Practices)</h3>
                </div>

                <ul className="space-y-3 text-xs text-emerald-900">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-emerald-600">1.</span>
                    <span><strong>Keep the canvas bright:</strong> Food e-commerce relies on natural white (<code className="font-mono bg-white px-1 py-0.5 rounded">#FFFFFF</code>) and warm light accents.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-emerald-600">2.</span>
                    <span><strong>Anchor with Warm Amber:</strong> Always use <code className="font-mono bg-white px-1 py-0.5 rounded">#FAB528</code> for primary buttons, category triggers, and active highlights.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-emerald-600">3.</span>
                    <span><strong>Utilize Category Pastel Tints:</strong> Give snack, beverage, tea, and meat showcase cards their respective pastel background colors.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-emerald-600">4.</span>
                    <span><strong>Maintain Interactive Pricing:</strong> Deal cards must update their total price dynamically as quantity changes.</span>
                  </li>
                </ul>
              </div>

              {/* DON'T */}
              <div className="bg-rose-50/50 rounded-2xl p-6 border border-rose-200 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
                    ✕
                  </div>
                  <h3 className="text-base font-bold text-rose-950">DON&apos;T (Strict Anti-Patterns)</h3>
                </div>

                <ul className="space-y-3 text-xs text-rose-900">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-rose-600">1.</span>
                    <span><strong>NO Dark Mode by default:</strong> Do NOT turn the canvas into black/dark slate (<code className="font-mono bg-white px-1 py-0.5 rounded">#0F172A</code>). It destroys fresh grocery appeal.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-rose-600">2.</span>
                    <span><strong>NO Generic Blue/Purple Buttons:</strong> Do NOT replace Farmart amber with standard Bootstrap blue or AI-template purple.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-rose-600">3.</span>
                    <span><strong>NO Heavy Black Borders:</strong> Keep borders subtle at 1px hairline scale (<code className="font-mono bg-white px-1 py-0.5 rounded">#E5E7EB</code>). Avoid 3px harsh strokes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-rose-600">4.</span>
                    <span><strong>NO Broken Placeholders:</strong> Do not leave broken image icons or unformatted text blocks. Use clean SVG illustrations.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 Farmart Design System. Follows <a href="https://getdesign.md/what-is-design-md" className="underline hover:text-gray-900">getdesign.md</a> specification.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-amber-600 font-semibold">Storefront Home</Link>
            <Link href="/overview" className="hover:text-amber-600 font-semibold">Project Overview</Link>
            <span>•</span>
            <span className="font-mono text-gray-400">lab3/DESIGN.md</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
