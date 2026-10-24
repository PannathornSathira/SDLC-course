export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  unit: string;
  sku: string;
  inStock: boolean;
  stockCount: number;
  soldCount: number;
  totalStock: number;
  isBestSeller?: boolean;
  isTopSaver?: boolean;
  isOrganic?: boolean;
  description: string;
  features: string[];
  nutritionFacts: {
    servingSize: string;
    calories: string;
    fat: string;
    carbs: string;
    protein: string;
    sodium: string;
  };
  storageInstructions: string;
  origin: string;
  shelfLife: string;
  reviews: Array<{
    id: string;
    author: string;
    rating: number;
    date: string;
    title: string;
    comment: string;
    verified: boolean;
  }>;
  relatedProductIds: string[];
}

export const PRODUCTS: Record<string, Product> = {
  "ice-golds-beer": {
    id: "ice-golds-beer",
    name: "Ice Gold's Beer 350ml x 24 Pieces",
    brand: "Ice Gold Brewery",
    category: "Wines & Alcohol Drinks",
    categorySlug: "wines",
    price: 49.5,
    originalPrice: 58.0,
    discountPercent: 15,
    rating: 5.0,
    reviewCount: 3,
    unit: "350ml x 24 Cans Party Box",
    sku: "BEER-350-24",
    inStock: true,
    stockCount: 20,
    soldCount: 20,
    totalStock: 40,
    isBestSeller: true,
    isTopSaver: true,
    description:
      "Crafted from 100% premium malted barley and cold-filtered mountain spring water. Ice Gold delivers a crisp, refreshing, and clean finish with subtle floral hop aromas. Packaged in an easy-carry 24-can party box designed for summer gatherings, barbecues, and weekend celebrations.",
    features: [
      "100% all-natural malted barley & noble hops",
      "Cold-filtered at sub-zero temperatures for ultimate crispness",
      "Alcohol by volume (ABV): 4.8%",
      "Convenient durable 24-can party box with handle",
      "No artificial preservatives or high-fructose syrups",
    ],
    nutritionFacts: {
      servingSize: "1 can (350ml)",
      calories: "142 kcal",
      fat: "0g",
      carbs: "11.2g",
      protein: "1.4g",
      sodium: "14mg",
    },
    storageInstructions:
      "Keep refrigerated between 2°C - 5°C. Best served ice cold.",
    origin: "Germany / Bavaria",
    shelfLife: "9 months from packaging date",
    reviews: [
      {
        id: "r1",
        author: "Marcus Vance",
        rating: 5,
        date: "2 days ago",
        title: "Best summer beer by far!",
        comment:
          "Super crisp and clean. Delivered fast and perfectly cold from Farmart. The 24-pack price with the top saver deal was unbeatable.",
        verified: true,
      },
      {
        id: "r2",
        author: "Sarah Jenkins",
        rating: 5,
        date: "1 week ago",
        title: "Great value party box",
        comment:
          "Bought this for our weekend family barbecue. Everyone loved it. Will definitely subscribe to weekly deliveries.",
        verified: true,
      },
      {
        id: "r3",
        author: "Liam O'Connor",
        rating: 5,
        date: "2 weeks ago",
        title: "Smooth, no bitter aftertaste",
        comment:
          "Very balanced lager with great carbonation. Farmart driver was very polite.",
        verified: true,
      },
    ],
    relatedProductIds: ["british-beef-mince", "blood-orange", "farmhouse-soft-white"],
  },

  "british-beef-mince": {
    id: "british-beef-mince",
    name: "British Beef Mince (10% Fat)",
    brand: "Meat Brand Farms",
    category: "Raw Meats",
    categorySlug: "meats",
    price: 59.5,
    originalPrice: 69.0,
    discountPercent: 14,
    rating: 4.8,
    reviewCount: 4,
    unit: "500g Vacuum Sealed Tray",
    sku: "MEAT-BEEF-500",
    inStock: true,
    stockCount: 75,
    soldCount: 25,
    totalStock: 100,
    isTopSaver: true,
    description:
      "Finely minced grass-fed British beef with an ideal 90:10 lean-to-fat balance. Perfect for homemade smash burgers, hearty bolognese, cottage pie, or meatballs. Vacuum packed to lock in natural juices, freshness, and rich flavor without added water.",
    features: [
      "100% pasture-raised British grass-fed cattle",
      "Lean 90% meat, 10% fat for juicy texture",
      "Free from hormones and prophylactic antibiotics",
      "Vacuum sealed in recyclable food-safe tray",
    ],
    nutritionFacts: {
      servingSize: "100g cooked",
      calories: "215 kcal",
      fat: "10g",
      carbs: "0g",
      protein: "28g",
      sodium: "65mg",
    },
    storageInstructions:
      "Keep refrigerated below 4°C. Freeze on day of purchase if not using within 3 days.",
    origin: "United Kingdom (Yorkshire)",
    shelfLife: "5 days fresh / 3 months frozen",
    reviews: [
      {
        id: "r4",
        author: "David K.",
        rating: 5,
        date: "3 days ago",
        title: "Tender and flavorful",
        comment:
          "Makes the best bolognese sauce. Almost no grease in the pan compared to supermarket mince.",
        verified: true,
      },
      {
        id: "r5",
        author: "Emma Watson",
        rating: 4,
        date: "5 days ago",
        title: "High quality meat",
        comment: "Fresh red color, smells fresh and tastes great in burgers.",
        verified: true,
      },
    ],
    relatedProductIds: ["ice-golds-beer", "farmhouse-soft-white", "blood-orange"],
  },

  "farmhouse-soft-white": {
    id: "farmhouse-soft-white",
    name: "Farmart Farmhouse Soft White Bread",
    brand: "Farmart Bakery",
    category: "Breads & Sweets",
    categorySlug: "breads",
    price: 12.7,
    originalPrice: 15.0,
    discountPercent: 15,
    rating: 4.6,
    reviewCount: 8,
    unit: "800g Sliced Loaf",
    sku: "BAKE-BREAD-800",
    inStock: true,
    stockCount: 11,
    soldCount: 9,
    totalStock: 20,
    isBestSeller: true,
    description:
      "Traditional bakery-style farmhouse soft white loaf baked fresh daily at dawn. Boasting a golden flour-dusted crust and an irresistibly pillowy, feather-light crumb. Ideal for breakfast toast, club sandwiches, or french toast.",
    features: [
      "Baked fresh daily using unbleached stoneground wheat flour",
      "No artificial emulsifiers, bleached flour, or hydrogenated oils",
      "Thick, hearty farmhouse sandwich slices",
      "Naturally leavened with wild sourdough starter",
    ],
    nutritionFacts: {
      servingSize: "2 slices (80g)",
      calories: "190 kcal",
      fat: "1.5g",
      carbs: "38g",
      protein: "7g",
      sodium: "320mg",
    },
    storageInstructions:
      "Store in a cool, dry place. Keep bag sealed to preserve moisture.",
    origin: "Local Farmart Artisanal Bakery",
    shelfLife: "4 days from bake date",
    reviews: [
      {
        id: "r6",
        author: "Chloe Bennett",
        rating: 5,
        date: "Yesterday",
        title: "So soft and fragrant!",
        comment:
          "Reminds me of traditional bakery bread from childhood. Toast it with salted butter and jam!",
        verified: true,
      },
    ],
    relatedProductIds: ["british-beef-mince", "ice-golds-beer", "blood-orange"],
  },

  "blood-orange": {
    id: "blood-orange",
    name: "Fresh Blood Orange 1kg",
    brand: "Sunny Valley Orchards",
    category: "Fruits & Vegetables",
    categorySlug: "fruits",
    price: 12.2,
    originalPrice: 14.5,
    discountPercent: 16,
    rating: 5.0,
    reviewCount: 12,
    unit: "1kg Net Bag (~6-8 Oranges)",
    sku: "FRUIT-ORANGE-1KG",
    inStock: true,
    stockCount: 39,
    soldCount: 61,
    totalStock: 100,
    isOrganic: true,
    isTopSaver: true,
    description:
      "Sun-ripened Sicilian Moro blood oranges hand-picked at peak sweetness. Renowned for their dramatic crimson-ruby interior and complex floral raspberry-citrus sweetness. Packed with antioxidants, anthocyanins, and over 120% of your daily Vitamin C per fruit.",
    features: [
      "Certified 100% Organic & Non-GMO",
      "Naturally high in anthocyanins and Vitamin C",
      "Thin, easy-to-peel aromatic rind",
      "High juice yield, perfect for fresh morning cocktails or marinades",
    ],
    nutritionFacts: {
      servingSize: "1 medium orange (130g)",
      calories: "65 kcal",
      fat: "0.2g",
      carbs: "15.4g",
      protein: "1.2g",
      sodium: "0mg",
    },
    storageInstructions:
      "Store at room temperature for 5 days or refrigerate up to 2 weeks.",
    origin: "Sicily, Italy (Mount Etna Valley)",
    shelfLife: "14 days refrigerated",
    reviews: [
      {
        id: "r7",
        author: "Anthony Rossi",
        rating: 5,
        date: "4 days ago",
        title: "Incredible deep ruby color & sweet flavor",
        comment:
          "Juicing these every morning. Beautiful color and delicious flavor without bitterness.",
        verified: true,
      },
    ],
    relatedProductIds: ["ice-golds-beer", "farmhouse-soft-white", "british-beef-mince"],
  },
};

export const DEFAULT_PRODUCT_ID = "ice-golds-beer";
