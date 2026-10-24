"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import type { Category, DealsResponse, Banner, Brand, ProductSummary } from "@/lib/api-types";

function renderProductMockup(id: string) {
  if (id === "british-beef-mince") {
    return (
      <svg viewBox="0 0 120 120" className="w-24 h-24 drop-shadow">
        <rect x="15" y="25" width="90" height="70" rx="6" fill="#1F2937" />
        <rect x="20" y="30" width="80" height="60" rx="4" fill="#DC2626" />
        <circle cx="35" cy="45" r="2" fill="#FECACA" />
        <circle cx="65" cy="40" r="2.5" fill="#FECACA" />
        <circle cx="80" cy="55" r="2" fill="#FECACA" />
        <circle cx="45" cy="70" r="2.5" fill="#FECACA" />
        <circle cx="70" cy="75" r="2" fill="#FECACA" />
        <rect x="45" y="25" width="30" height="70" fill="#FEF3C7" fillOpacity="0.9" />
        <rect x="50" y="40" width="20" height="12" fill="#991B1B" rx="1" />
      </svg>
    );
  }
  if (id === "farmhouse-soft-white") {
    return (
      <svg viewBox="0 0 120 120" className="w-24 h-24 drop-shadow">
        <path d="M20 50C20 35 35 30 60 30C85 30 100 35 100 50V75C100 85 85 90 60 90C35 90 20 85 20 75V50Z" fill="#F5D061" stroke="#D4A017" strokeWidth="1.5" />
        <rect x="32" y="45" width="56" height="30" fill="#FFFFFF" rx="3" stroke="#E2E8F0" strokeWidth="1" />
        <text x="60" y="58" fontSize="7" fontWeight="bold" fill="#854D0E" textAnchor="middle">FARMART</text>
        <text x="60" y="68" fontSize="5" fontWeight="semibold" fill="#A16207" textAnchor="middle">FARMHOUSE</text>
      </svg>
    );
  }
  if (id === "blood-orange") {
    return (
      <svg viewBox="0 0 120 120" className="w-24 h-24 drop-shadow">
        <circle cx="75" cy="55" r="24" fill="#FB923C" stroke="#EA580C" strokeWidth="1.2" />
        <circle cx="75" cy="33" r="2" fill="#15803D" />
        <circle cx="45" cy="65" r="24" fill="#F97316" stroke="#C2410C" strokeWidth="1.5" />
        <circle cx="45" cy="65" r="20" fill="#EF4444" />
        <path d="M45 47 L45 83 M27 65 L63 65 M32 52 L58 78 M32 78 L58 52" stroke="#FEF2F2" strokeWidth="1.5" />
        <circle cx="45" cy="65" r="4" fill="#FEF2F2" />
      </svg>
    );
  }
  return (
    <div className="w-20 h-20 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl">
      🛒
    </div>
  );
}

export default function Home() {
  // State for interactive features
  const [beerQty, setBeerQty] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("Breads & Sweets");
  const [searchCategory, setSearchCategory] = useState("ALL CATEGORIES");
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(3);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Data fetched from SQLite backend API
  const [apiCategories, setApiCategories] = useState<Category[]>([]);
  const [apiDeals, setApiDeals] = useState<DealsResponse | null>(null);
  const [apiBanners, setApiBanners] = useState<Banner[]>([]);
  const [apiBrands, setApiBrands] = useState<Brand[]>([]);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ProductSummary[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Countdown timer: 05 : 25 : 37 default fallback
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 25,
    seconds: 37,
  });

  // Fetch initial homepage data from SQLite backend API
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Category[]) => setApiCategories(data))
      .catch((err) => console.error("Failed to load categories:", err));

    fetch("/api/deals")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: DealsResponse | null) => {
        if (data) setApiDeals(data);
      })
      .catch((err) => console.error("Failed to load deals:", err));

    fetch("/api/promotions/banners")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Banner[]) => setApiBanners(data))
      .catch((err) => console.error("Failed to load banners:", err));

    fetch("/api/brands/featured")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Brand[]) => setApiBrands(data))
      .catch((err) => console.error("Failed to load featured brands:", err));
  }, []);

  // Sync countdown timer with database endsAt
  useEffect(() => {
    if (!apiDeals?.endsAt) return;
    const calculateTimeLeft = () => {
      const diff = Math.max(0, new Date(apiDeals.endsAt).getTime() - Date.now());
      const totalSeconds = Math.floor(diff / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      setTimeLeft({ hours, minutes, seconds });
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [apiDeals?.endsAt]);

  // Click outside to close search popover
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search query against /api/products
  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) return;

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const catQuery =
          searchCategory !== "ALL CATEGORIES"
            ? `&category=${encodeURIComponent(searchCategory)}`
            : "";
        const res = await fetch(
          `/api/products?q=${encodeURIComponent(query)}${catQuery}&limit=6`
        );
        if (res.ok) {
          const json = await res.json();
          setSearchResults(json.data ?? []);
        }
      } catch (err) {
        console.error("Live search failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, searchCategory]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const categories = [
    {
      id: "fruits",
      name: "Fruits & Vegetables",
      icon: (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          {/* Pumpkin & Apple Illustration */}
          <path
            d="M32 10C24 10 16 16 16 26C16 38 24 46 32 46C40 46 48 38 48 26C48 16 40 10 32 10Z"
            fill="#FFA726"
            stroke="#E65100"
            strokeWidth="1.5"
          />
          <path
            d="M32 10C30 10 24 16 24 26C24 38 30 46 32 46C34 46 40 38 40 26C40 16 34 10 32 10Z"
            fill="#FFB74D"
            stroke="#E65100"
            strokeWidth="1.2"
          />
          <path
            d="M32 10V4C32 4 35 2 37 5C38 7 36 10 32 10Z"
            fill="#66BB6A"
            stroke="#2E7D32"
            strokeWidth="1.2"
          />
          <ellipse
            cx="44"
            cy="36"
            rx="12"
            ry="11"
            fill="#EF5350"
            stroke="#B71C1C"
            strokeWidth="1.2"
          />
          <path
            d="M44 25C44 25 46 22 48 23"
            stroke="#5D4037"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M48 23C49 22 52 22 52 24"
            stroke="#4CAF50"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      id: "breads",
      name: "Breads & Sweets",
      icon: (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          {/* Baguettes & Pastry */}
          <g transform="rotate(-30 32 32)">
            <rect
              x="12"
              y="26"
              width="40"
              height="12"
              rx="6"
              fill="#F5D061"
              stroke="#D4A017"
              strokeWidth="1.5"
            />
            <path
              d="M20 28L24 36M28 28L32 36M36 28L40 36"
              stroke="#D4A017"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>
          <g transform="rotate(25 38 34)">
            <rect
              x="18"
              y="28"
              width="34"
              height="10"
              rx="5"
              fill="#E5B94E"
              stroke="#B8860B"
              strokeWidth="1.5"
            />
            <path
              d="M25 30L28 36M33 30L36 36M41 30L44 36"
              stroke="#B8860B"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>
        </svg>
      ),
    },
    {
      id: "seafood",
      name: "Frozen Seafoods",
      icon: (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          {/* Crab illustration */}
          <ellipse
            cx="32"
            cy="36"
            rx="14"
            ry="11"
            fill="#FF7043"
            stroke="#D84315"
            strokeWidth="1.5"
          />
          {/* Crab eyes */}
          <circle cx="28" cy="27" r="2.5" fill="#333" />
          <circle cx="36" cy="27" r="2.5" fill="#333" />
          {/* Claws */}
          <path
            d="M20 32C15 28 12 18 18 16C23 14 24 23 20 28"
            fill="#FF7043"
            stroke="#D84315"
            strokeWidth="1.5"
          />
          <path
            d="M44 32C49 28 52 18 46 16C41 14 40 23 44 28"
            fill="#FF7043"
            stroke="#D84315"
            strokeWidth="1.5"
          />
          {/* Legs */}
          <path
            d="M18 38C13 41 12 47 14 49"
            stroke="#D84315"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M20 42C16 46 16 51 18 53"
            stroke="#D84315"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M46 38C51 41 52 47 50 49"
            stroke="#D84315"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M44 42C48 46 48 51 46 53"
            stroke="#D84315"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      id: "meats",
      name: "Raw Meats",
      icon: (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          {/* Steak cut */}
          <path
            d="M18 26C16 34 20 46 32 46C44 46 50 38 48 28C46 18 36 18 30 22C24 26 20 18 18 26Z"
            fill="#E57373"
            stroke="#C62828"
            strokeWidth="1.5"
          />
          {/* Bone */}
          <circle
            cx="36"
            cy="28"
            r="4.5"
            fill="#FFF9C4"
            stroke="#C62828"
            strokeWidth="1.2"
          />
          <circle cx="36" cy="28" r="1.5" fill="#C62828" />
          <path
            d="M24 33C27 38 31 40 37 40"
            stroke="#EF9A9A"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      id: "wines",
      name: "Wines & Alcohol Drinks",
      icon: (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          {/* Wine Bottle */}
          <path
            d="M24 16H28V24C28 27 22 29 22 36V48C22 50 24 52 26 52H32C34 52 36 50 36 48V36C36 29 30 27 30 24V16H34"
            stroke="#5D4037"
            strokeWidth="1.5"
            fill="#FFF3E0"
          />
          <rect
            x="24"
            y="35"
            width="10"
            height="11"
            fill="#EF5350"
            rx="1"
            stroke="#C62828"
            strokeWidth="1"
          />
          <path
            d="M26 13H32V16H26V13Z"
            fill="#C62828"
            stroke="#B71C1C"
            strokeWidth="1"
          />
          {/* Wine Glass */}
          <path
            d="M40 26C40 34 44 38 46 38C48 38 52 34 52 26H40Z"
            fill="#E57373"
            stroke="#C62828"
            strokeWidth="1.2"
          />
          <path d="M46 38V48M42 48H50" stroke="#5D4037" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      id: "coffee",
      name: "Coffees and Teas",
      icon: (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          {/* Coffee beans */}
          <g transform="rotate(-20 26 32)">
            <ellipse
              cx="26"
              cy="32"
              rx="9"
              ry="13"
              fill="#8D6E63"
              stroke="#4E342E"
              strokeWidth="1.5"
            />
            <path
              d="M26 21C28 26 24 37 26 43"
              stroke="#4E342E"
              strokeWidth="1.5"
            />
          </g>
          <g transform="rotate(35 42 34)">
            <ellipse
              cx="42"
              cy="34"
              rx="8"
              ry="12"
              fill="#A1887F"
              stroke="#4E342E"
              strokeWidth="1.5"
            />
            <path
              d="M42 24C44 28 40 38 42 44"
              stroke="#4E342E"
              strokeWidth="1.5"
            />
          </g>
        </svg>
      ),
    },
    {
      id: "dairy",
      name: "Milks and Dairies",
      icon: (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          {/* Milk Carton */}
          <path
            d="M18 24L26 18L34 24V50H18V24Z"
            fill="#E1F5FE"
            stroke="#0288D1"
            strokeWidth="1.5"
          />
          <path
            d="M26 18V13H24"
            stroke="#0288D1"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M21 34C24 33 28 35 31 34"
            stroke="#0288D1"
            strokeWidth="1.2"
          />
          {/* Bottle */}
          <path
            d="M38 28V24H44V28C47 30 48 34 48 38V50H34V38C34 34 35 30 38 28Z"
            fill="#FFF"
            stroke="#0288D1"
            strokeWidth="1.5"
          />
          <rect x="37" y="36" width="8" height="9" fill="#81D4FA" rx="1" />
        </svg>
      ),
    },
    {
      id: "pets",
      name: "Pet Foods",
      icon: (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          {/* Pet Food Bag */}
          <path
            d="M20 20L24 14H40L44 20V50C44 51 43 52 42 52H22C21 52 20 51 20 50V20Z"
            fill="#CFD8DC"
            stroke="#546E7A"
            strokeWidth="1.5"
          />
          {/* Paw print on bag */}
          <ellipse cx="32" cy="38" rx="4" ry="3.5" fill="#37474F" />
          <circle cx="26" cy="32" r="1.8" fill="#37474F" />
          <circle cx="31" cy="30" r="1.8" fill="#37474F" />
          <circle cx="35" cy="30" r="1.8" fill="#37474F" />
          <circle cx="39" cy="33" r="1.8" fill="#37474F" />
        </svg>
      ),
    },
  ];

  const mainHero = apiBanners.find((b) => b.placement === "hero-main");
  const sideHero = apiBanners.find((b) => b.placement === "hero-side");

  const featuredProduct: ProductSummary = apiDeals?.products.find(
    (p) => p.id === (apiDeals.featuredProductId ?? "ice-golds-beer")
  ) ?? apiDeals?.products[0] ?? {
    id: "ice-golds-beer",
    name: "Ice Gold's Beer 350ml x 24 Pieces",
    brand: "Brand Name",
    category: "Wines & Alcohol Drinks",
    categorySlug: "wines",
    price: 49.5,
    originalPrice: 58.0,
    discountPercent: 15,
    rating: 5.0,
    reviewCount: 3,
    unit: "350ml x 24 Pieces",
    inStock: true,
    stockCount: 20,
    soldCount: 20,
    totalStock: 40,
    isBestSeller: true,
    isTopSaver: true,
    isOrganic: false,
  };

  const centerProducts: ProductSummary[] = (apiDeals?.products ?? [])
    .filter((p) => p.id !== featuredProduct.id)
    .slice(0, 3);

  const featuredSoldRatio = Math.min(
    100,
    Math.round((featuredProduct.soldCount / (featuredProduct.totalStock || 1)) * 100)
  );

  const brand1Headline =
    apiBrands.find((b) => b.id === "foodpouch")?.headline ?? "New Snacks Release";
  const brand2Headline =
    apiBrands.find((b) => b.id === "tea365")?.headline ?? "Happy Tea 100% Organic, From $29.9";
  const brand3Headline =
    apiBrands.find((b) => b.id === "soda-brand")?.headline ?? "Soda Can Box 24 Pieces - 30% OFF";
  const brand4Headline =
    apiBrands.find((b) => b.id === "farmart")?.headline ?? "Fresh Meat Sausage, BUY 2 GET 1";

  return (
    <div className="min-h-screen bg-white text-gray-800 selection:bg-amber-100 selection:text-amber-900">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in border border-gray-700">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <header className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
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
          </div>

          {/* Search Box */}
          <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-2xl mx-6 items-center relative">
            <div className="w-full flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-xs focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400 transition-all">
              {/* Category Selector */}
              <div className="relative border-r border-gray-200">
                <button
                  type="button"
                  onClick={() => setSearchDropdownOpen(!searchDropdownOpen)}
                  className="px-3.5 py-2.5 text-xs font-semibold text-gray-700 flex items-center gap-1.5 hover:bg-gray-50 whitespace-nowrap"
                >
                  <span className="truncate max-w-[130px]">{searchCategory}</span>
                  <svg
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                      searchDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {searchDropdownOpen && (
                  <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-gray-100 rounded-lg shadow-xl z-40 py-1.5 max-h-60 overflow-y-auto">
                    {[
                      "ALL CATEGORIES",
                      ...(apiCategories.length > 0
                        ? apiCategories.map((c) => c.name)
                        : [
                            "Fruits & Vegetables",
                            "Breads & Sweets",
                            "Frozen Seafoods",
                            "Raw Meats",
                            "Wines & Alcohol Drinks",
                            "Coffees and Teas",
                            "Milks and Dairies",
                            "Pet Foods",
                          ]),
                    ].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setSearchCategory(item);
                          setSearchDropdownOpen(false);
                          setSearchFocused(true);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-amber-50 hover:text-amber-800 ${
                          searchCategory === item
                            ? "bg-amber-50/70 font-bold text-amber-900"
                            : "text-gray-700"
                        }`}
                      >
                        <span className="truncate">{item}</span>
                        {item !== "ALL CATEGORIES" && (
                          <span className="text-[10px] text-gray-400 ml-2">
                            {apiCategories.find((c) => c.name === item)?.productCount ?? ""}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Input */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  setSearchFocused(true);
                  if (!val.trim()) {
                    setSearchResults([]);
                    setIsSearching(false);
                  }
                }}
                onFocus={() => setSearchFocused(true)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setSearchFocused(false);
                  }
                }}
                placeholder="I'm searching for... (e.g. beer, beef, bread, orange)"
                className="w-full px-4 py-2.5 text-xs text-gray-800 placeholder-gray-400 outline-none"
              />

              {/* Clear button */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="px-2 text-gray-400 hover:text-gray-600 text-xs"
                  title="Clear search"
                >
                  ✕
                </button>
              )}

              {/* Search Icon Button */}
              <button
                type="button"
                onClick={() => setSearchFocused(true)}
                className="px-4 py-2.5 text-gray-500 hover:text-gray-900 transition-colors"
                title="Search"
              >
                {isSearching ? (
                  <svg
                    className="w-4 h-4 animate-spin text-amber-500"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.2}
                      d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Floating Live Search Results Dropdown */}
            {searchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-gray-100">
                <div className="px-4 py-2 bg-gray-50/80 flex items-center justify-between text-[11px] text-gray-500 font-medium">
                  <span>
                    {isSearching
                      ? "Searching SQLite database..."
                      : `Found ${searchResults.length} product${
                          searchResults.length === 1 ? "" : "s"
                        } for "${searchQuery}"`}
                  </span>
                  {searchCategory !== "ALL CATEGORIES" && (
                    <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                      in {searchCategory}
                    </span>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                  {searchResults.map((item) => (
                    <Link
                      key={item.id}
                      href={`/product/${item.id}`}
                      onClick={() => setSearchFocused(false)}
                      className="p-3 flex items-center justify-between hover:bg-amber-50/50 transition-colors group cursor-pointer block"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-lg shrink-0">
                          {item.id === "ice-golds-beer"
                            ? "🍺"
                            : item.id === "british-beef-mince"
                            ? "🥩"
                            : item.id === "farmhouse-soft-white"
                            ? "🍞"
                            : item.id === "blood-orange"
                            ? "🍊"
                            : "🛒"}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                            {item.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-gray-500">
                            <span className="font-medium text-gray-600">{item.brand}</span>
                            <span>•</span>
                            <span className="text-gray-400">{item.category}</span>
                            <span>•</span>
                            <span className="text-amber-500 font-semibold">
                              ★ {item.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0 pl-3">
                        <div className="flex items-baseline gap-1.5 justify-end">
                          <span className="text-xs font-bold text-gray-900">
                            ${item.price.toFixed(2)}
                          </span>
                          {item.originalPrice > item.price && (
                            <span className="text-[10px] text-gray-400 line-through">
                              ${item.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        {item.inStock ? (
                          <span className="inline-block mt-0.5 text-[9px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                            In Stock ({item.stockCount})
                          </span>
                        ) : (
                          <span className="inline-block mt-0.5 text-[9px] font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}

                  {!isSearching && searchResults.length === 0 && (
                    <div className="p-6 text-center text-gray-400 text-xs">
                      <p className="text-2xl mb-1">🔍</p>
                      <p className="font-semibold text-gray-700">No products found</p>
                      <p className="text-[11px] mt-0.5">
                        Try searching for &quot;beer&quot;, &quot;beef&quot;, &quot;bread&quot;, or
                        &quot;orange&quot;
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Header: Phone & Actions */}
          <div className="flex items-center gap-6">
            {/* Phone contact */}
            <div className="hidden xl:flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-[#fab528]">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 leading-none">
                  8 800 332 65-66
                </p>
                <p className="text-[10px] text-gray-400 mt-1 leading-none">
                  Support 24/7
                </p>
              </div>
            </div>

            {/* Account Icon */}
            <button
              type="button"
              className="p-1.5 text-gray-700 hover:text-amber-500 transition-colors"
              title="User Account"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>

            {/* Wishlist */}
            <button
              type="button"
              onClick={() => setWishlistCount((c) => c + 1)}
              className="relative p-1.5 text-gray-700 hover:text-amber-500 transition-colors"
              title="Wishlist"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span className="absolute -top-1 -right-1 bg-[#fab528] text-gray-900 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            </button>

            {/* Cart */}
            <div
              onClick={() => showToast("Cart contains 3 items totaling $2,450.59")}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="relative p-1.5 text-gray-700 group-hover:text-amber-500 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <span className="absolute -top-1 -right-1 bg-[#fab528] text-gray-900 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-[10px] text-gray-400 leading-none">Your Cart</p>
                <p className="text-xs font-bold text-gray-900 mt-0.5 leading-none group-hover:text-amber-600 transition-colors">
                  $2,450.59
                </p>
              </div>
            </div>

            {/* Link to Design System Showcase */}
            <a
              href="/design"
              className="hidden lg:inline-flex items-center gap-1.5 bg-amber-100/70 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs px-3 py-1.5 rounded-md transition-all shadow-xs"
              title="View Farmart Design System Showcase"
            >
              <span>🎨</span>
              <span>Design System</span>
            </a>
          </div>
        </div>
      </header>

      {/* SECONDARY NAVIGATION BAR */}
      <nav className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-6 overflow-x-auto py-2.5">
            {/* Shop by category button */}
            <button
              type="button"
              className="bg-[#fab528] hover:bg-[#e5a420] text-gray-900 px-4 py-2.5 rounded font-bold flex items-center gap-2 tracking-wide uppercase text-xs transition-colors shadow-xs whitespace-nowrap cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <span>SHOP BY CATEGORY</span>
            </button>

            {/* Nav links */}
            <div className="flex items-center gap-5 text-gray-700 whitespace-nowrap">
              <a
                href="#deals"
                className="flex items-center gap-1 font-semibold text-gray-900 hover:text-amber-600 transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5 text-amber-500 fill-amber-500"
                  viewBox="0 0 20 20"
                >
                  <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
                </svg>
                <span>Deals Today</span>
              </a>

              <a
                href="#special"
                className="hover:text-amber-600 transition-colors"
              >
                Special Prices
              </a>

              {["Fresh", "Frozen", "Demos", "Shop", "Blog", "Pages", "Shop"].map(
                (item, idx) => (
                  <button
                    key={`${item}-${idx}`}
                    type="button"
                    className="flex items-center gap-1 hover:text-amber-600 transition-colors cursor-pointer"
                  >
                    <span>{item}</span>
                    <svg
                      className="w-3 h-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Recently Viewed */}
          <div className="hidden lg:flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer whitespace-nowrap pl-4">
            <svg
              className="w-3.5 h-3.5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-xs">Recently Viewed</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
        {/* HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Hero Card (Left ~68%) */}
          <div className="lg:col-span-8 bg-gradient-to-br from-[#ebf1f5] via-[#e2ebf1] to-[#d9e4eb] rounded-2xl p-8 sm:p-10 relative overflow-hidden flex flex-col justify-between min-h-[340px]">
            {/* Soft decorative background circles */}
            <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-white/30 blur-2xl pointer-events-none"></div>

            <div className="max-w-xs sm:max-w-sm z-10">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
                {mainHero?.title ?? "Active Summer With Juice Milk 300ml"}
              </h1>
              <p className="mt-3 text-xs sm:text-sm text-gray-600 leading-relaxed">
                {mainHero?.subtitle ??
                  "New arrivals with milkshake, fruits, juice drinks, essential for summer."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("juice");
                  setSearchFocused(true);
                  showToast(`Shopping ${mainHero?.title ?? "Active Summer Juice Milk"}!`);
                }}
                className="mt-6 inline-flex items-center px-6 py-2.5 bg-white text-gray-900 font-bold text-xs rounded-full shadow-sm hover:shadow hover:bg-gray-50 transition-all cursor-pointer"
              >
                {mainHero?.ctaLabel ?? "Shop Now"}
              </button>
            </div>

            {/* Juice Carton Mockup Vector Visual */}
            <div className="absolute right-2 sm:right-6 bottom-4 sm:bottom-6 w-52 sm:w-80 h-52 sm:h-72 pointer-events-none flex items-center justify-center">
              <svg viewBox="0 0 320 280" className="w-full h-full drop-shadow-xl">
                {/* Background Shadow */}
                <ellipse
                  cx="170"
                  cy="245"
                  rx="100"
                  ry="20"
                  fill="#94a3b8"
                  fillOpacity="0.25"
                />

                {/* Carton 1 (Tilted Milk/Juice Carton) */}
                <g transform="translate(60, 20) rotate(18 100 120)">
                  {/* Front Face */}
                  <polygon
                    points="60,60 140,55 140,210 60,205"
                    fill="#FFFFFF"
                    stroke="#CBD5E1"
                    strokeWidth="1"
                  />
                  {/* Top slanted gable face */}
                  <polygon
                    points="60,60 100,20 140,55"
                    fill="#F1F5F9"
                  />
                  {/* Side face */}
                  <polygon
                    points="140,55 190,40 190,195 140,210"
                    fill="#E2E8F0"
                  />
                  {/* Top side gable */}
                  <polygon
                    points="140,55 100,20 150,10 190,40"
                    fill="#CBD5E1"
                  />
                  {/* Gable fin */}
                  <polygon
                    points="95,15 145,5 145,10 95,20"
                    fill="#94A3B8"
                  />

                  {/* Artwork on front face: Orange & juice branding */}
                  <circle cx="100" cy="140" r="28" fill="#FB923C" />
                  <ellipse cx="100" cy="140" rx="24" ry="24" fill="#FDBA74" />
                  <path
                    d="M100 116 L100 164 M76 140 L124 140 M83 123 L117 157 M83 157 L117 123"
                    stroke="#FFF"
                    strokeWidth="2.5"
                  />
                  <rect
                    x="75"
                    y="75"
                    width="50"
                    height="10"
                    rx="2"
                    fill="#0284C7"
                  />
                  <text
                    x="100"
                    y="83"
                    fontSize="7"
                    fontFamily="sans-serif"
                    fontWeight="bold"
                    fill="#FFFFFF"
                    textAnchor="middle"
                  >
                    MOCKUP
                  </text>
                  <text
                    x="100"
                    y="185"
                    fontSize="11"
                    fontFamily="sans-serif"
                    fontWeight="bold"
                    fill="#0F172A"
                    textAnchor="middle"
                  >
                    juice
                  </text>
                </g>

                {/* Carton 2 (Horizontal Foreground angled carton) */}
                <g transform="translate(100, 70) rotate(-28 120 130)">
                  {/* Front/Top Panel */}
                  <polygon
                    points="40,90 170,50 160,150 30,190"
                    fill="#FFFFFF"
                    stroke="#CBD5E1"
                    strokeWidth="1"
                  />
                  {/* Left Side */}
                  <polygon
                    points="30,190 20,200 10,180 30,150 40,90"
                    fill="#E2E8F0"
                  />
                  {/* Bottom Side Panel */}
                  <polygon
                    points="30,190 160,150 170,180 40,220"
                    fill="#F59E0B"
                  />

                  {/* Big Stylized "Juice" typography and orange slice */}
                  <text
                    x="95"
                    y="135"
                    fontSize="24"
                    fontFamily="sans-serif"
                    fontWeight="900"
                    fill="#1E293B"
                    transform="rotate(-17 95 135)"
                  >
                    juice
                  </text>
                  <circle cx="120" cy="85" r="22" fill="#F97316" />
                  <circle cx="120" cy="85" r="18" fill="#FDBA74" />
                </g>
              </svg>
            </div>

            {/* Carousel navigation indicators */}
            <div className="z-10 flex items-center gap-1.5 self-end mt-4">
              <span className="w-5 h-5 rounded bg-[#fab528] text-gray-950 font-bold text-[10px] flex items-center justify-center cursor-pointer">
                1
              </span>
              <span className="w-5 h-5 rounded bg-white/80 hover:bg-white text-gray-700 font-bold text-[10px] flex items-center justify-center cursor-pointer shadow-xs">
                2
              </span>
            </div>
          </div>

          {/* Right Hero Banner (Yellow 20% SALE OFF ~32%) */}
          <div className="lg:col-span-4 bg-[#fab528] rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between min-h-[340px]">
            {/* Background subtle burst */}
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/20 blur-xl pointer-events-none"></div>

            <div className="z-10">
              <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
                {sideHero?.title ?? "20% SALE OFF"}
              </h2>
              <div className="mt-2 text-xs text-gray-800 space-y-0.5">
                <p className="whitespace-pre-line">{sideHero?.subtitle ?? "Synthetic seeds\nNet 2.0 OZ"}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("seeds");
                  setSearchFocused(true);
                  showToast(`Shopping ${sideHero?.title ?? "20% Sale Off Seeds"}!`);
                }}
                className="mt-6 inline-flex items-center px-6 py-2.5 bg-white text-gray-950 font-bold text-xs rounded-full shadow-sm hover:shadow hover:bg-gray-50 transition-all cursor-pointer"
              >
                {sideHero?.ctaLabel ?? "Shop Now"}
              </button>
            </div>

            {/* Food Box Mockup Graphic */}
            <div className="absolute right-0 bottom-2 w-48 sm:w-56 h-48 sm:h-56 pointer-events-none flex items-end justify-end">
              <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-xl">
                {/* Shadow */}
                <ellipse
                  cx="120"
                  cy="200"
                  rx="70"
                  ry="15"
                  fill="#78350F"
                  fillOpacity="0.2"
                />

                {/* 3D Angled Food Box */}
                <g transform="translate(30, 20) rotate(12 100 100)">
                  {/* Front Face */}
                  <polygon
                    points="40,80 130,50 130,160 40,180"
                    fill="#FFFFFF"
                  />
                  {/* Right Face */}
                  <polygon
                    points="130,50 190,80 190,175 130,160"
                    fill="#F1F5F9"
                  />
                  {/* Top Lid Flap */}
                  <polygon
                    points="40,80 90,30 190,50 130,50"
                    fill="#E2E8F0"
                  />

                  {/* Leaf / Brand on Box */}
                  <circle cx="160" cy="115" r="14" fill="#22C55E" />
                  <path
                    d="M154 115C154 110 160 105 166 107C166 112 162 118 154 115Z"
                    fill="#FFFFFF"
                  />
                  <text
                    x="160"
                    y="142"
                    fontSize="11"
                    fontFamily="sans-serif"
                    fontWeight="bold"
                    fill="#1E293B"
                    textAnchor="middle"
                  >
                    FOOD
                  </text>
                  <text
                    x="160"
                    y="154"
                    fontSize="10"
                    fontFamily="sans-serif"
                    fontWeight="bold"
                    fill="#64748B"
                    textAnchor="middle"
                  >
                    BOX
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </section>

        {/* BROWSE BY CATEGORY */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                Browse by Category
              </h2>
              <a
                href="#all-categories"
                className="text-xs text-gray-400 hover:text-amber-600 transition-colors"
              >
                All Categories &gt;
              </a>
            </div>
            {/* Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                className="w-6 h-6 rounded border border-gray-200 text-gray-400 hover:text-gray-800 hover:border-gray-400 flex items-center justify-center transition-colors cursor-pointer text-xs"
              >
                &lt;
              </button>
              <button
                type="button"
                className="w-6 h-6 rounded bg-[#fab528] text-gray-950 font-bold flex items-center justify-center hover:bg-amber-400 transition-colors cursor-pointer text-xs"
              >
                &gt;
              </button>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              const count = apiCategories.find(
                (c) => c.id === cat.id || c.name === cat.name
              )?.productCount;
              return (
                <div
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setSearchCategory(cat.name);
                    showToast(
                      `Selected category: ${cat.name}${
                        count !== undefined ? ` (${count} in database)` : ""
                      }`
                    );
                  }}
                  className={`bg-white rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "border-2 border-[#fab528] shadow-lg -translate-y-1 bg-amber-50/20"
                      : "border border-gray-100 hover:border-gray-200 hover:shadow-md"
                  }`}
                >
                  <div className="h-14 flex items-center justify-center mb-2">
                    {cat.icon}
                  </div>
                  <span
                    className={`text-xs font-semibold leading-snug line-clamp-2 ${
                      isSelected ? "text-gray-950 font-bold" : "text-gray-700"
                    }`}
                  >
                    {cat.name}
                  </span>
                  {count !== undefined && count > 0 && (
                    <span className="text-[10px] text-amber-800 font-bold bg-amber-100/80 px-1.5 py-0.5 rounded-full mt-1.5">
                      {count} item{count > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* FEATURED BRANDS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                Featured Brands
              </h2>
              <a
                href="#all-offers"
                className="text-xs text-gray-400 hover:text-amber-600 transition-colors"
              >
                All Offers &gt;
              </a>
            </div>
            {/* Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                className="w-6 h-6 rounded border border-gray-200 text-gray-400 hover:text-gray-800 hover:border-gray-400 flex items-center justify-center transition-colors cursor-pointer text-xs"
              >
                &lt;
              </button>
              <button
                type="button"
                className="w-6 h-6 rounded border border-gray-200 text-gray-400 hover:text-gray-800 hover:border-gray-400 flex items-center justify-center transition-colors cursor-pointer text-xs"
              >
                &gt;
              </button>
            </div>
          </div>

          {/* 4 Brand Promo Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Brand 1: Food Pouch */}
            <div
              onClick={() => {
                setSearchQuery("snacks");
                setSearchFocused(true);
                showToast(`Browsing ${brand1Headline}`);
              }}
              className="group cursor-pointer"
            >
              <div className="bg-[#f0edf5] rounded-xl p-6 h-48 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-[1.02]">
                {/* Purple Standup Pouch Illustration */}
                <svg viewBox="0 0 160 160" className="w-32 h-32 drop-shadow-md">
                  <path
                    d="M45 35L52 25H108L115 35L120 120C120 130 110 135 80 135C50 135 40 130 40 120L45 35Z"
                    fill="#6B46C1"
                    stroke="#553C9A"
                    strokeWidth="1.5"
                  />
                  {/* Seal Notch & Zip Top */}
                  <line
                    x1="46"
                    y1="40"
                    x2="114"
                    y2="40"
                    stroke="#D6BCFA"
                    strokeWidth="1.5"
                  />
                  {/* Pouch Label */}
                  <rect
                    x="56"
                    y="55"
                    width="48"
                    height="32"
                    rx="4"
                    fill="#FAF5FF"
                  />
                  <text
                    x="80"
                    y="70"
                    fontSize="9"
                    fontWeight="bold"
                    fill="#553C9A"
                    textAnchor="middle"
                  >
                    FOOD
                  </text>
                  <text
                    x="80"
                    y="80"
                    fontSize="7"
                    fontWeight="semibold"
                    fill="#D97706"
                    textAnchor="middle"
                  >
                    POUCH
                  </text>
                  {/* Snack illustration */}
                  <circle cx="80" cy="104" r="10" fill="#F59E0B" />
                  <circle cx="80" cy="104" r="7" fill="#FBBF24" />
                </svg>
              </div>
              <div className="mt-2.5">
                <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                  FOODPOUCH
                </p>
                <h3 className="text-xs font-semibold text-gray-900 mt-0.5 group-hover:text-amber-600 transition-colors">
                  {brand1Headline}
                </h3>
              </div>
            </div>

            {/* Brand 2: Happy Tea */}
            <div
              onClick={() => {
                setSearchQuery("tea");
                setSearchFocused(true);
                showToast(`Browsing ${brand2Headline}`);
              }}
              className="group cursor-pointer"
            >
              <div className="bg-[#f6f4ec] rounded-xl p-6 h-48 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-[1.02]">
                {/* Tea Canister / Jar with wooden lid & green tea leaves */}
                <svg viewBox="0 0 160 160" className="w-32 h-32 drop-shadow-md">
                  {/* Loose Tea Leaves scattered */}
                  <ellipse cx="60" cy="125" rx="8" ry="4" fill="#65A30D" />
                  <ellipse cx="75" cy="130" rx="6" ry="3" fill="#4D7C0F" />
                  <ellipse cx="90" cy="126" rx="7" ry="4" fill="#65A30D" />
                  {/* Wooden Lid */}
                  <ellipse
                    cx="80"
                    cy="45"
                    rx="26"
                    ry="8"
                    fill="#D97706"
                    stroke="#B45309"
                    strokeWidth="1.2"
                  />
                  {/* Tin Body */}
                  <path
                    d="M54 45V115C54 122 66 125 80 125C94 125 106 122 106 115V45"
                    fill="#14B8A6"
                    stroke="#0F766E"
                    strokeWidth="1.5"
                  />
                  {/* Tin Label */}
                  <rect
                    x="62"
                    y="65"
                    width="36"
                    height="36"
                    rx="3"
                    fill="#ECFDF5"
                  />
                  <text
                    x="80"
                    y="80"
                    fontSize="7"
                    fontWeight="bold"
                    fill="#047857"
                    textAnchor="middle"
                  >
                    TEA 365
                  </text>
                  <text
                    x="80"
                    y="90"
                    fontSize="6"
                    fontWeight="medium"
                    fill="#059669"
                    textAnchor="middle"
                  >
                    ORGANIC
                  </text>
                </svg>
              </div>
              <div className="mt-2.5">
                <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                  TEA 365
                </p>
                <h3 className="text-xs font-semibold text-gray-900 mt-0.5 group-hover:text-amber-600 transition-colors">
                  {brand2Headline}
                </h3>
              </div>
            </div>

            {/* Brand 3: Soda Brand */}
            <div
              onClick={() => {
                setSearchQuery("soda");
                setSearchFocused(true);
                showToast(`Browsing ${brand3Headline}`);
              }}
              className="group cursor-pointer"
            >
              <div className="bg-[#edf2f7] rounded-xl p-6 h-48 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-[1.02]">
                {/* Soda Can Mockup Illustration */}
                <svg viewBox="0 0 160 160" className="w-32 h-32 drop-shadow-md">
                  {/* Can 1 (Behind) */}
                  <g transform="translate(25, 20)">
                    <ellipse cx="60" cy="30" rx="18" ry="6" fill="#CBD5E1" />
                    <rect x="42" y="30" width="36" height="60" fill="#38BDF8" />
                    <ellipse cx="60" cy="90" rx="18" ry="6" fill="#0284C7" />
                  </g>
                  {/* Can 2 (Foreground Tilted/Lying) */}
                  <g transform="translate(45, 60) rotate(35 50 40)">
                    <ellipse cx="50" cy="20" rx="16" ry="6" fill="#E2E8F0" />
                    <rect x="34" y="20" width="32" height="65" fill="#0EA5E9" />
                    <ellipse cx="50" cy="85" rx="16" ry="6" fill="#0369A1" />
                    <rect
                      x="36"
                      y="40"
                      width="28"
                      height="16"
                      fill="#FFFFFF"
                      rx="2"
                    />
                    <text
                      x="50"
                      y="52"
                      fontSize="7"
                      fontWeight="bold"
                      fill="#0369A1"
                      textAnchor="middle"
                    >
                      SODA
                    </text>
                  </g>
                </svg>
              </div>
              <div className="mt-2.5">
                <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                  SODA BRAND
                </p>
                <h3 className="text-xs font-semibold text-gray-900 mt-0.5 group-hover:text-amber-600 transition-colors">
                  {brand3Headline}
                </h3>
              </div>
            </div>

            {/* Brand 4: Farmart Sausage */}
            <div
              onClick={() => {
                setSearchQuery("sausage");
                setSearchFocused(true);
                showToast(`Browsing ${brand4Headline}`);
              }}
              className="group cursor-pointer"
            >
              <div className="bg-[#e9f2ec] rounded-xl p-6 h-48 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-[1.02]">
                {/* Packaged Sausage Tray Illustration */}
                <svg viewBox="0 0 160 160" className="w-32 h-32 drop-shadow-md">
                  {/* Black Plastic Vacuum Tray */}
                  <rect
                    x="35"
                    y="35"
                    width="90"
                    height="90"
                    rx="8"
                    fill="#1E293B"
                    stroke="#0F172A"
                    strokeWidth="1.5"
                  />
                  {/* Clear Film Border */}
                  <rect
                    x="40"
                    y="40"
                    width="80"
                    height="80"
                    rx="6"
                    fill="#0F172A"
                  />
                  {/* Sausages in Tray */}
                  <rect
                    x="46"
                    y="45"
                    width="12"
                    height="70"
                    rx="6"
                    fill="#F87171"
                  />
                  <rect
                    x="62"
                    y="45"
                    width="12"
                    height="70"
                    rx="6"
                    fill="#EF4444"
                  />
                  <rect
                    x="78"
                    y="45"
                    width="12"
                    height="70"
                    rx="6"
                    fill="#DC2626"
                  />
                  <rect
                    x="94"
                    y="45"
                    width="12"
                    height="70"
                    rx="6"
                    fill="#B91C1C"
                  />
                  {/* Packaging Label Sleeve */}
                  <rect
                    x="40"
                    y="65"
                    width="80"
                    height="28"
                    fill="#FEF08A"
                    fillOpacity="0.95"
                  />
                  <text
                    x="80"
                    y="78"
                    fontSize="8"
                    fontWeight="bold"
                    fill="#1F2937"
                    textAnchor="middle"
                  >
                    SAUSAGE
                  </text>
                  <text
                    x="80"
                    y="88"
                    fontSize="6"
                    fontWeight="semibold"
                    fill="#991B1B"
                    textAnchor="middle"
                  >
                    BUY 2 GET 1
                  </text>
                </svg>
              </div>
              <div className="mt-2.5">
                <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                  FARMART
                </p>
                <h3 className="text-xs font-semibold text-gray-900 mt-0.5 group-hover:text-amber-600 transition-colors">
                  {brand4Headline}
                </h3>
              </div>
            </div>
          </div>
        </section>

        {/* TOP SAVER TODAY */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                Top Saver Today
              </h2>
              <a
                href="#all-offers"
                className="text-xs text-gray-400 hover:text-amber-600 transition-colors hidden sm:inline"
              >
                All Offers &gt;
              </a>
              {/* Countdown Timer Badge */}
              <div className="bg-[#e05638] text-white px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs">
                <span className="text-[11px] font-normal opacity-90">Expires in:</span>
                <span className="font-mono font-bold tracking-wider">
                  {String(timeLeft.hours).padStart(2, "0")} :{" "}
                  {String(timeLeft.minutes).padStart(2, "0")} :{" "}
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                className="w-6 h-6 rounded border border-gray-200 text-gray-400 hover:text-gray-800 hover:border-gray-400 flex items-center justify-center transition-colors cursor-pointer text-xs"
              >
                &lt;
              </button>
              <button
                type="button"
                className="w-6 h-6 rounded border border-gray-200 text-gray-400 hover:text-gray-800 hover:border-gray-400 flex items-center justify-center transition-colors cursor-pointer text-xs"
              >
                &gt;
              </button>
            </div>
          </div>

          {/* Top Saver Grid: Left Super Deal + Center 3 Products + Right Member Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* 1. Left Featured Super Deal Card (col-span-3) */}
            <div className="lg:col-span-3 bg-white border border-gray-200 rounded-xl p-5 relative flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
              {/* Wishlist Heart Top Right */}
              <button
                type="button"
                onClick={() => {
                  setWishlistCount((c) => c + 1);
                  showToast(`Added ${featuredProduct.name} to wishlist`);
                }}
                className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors p-1"
                title="Save to wishlist"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>

              <div>
                {/* Product Image Mockup */}
                <div className="h-44 w-full flex items-center justify-center py-2">
                  <svg viewBox="0 0 160 160" className="w-36 h-36 drop-shadow-md">
                    {/* Green Beer / Drink 24 Pack Box */}
                    <g transform="translate(25, 20)">
                      <rect
                        x="10"
                        y="20"
                        width="80"
                        height="90"
                        rx="4"
                        fill="#FFFFFF"
                        stroke="#86EFAC"
                        strokeWidth="1.5"
                      />
                      <polygon
                        points="10,20 30,5 110,5 90,20"
                        fill="#15803D"
                      />
                      <polygon
                        points="90,20 110,5 110,95 90,110"
                        fill="#166534"
                      />
                      <rect x="18" y="32" width="64" height="24" fill="#15803D" rx="2" />
                      <text
                        x="50"
                        y="47"
                        fontSize="8"
                        fontWeight="bold"
                        fill="#FFFFFF"
                        textAnchor="middle"
                      >
                        ICE GOLD
                      </text>
                      <circle cx="50" cy="78" r="14" fill="#BBF7D0" />
                      <circle cx="50" cy="78" r="10" fill="#22C55E" />
                    </g>
                  </svg>
                </div>

                <p className="text-[10px] text-gray-400 font-medium">{featuredProduct.brand}</p>
                <h3 className="text-xs font-semibold text-gray-900 mt-0.5 line-clamp-2">
                  <Link href={`/product/${featuredProduct.id}`} className="hover:text-amber-600 transition-colors">
                    {featuredProduct.name}
                  </Link>
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-1.5">
                  <div className="flex text-amber-400 text-xs">
                    {"★".repeat(Math.round(featuredProduct.rating))}
                  </div>
                  <span className="text-[10px] text-gray-400">({featuredProduct.reviewCount})</span>
                </div>

                {/* Price */}
                <div className="mt-2 text-base font-bold text-gray-950">
                  ${featuredProduct.price.toFixed(2)}
                </div>

                {/* Sold progress */}
                <div className="mt-3">
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#fab528] h-full rounded-full transition-all duration-500"
                      style={{ width: `${featuredSoldRatio}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">
                    Sold: {featuredProduct.soldCount}/{featuredProduct.totalStock}
                  </p>
                </div>
              </div>

              {/* Quantity selector & Add to Cart button */}
              <div className="mt-4 pt-3 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center border border-gray-200 rounded overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setBeerQty((q) => Math.max(1, q - 1))}
                      className="px-2.5 py-1 text-gray-500 hover:bg-gray-100 font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-semibold text-gray-800">
                      {beerQty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setBeerQty((q) => q + 1)}
                      className="px-2.5 py-1 text-gray-500 hover:bg-gray-100 font-bold"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-semibold text-gray-900">
                    Total: ${(featuredProduct.price * beerQty).toFixed(2)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCartCount((c) => c + beerQty);
                    showToast(
                      `Added ${beerQty}x ${featuredProduct.name} to cart ($${(
                        featuredProduct.price * beerQty
                      ).toFixed(2)})`
                    );
                  }}
                  className="w-full bg-[#fab528] hover:bg-[#e5a420] text-gray-950 font-bold py-2.5 rounded-lg text-xs tracking-wide transition-all shadow-xs cursor-pointer"
                >
                  + Add to Cart
                </button>
              </div>
            </div>

            {/* 2. Center 3 Product Cards (col-span-6) */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {centerProducts.map((prod) => {
                const soldRatio = Math.min(
                  100,
                  Math.round((prod.soldCount / (prod.totalStock || 1)) * 100)
                );
                return (
                  <div
                    key={prod.id}
                    className="bg-white border border-gray-100 hover:border-gray-200 rounded-xl p-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group"
                  >
                    <div>
                      {/* Badge */}
                      <div className="h-5">
                        {prod.discountPercent > 0 && (
                          <span className="inline-block bg-[#ff4d4f] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                            Save {prod.discountPercent}%
                          </span>
                        )}
                      </div>

                      {/* Mockup */}
                      <div className="h-32 w-full flex items-center justify-center my-1">
                        {renderProductMockup(prod.id)}
                      </div>

                      <p className="text-[10px] text-gray-400 font-medium">{prod.brand}</p>
                      <h3 className="text-xs font-semibold text-gray-900 mt-0.5 line-clamp-2">
                        <Link
                          href={`/product/${prod.id}`}
                          className="hover:text-amber-600 transition-colors"
                        >
                          {prod.name}
                        </Link>
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex text-amber-400 text-[10px]">
                          {"★".repeat(Math.round(prod.rating))}
                        </div>
                        <span className="text-[9px] text-gray-400">({prod.reviewCount})</span>
                      </div>

                      {/* Weight / Pack */}
                      <p className="text-[9px] text-gray-400 mt-1">{prod.unit}</p>

                      {/* Price */}
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-xs font-bold text-[#e05638]">
                          ${prod.price.toFixed(2)}
                        </span>
                        {prod.originalPrice > prod.price && (
                          <span className="text-[10px] text-gray-400 line-through">
                            ${prod.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3 pt-2 border-t border-gray-50">
                      <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                        <div
                          className="bg-[#fab528] h-full rounded-full transition-all duration-500"
                          style={{ width: `${soldRatio}%` }}
                        ></div>
                      </div>
                      <p className="text-[9px] text-gray-400 mt-1">
                        Sold: {prod.soldCount}/{prod.totalStock}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 3. Right Promotional Member Signup Card (col-span-3) */}
            <div className="lg:col-span-3 bg-[#fff8f2] border border-orange-100 rounded-xl p-6 text-center flex flex-col justify-center relative overflow-hidden shadow-xs">
              {/* Subtle vegetable watermark shapes */}
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-orange-100/40 pointer-events-none"></div>
              <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-amber-100/40 pointer-events-none"></div>

              <div className="relative z-10">
                <h3 className="text-3xl font-black text-[#e05638] tracking-tight">
                  15% OFF
                </h3>
                <p className="text-xs text-gray-600 mt-1 mb-5 leading-snug">
                  For new member sign up at the first time
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    showToast("Registration submitted successfully! Enjoy 15% OFF.");
                  }}
                  className="space-y-3"
                >
                  {/* Email Input */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </span>
                    <input
                      type="email"
                      required
                      placeholder="yourdomain@gmail.com"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-md text-xs placeholder-gray-400 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-xs"
                    />
                  </div>

                  {/* Password Input */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </span>
                    <input
                      type="password"
                      required
                      placeholder="Password"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-md text-xs placeholder-gray-400 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-xs"
                    />
                  </div>

                  {/* Confirm Password Input */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </span>
                    <input
                      type="password"
                      required
                      placeholder="Re-type Password"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-md text-xs placeholder-gray-400 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-xs"
                    />
                  </div>

                  {/* Register Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#fab528] hover:bg-[#e5a420] text-gray-950 font-bold py-2.5 rounded-md text-xs tracking-wide transition-all shadow-xs cursor-pointer mt-2"
                  >
                    Register Now
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-gray-100 bg-gray-50/50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Features Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-8 border-b border-gray-200/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100/60 flex items-center justify-center text-amber-600 font-bold">
                🚚
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Free Delivery</h4>
                <p className="text-[11px] text-gray-500">For all orders over $99</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100/60 flex items-center justify-center text-amber-600 font-bold">
                🔒
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">100% Secure</h4>
                <p className="text-[11px] text-gray-500">Safe payments online</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100/60 flex items-center justify-center text-amber-600 font-bold">
                💰
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">30 Days Return</h4>
                <p className="text-[11px] text-gray-500">Money back guarantee</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100/60 flex items-center justify-center text-amber-600 font-bold">
                💬
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">24/7 Support</h4>
                <p className="text-[11px] text-gray-500">Dedicated assistance</p>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
            <p>© 2026 Farmart. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/overview" className="hover:text-amber-700 transition-colors">Project Overview</Link>
              <a href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-600 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-gray-600 transition-colors">Help Center</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
