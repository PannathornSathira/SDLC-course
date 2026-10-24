"use client";

import React, { useState, useEffect, use, Suspense } from "react";
import Link from "next/link";
import { PRODUCTS, DEFAULT_PRODUCT_ID, Product } from "@/app/data/products";
import { Badge } from "@/app/components/Badge";
import { QuantityStepper } from "@/app/components/QuantityStepper";
import { FreeShippingBar } from "@/app/components/FreeShippingBar";
import { Breadcrumb } from "@/app/components/Breadcrumb";
import { Dialog } from "@/app/components/Dialog";

interface PageProps {
  params: Promise<{ id: string }>;
}

function ProductDetailContent({ params }: PageProps) {
  const resolvedParams = use(params);
  const productId = resolvedParams?.id || DEFAULT_PRODUCT_ID;
  const product: Product = PRODUCTS[productId] || PRODUCTS[DEFAULT_PRODUCT_ID];

  // Interactive states
  const [qty, setQty] = useState(1);
  const [selectedPack, setSelectedPack] = useState("Standard Pack");
  const [activeTab, setActiveTab] = useState<"desc" | "nutrition" | "reviews" | "shipping">("desc");
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartCount, setCartCount] = useState(3);
  const [cartTotal, setCartTotal] = useState(2450.59);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dialog Modals
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState("");
  const [newReviewComment, setNewReviewComment] = useState("");

  // Sticky bottom bar visibility
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 550);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddToCart = () => {
    const itemTotal = product.price * qty;
    setCartCount((c) => c + qty);
    setCartTotal((t) => t + itemTotal);
    showToast(
      `Added ${qty}x ${product.name} to cart ($${itemTotal.toFixed(2)})`
    );
  };

  // Gallery Visual Mockups
  const renderProductGraphic = (targetId: string = product.id) => {
    switch (targetId) {
      case "ice-golds-beer":
        return (
          <svg viewBox="0 0 240 240" className="w-64 h-64 drop-shadow-xl">
            <ellipse cx="120" cy="205" rx="75" ry="16" fill="#0f172a" fillOpacity="0.12" />
            <g transform="translate(45, 30)">
              <rect x="15" y="25" width="115" height="130" rx="8" fill="#FFFFFF" stroke="#86EFAC" strokeWidth="2" />
              <polygon points="15,25 45,5 160,5 130,25" fill="#15803D" />
              <polygon points="130,25 160,5 160,135 130,155" fill="#166534" />
              <rect x="25" y="45" width="95" height="34" fill="#15803D" rx="4" />
              <text x="72" y="66" fontSize="12" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">
                ICE GOLD
              </text>
              <circle cx="72" cy="115" r="22" fill="#BBF7D0" />
              <circle cx="72" cy="115" r="16" fill="#22C55E" />
              <text x="72" y="119" fontSize="10" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">
                24x
              </text>
            </g>
          </svg>
        );

      case "british-beef-mince":
        return (
          <svg viewBox="0 0 240 240" className="w-64 h-64 drop-shadow-xl">
            <ellipse cx="120" cy="195" rx="70" ry="14" fill="#0f172a" fillOpacity="0.12" />
            <g transform="translate(30, 40)">
              <rect x="20" y="25" width="140" height="110" rx="10" fill="#1F2937" />
              <rect x="28" y="32" width="124" height="96" rx="6" fill="#DC2626" />
              <circle cx="50" cy="60" r="3.5" fill="#FECACA" />
              <circle cx="95" cy="55" r="4" fill="#FECACA" />
              <circle cx="120" cy="80" r="3" fill="#FECACA" />
              <circle cx="70" cy="95" r="3.5" fill="#FECACA" />
              <rect x="68" y="25" width="45" height="110" fill="#FEF3C7" fillOpacity="0.9" />
              <rect x="74" y="55" width="33" height="18" fill="#991B1B" rx="2" />
              <text x="90" y="67" fontSize="7" fontWeight="bold" fill="#FFF" textAnchor="middle">
                BRITISH
              </text>
            </g>
          </svg>
        );

      case "farmhouse-soft-white":
        return (
          <svg viewBox="0 0 240 240" className="w-64 h-64 drop-shadow-xl">
            <ellipse cx="120" cy="195" rx="75" ry="15" fill="#0f172a" fillOpacity="0.12" />
            <g transform="translate(35, 45)">
              <path
                d="M20 50C20 30 45 20 85 20C125 20 150 30 150 50V95C150 115 125 125 85 125C45 125 20 115 20 95V50Z"
                fill="#F5D061"
                stroke="#D4A017"
                strokeWidth="2"
              />
              <rect x="45" y="48" width="80" height="42" fill="#FFFFFF" rx="4" stroke="#E2E8F0" />
              <text x="85" y="66" fontSize="10" fontWeight="bold" fill="#854D0E" textAnchor="middle">
                FARMART
              </text>
              <text x="85" y="80" fontSize="8" fontWeight="semibold" fill="#A16207" textAnchor="middle">
                FARMHOUSE
              </text>
            </g>
          </svg>
        );

      case "blood-orange":
        return (
          <svg viewBox="0 0 240 240" className="w-64 h-64 drop-shadow-xl">
            <ellipse cx="120" cy="195" rx="70" ry="14" fill="#0f172a" fillOpacity="0.12" />
            <g transform="translate(25, 35)">
              <circle cx="125" cy="85" r="44" fill="#FB923C" stroke="#EA580C" strokeWidth="2" />
              <circle cx="125" cy="45" r="4" fill="#15803D" />
              <circle cx="65" cy="105" r="46" fill="#F97316" stroke="#C2410C" strokeWidth="2" />
              <circle cx="65" cy="105" r="38" fill="#EF4444" />
              <path d="M65 72 L65 138 M32 105 L98 105 M42 82 L88 128 M42 128 L88 82" stroke="#FEF2F2" strokeWidth="2" />
              <circle cx="65" cy="105" r="7" fill="#FEF2F2" />
            </g>
          </svg>
        );

      default:
        return (
          <div className="w-48 h-48 bg-amber-50 rounded-2xl flex items-center justify-center text-5xl">
            🛍️
          </div>
        );
    }
  };

  const packOptions = [
    { label: "Standard Pack", sub: product.unit, discount: null },
    { label: "Party Box x2", sub: "Double pack bundle", discount: "Save 10%" },
    { label: "Family Monthly Sub", sub: "Delivered weekly", discount: "Save 20%" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800 selection:bg-amber-100 selection:text-amber-900 pb-20">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in border border-gray-700">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-gray-950 font-sans">
                  Farmart
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-[#fab528] ml-1 mb-2"></span>
              </div>
              <span className="text-[9px] font-bold tracking-[0.25em] text-gray-400 -mt-1.5 uppercase">
                GROCERY
              </span>
            </div>
          </Link>

          {/* Quick Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-6 items-center">
            <div className="w-full flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-xs focus-within:border-amber-400 transition-all">
              <input
                type="text"
                placeholder={`Search in ${product.category}...`}
                className="w-full px-4 py-2 text-xs text-gray-800 placeholder-gray-400 outline-none"
              />
              <button
                type="button"
                className="px-4 py-2 text-gray-500 hover:text-gray-900 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-5">
            <Link
              href="/design"
              className="hidden lg:inline-flex items-center gap-1.5 bg-amber-100/70 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs px-3 py-1.5 rounded-md transition-all shadow-xs"
            >
              <span>🎨</span>
              <span>Design System</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                setIsWishlisted(!isWishlisted);
                showToast(isWishlisted ? "Removed from wishlist" : "Saved to wishlist ❤️");
              }}
              className="relative p-1.5 text-gray-700 hover:text-amber-500 transition-colors"
              title="Wishlist"
            >
              <svg className={`w-5 h-5 ${isWishlisted ? "text-red-500 fill-red-500" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            {/* Cart Preview */}
            <div className="flex items-center gap-2.5 cursor-pointer">
              <div className="relative p-1.5 text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-[#fab528] text-gray-900 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-[10px] text-gray-400 leading-none">Your Cart</p>
                <p className="text-xs font-bold text-gray-900 mt-0.5 leading-none">
                  ${cartTotal.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* BREADCRUMB STRIP */}
      <div className="border-b border-gray-100 bg-[#fbfbfc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: product.category, href: "/#categories" },
              { label: product.name },
            ]}
          />
          <div className="text-xs text-gray-400 hidden sm:block">
            SKU: <span className="font-mono text-gray-600">{product.sku}</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* PRODUCT HERO GRID */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT: GALLERY & BADGES (col-span-5) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Main Image Box */}
            <div className="relative bg-[#f8fafc] border border-gray-200 rounded-2xl p-8 flex items-center justify-center min-h-[380px] shadow-xs group">
              {/* Product Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                {product.discountPercent > 0 && (
                  <Badge variant="save">Save {product.discountPercent}%</Badge>
                )}
                {product.isBestSeller && (
                  <Badge variant="bestseller">Best Seller</Badge>
                )}
                {product.isTopSaver && (
                  <Badge variant="topsaver">Top Saver</Badge>
                )}
                {product.isOrganic && (
                  <Badge variant="organic">100% Organic</Badge>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => {
                  setIsWishlisted(!isWishlisted);
                  showToast(isWishlisted ? "Removed from wishlist" : "Saved to wishlist ❤️");
                }}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full border border-gray-200 text-gray-500 hover:text-red-500 shadow-xs transition cursor-pointer"
                aria-label="Save to wishlist"
              >
                <svg
                  className={`w-4 h-4 ${isWishlisted ? "text-red-500 fill-red-500" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>

              {/* Central Graphic */}
              <div className="transform group-hover:scale-105 transition-transform duration-300">
                {renderProductGraphic(product.id)}
              </div>
            </div>

            {/* Thumbnail Selector */}
            <div className="grid grid-cols-4 gap-3">
              {["Full Pack", "Nutritional", "Details", "Unboxing"].map((thumb, idx) => (
                <button
                  key={thumb}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  className={`border rounded-xl p-2.5 text-center text-xs transition cursor-pointer ${
                    activeImageIdx === idx
                      ? "border-2 border-[#fab528] bg-amber-50/30 shadow-xs font-bold text-gray-950"
                      : "border-gray-200 bg-white hover:bg-gray-50 text-gray-500"
                  }`}
                >
                  <div className="h-10 flex items-center justify-center text-lg">
                    {idx === 0 ? "📦" : idx === 1 ? "🥗" : idx === 2 ? "🔍" : "🚚"}
                  </div>
                  <span className="text-[10px] block truncate">{thumb}</span>
                </button>
              ))}
            </div>

            {/* Guarantees Box */}
            <div className="bg-gray-50/70 border border-gray-200 rounded-xl p-4 grid grid-cols-3 gap-2 text-center text-[11px] text-gray-600">
              <div className="space-y-1">
                <span className="text-base block">🚚</span>
                <span className="font-bold text-gray-900 block">Fast 2h Delivery</span>
                <span>Chilled cold-chain</span>
              </div>
              <div className="space-y-1 border-x border-gray-200 px-1">
                <span className="text-base block">🔒</span>
                <span className="font-bold text-gray-900 block">100% Guaranteed</span>
                <span>Freshness or refund</span>
              </div>
              <div className="space-y-1">
                <span className="text-base block">🌿</span>
                <span className="font-bold text-gray-900 block">Quality Source</span>
                <span>Verified farms</span>
              </div>
            </div>
          </div>

          {/* RIGHT: PRICING & PURCHASING (col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Title & Brand */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/60 px-2.5 py-0.5 rounded">
                  {product.brand}
                </span>
                <Badge variant={product.inStock ? "instock" : "outstock"}>
                  {product.inStock ? `In Stock (${product.stockCount} left)` : "Out of Stock"}
                </Badge>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 mt-2 leading-tight">
                {product.name}
              </h1>

              {/* Star Reviews & Sold Counter */}
              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="flex text-amber-400 text-sm">★★★★★</div>
                  <span className="font-bold text-gray-900">{product.rating.toFixed(1)}</span>
                  <a
                    href="#reviews"
                    onClick={() => setActiveTab("reviews")}
                    className="text-gray-500 hover:text-amber-600 underline ml-1"
                  >
                    ({product.reviewCount} customer reviews)
                  </a>
                </div>
                <span className="text-gray-300">•</span>
                <span className="text-gray-500">
                  Sold: <strong className="text-gray-900">{product.soldCount}/{product.totalStock}</strong>
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-500">Unit: {product.unit}</span>
              </div>
            </div>

            {/* Price & Savings Display */}
            <div className="bg-[#fffdfa] border border-amber-200/80 rounded-2xl p-5 space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-gray-950">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-base text-gray-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                {product.discountPercent > 0 && (
                  <span className="bg-[#ff4d4f] text-white font-bold text-xs px-2 py-0.5 rounded shadow-xs">
                    Save ${(product.originalPrice - product.price).toFixed(2)} ({product.discountPercent}%)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-500">
                Inclusive of all taxes. Free shipping on orders over $99.
              </p>
            </div>

            {/* Package Size Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-900 block">Select Quantity Option:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {packOptions.map((opt) => {
                  const isSelected = selectedPack === opt.label;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setSelectedPack(opt.label)}
                      className={`border p-3 rounded-xl text-left transition cursor-pointer relative ${
                        isSelected
                          ? "border-2 border-[#fab528] bg-amber-50/20 shadow-xs"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      {opt.discount && (
                        <span className="absolute top-2 right-2 bg-red-100 text-red-700 font-bold text-[9px] px-1.5 py-0.5 rounded">
                          {opt.discount}
                        </span>
                      )}
                      <p className={`text-xs font-bold ${isSelected ? "text-gray-950" : "text-gray-800"}`}>
                        {opt.label}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{opt.sub}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Stepper & Add to Cart Section */}
            <div className="p-5 border border-gray-200 rounded-2xl bg-white shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-gray-800 block">Quantity:</span>
                  <QuantityStepper
                    value={qty}
                    onChange={setQty}
                    min={1}
                    max={product.stockCount}
                    size="lg"
                  />
                </div>

                <div className="text-right sm:border-l sm:border-gray-100 sm:pl-6">
                  <span className="text-[11px] text-gray-400 block">Total Calculation</span>
                  <span className="text-2xl font-black text-gray-950 block">
                    ${(product.price * qty).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="sm:col-span-8 bg-[#fab528] hover:bg-[#e5a420] active:bg-[#c98f16] text-gray-950 font-bold py-3 px-6 rounded-xl text-sm transition shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>+ Add to Cart • ${(product.price * qty).toFixed(2)}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleAddToCart();
                    showToast("Proceeding to Express Checkout...");
                  }}
                  className="sm:col-span-4 bg-gray-950 hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition shadow-sm flex items-center justify-center cursor-pointer"
                >
                  Buy Now ⚡
                </button>
              </div>

              {/* Free Shipping Progress Calculator */}
              <FreeShippingBar currentAmount={product.price * qty} threshold={99} />
            </div>

            {/* Member Voucher Offer Trigger */}
            <div className="bg-gradient-to-r from-orange-50 via-amber-50/60 to-transparent border border-orange-200/80 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎁</span>
                <div>
                  <p className="text-xs font-bold text-gray-900">
                    Get 15% OFF for New Members!
                  </p>
                  <p className="text-[11px] text-gray-600">
                    Use coupon code <code className="font-mono bg-white border border-amber-300 font-bold px-1.5 py-0.5 rounded text-amber-800">FARMARTNEW15</code> at checkout.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCouponModalOpen(true)}
                className="bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 font-bold text-xs px-3.5 py-1.5 rounded-lg transition shadow-xs whitespace-nowrap cursor-pointer"
              >
                Claim Coupon
              </button>
            </div>
          </div>
        </section>

        {/* PRODUCT DETAILS TABS SECTION */}
        <section className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 overflow-x-auto bg-gray-50/70">
            {(
              [
                { id: "desc", label: "Description & Details" },
                { id: "nutrition", label: "Nutrition & Specifications" },
                { id: "reviews", label: `Reviews (${product.reviewCount})` },
                { id: "shipping", label: "Shipping & Freshness Policy" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3.5 text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border-b-2 ${
                  activeTab === tab.id
                    ? "border-[#fab528] bg-white text-gray-950"
                    : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div className="p-6 sm:p-8 text-xs text-gray-700 leading-relaxed">
            {/* Tab 1: Description */}
            {activeTab === "desc" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-gray-950 mb-2">About This Product</h3>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-4xl">
                    {product.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                    Key Highlights & Features
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span className="text-gray-800">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400 block font-medium">Origin</span>
                    <span className="font-bold text-gray-900">{product.origin}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Shelf Life</span>
                    <span className="font-bold text-gray-900">{product.shelfLife}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Category</span>
                    <span className="font-bold text-gray-900">{product.category}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Nutrition & Specifications */}
            {activeTab === "nutrition" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-gray-950 mb-2">Nutritional Facts & Labelling</h3>
                  <p className="text-xs text-gray-500 mb-4">Values based on serving size: {product.nutritionFacts.servingSize}</p>
                </div>

                <div className="max-w-md border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                  <div className="bg-gray-100/70 p-3 font-bold text-gray-900 flex justify-between">
                    <span>Serving Size</span>
                    <span>{product.nutritionFacts.servingSize}</span>
                  </div>
                  <div className="p-3 flex justify-between">
                    <span>Calories</span>
                    <span className="font-bold text-gray-900">{product.nutritionFacts.calories}</span>
                  </div>
                  <div className="p-3 flex justify-between">
                    <span>Total Fat</span>
                    <span className="font-bold text-gray-900">{product.nutritionFacts.fat}</span>
                  </div>
                  <div className="p-3 flex justify-between">
                    <span>Total Carbohydrates</span>
                    <span className="font-bold text-gray-900">{product.nutritionFacts.carbs}</span>
                  </div>
                  <div className="p-3 flex justify-between">
                    <span>Protein</span>
                    <span className="font-bold text-gray-900">{product.nutritionFacts.protein}</span>
                  </div>
                  <div className="p-3 flex justify-between">
                    <span>Sodium</span>
                    <span className="font-bold text-gray-900">{product.nutritionFacts.sodium}</span>
                  </div>
                </div>

                <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 max-w-2xl">
                  <h4 className="font-bold text-amber-950 mb-1">Storage Instructions:</h4>
                  <p className="text-amber-900">{product.storageInstructions}</p>
                </div>
              </div>
            )}

            {/* Tab 3: Reviews */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-base font-bold text-gray-950">Customer Reviews</h3>
                    <p className="text-xs text-gray-500">Overall Rating: {product.rating.toFixed(1)} out of 5.0 ({product.reviewCount} reviews)</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(true)}
                    className="bg-[#fab528] hover:bg-[#e5a420] text-gray-950 font-bold px-4 py-2 rounded-lg text-xs transition shadow-xs cursor-pointer"
                  >
                    ✍️ Write a Customer Review
                  </button>
                </div>

                {/* Review Cards */}
                <div className="space-y-4">
                  {product.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{rev.author}</span>
                          {rev.verified && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded flex items-center gap-1">
                              <span>✓</span> Verified Buyer
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400">{rev.date}</span>
                      </div>

                      <div className="flex text-amber-400 text-xs">
                        {"★".repeat(rev.rating)}
                      </div>

                      <h4 className="font-bold text-gray-900 text-xs">{rev.title}</h4>
                      <p className="text-gray-600 text-xs">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Shipping Policy */}
            {activeTab === "shipping" && (
              <div className="space-y-4 max-w-3xl">
                <h3 className="text-base font-bold text-gray-950 mb-2">Shipping, Returns & Cold Chain Guarantee</h3>
                <div className="space-y-3 text-xs text-gray-600 leading-relaxed">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-1">⚡ 2-Hour Express Delivery</h4>
                    <p>Orders placed before 4:00 PM are delivered same-day in insulated cold-totes to keep beverages ice cold and perishables ultra-fresh.</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-1">🚚 Free Delivery Threshold</h4>
                    <p>Free standard delivery applies to all grocery baskets totaling $99 or more. A flat $4.99 delivery fee applies to smaller baskets.</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-1">↩️ 30-Day Freshness Guarantee</h4>
                    <p>If you are not 100% satisfied with the condition or taste of your grocery item, simply take a photo and receive an immediate credit or replacement.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* RELATED PRODUCTS SECTION */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-950 tracking-tight">
                Frequently Bought Together
              </h2>
              <p className="text-xs text-gray-500">Popular items paired by Farmart customers</p>
            </div>
            <Link href="/" className="text-xs text-amber-700 hover:text-amber-800 font-bold">
              View All Catalog &gt;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {product.relatedProductIds.map((relId) => {
              const rel = PRODUCTS[relId];
              if (!rel) return null;
              return (
                <Link
                  key={rel.id}
                  href={`/product/${rel.id}`}
                  className="bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="h-40 w-full flex items-center justify-center bg-gray-50 rounded-xl mb-3 overflow-hidden group-hover:scale-105 transition-transform">
                      {renderProductGraphic(rel.id)}
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">{rel.brand}</span>
                    <h3 className="text-xs font-bold text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors mt-0.5">
                      {rel.name}
                    </h3>
                    <div className="flex text-amber-400 text-xs mt-1">{"★".repeat(5)}</div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-black text-gray-950">${rel.price.toFixed(2)}</span>
                      {rel.originalPrice > rel.price && (
                        <span className="text-[11px] text-gray-400 line-through ml-1.5">
                          ${rel.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-amber-700 font-bold group-hover:translate-x-1 transition-transform">
                      View Details →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      {/* STICKY BOTTOM QUICK ADD BAR */}
      {showStickyBar && (
        <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-gray-200 py-3 px-4 z-40 shadow-2xl animate-fade-in">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl hidden sm:flex">
                🛍️
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-950 truncate max-w-[200px] sm:max-w-md">
                  {product.name}
                </h4>
                <p className="text-[11px] font-black text-gray-900">
                  ${product.price.toFixed(2)}{" "}
                  <span className="font-normal text-gray-400">/ {product.unit}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <QuantityStepper value={qty} onChange={setQty} size="sm" />
              <button
                type="button"
                onClick={handleAddToCart}
                className="bg-[#fab528] hover:bg-[#e5a420] text-gray-950 font-bold px-5 py-2 rounded-lg text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span>+ Add to Cart</span>
                <span>• ${(product.price * qty).toFixed(2)}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIALOG 1: CLAIM COUPON MODAL */}
      <Dialog
        isOpen={couponModalOpen}
        onClose={() => setCouponModalOpen(false)}
        title="🎁 Claim 15% OFF Member Voucher"
        description="Exclusive discount valid on your entire Farmart grocery basket."
        maxWidth="md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setCouponModalOpen(false)}
              className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-lg text-xs font-semibold"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                setCouponModalOpen(false);
                showToast("Voucher code FARMARTNEW15 copied and applied!");
              }}
              className="px-5 py-2 bg-[#fab528] hover:bg-[#e5a420] text-gray-950 rounded-lg text-xs font-bold transition shadow-xs"
            >
              Apply Code at Checkout
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-center space-y-1">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest">
              Coupon Code
            </span>
            <div className="font-mono text-xl font-black text-gray-950 tracking-wider">
              FARMARTNEW15
            </div>
            <p className="text-[11px] text-gray-500">Takes 15% off any order over $30 for new members</p>
          </div>
          <p className="text-xs text-gray-600">
            This coupon code will be automatically populated in your shopping cart drawer when you proceed to checkout.
          </p>
        </div>
      </Dialog>

      {/* DIALOG 2: WRITE REVIEW MODAL */}
      <Dialog
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title={`Review ${product.name}`}
        description="Share your experience with other Farmart grocery shoppers."
        maxWidth="md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setReviewModalOpen(false)}
              className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-lg text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setReviewModalOpen(false);
                showToast("Thank you! Your verified review has been submitted.");
              }}
              className="px-5 py-2 bg-[#fab528] hover:bg-[#e5a420] text-gray-950 rounded-lg text-xs font-bold transition shadow-xs"
            >
              Submit Review
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">Your Name</label>
            <input
              type="text"
              placeholder="e.g. Emily Clark"
              value={newReviewAuthor}
              onChange={(e) => setNewReviewAuthor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">Rating</label>
            <div className="flex gap-1 text-amber-400 text-lg cursor-pointer">
              ★★★★★
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">Your Comments</label>
            <textarea
              rows={3}
              placeholder="Tell us about the freshness, packaging, and taste..."
              value={newReviewComment}
              onChange={(e) => setNewReviewComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </Dialog>

      {/* FOOTER */}
      <footer className="mt-20 border-t border-gray-100 bg-gray-50/50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© 2026 Farmart Grocery. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-gray-600 transition-colors">Storefront Home</Link>
            <Link href="/design" className="hover:text-gray-600 transition-colors">Design System (/design)</Link>
            <Link href="/overview" className="hover:text-amber-700 transition-colors">Project Overview</Link>
            <a href="http://localhost:6006" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">Storybook (6006)</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-800 flex flex-col font-sans animate-pulse">
      {/* Top Header Placeholder */}
      <div className="bg-white border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="h-8 w-32 bg-gray-200 rounded-lg" />
          <div className="h-8 w-64 bg-gray-100 rounded-lg hidden sm:block" />
          <div className="h-8 w-24 bg-gray-200 rounded-lg" />
        </div>
      </div>
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="h-4 w-48 bg-gray-200 rounded mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="lg:col-span-5 h-[420px] bg-gray-100 rounded-2xl" />
          <div className="lg:col-span-7 space-y-4">
            <div className="h-6 w-24 bg-amber-100 rounded-full" />
            <div className="h-8 w-3/4 bg-gray-200 rounded-lg" />
            <div className="h-4 w-1/3 bg-gray-100 rounded" />
            <div className="h-10 w-40 bg-gray-200 rounded-lg mt-4" />
            <div className="h-24 w-full bg-gray-50 rounded-xl" />
            <div className="h-12 w-48 bg-amber-400/50 rounded-xl" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ProductDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailContent params={params} />
    </Suspense>
  );
}

