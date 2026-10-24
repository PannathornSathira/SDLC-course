import { DEFAULT_PRODUCT_ID, PRODUCTS, type Product } from "@/app/data/products";

/**
 * Farmart REST API design (OpenAPI 3.1).
 *
 * Derived from the current UI: storefront (`/`), product detail (`/product/[id]`),
 * and their on-page flows (search, categories, deals, wishlist, cart, coupon,
 * reviews, member signup). Only `GET /api/hello` is implemented today; every other
 * operation is a design contract tagged `x-status: planned`.
 */

const sample: Product = PRODUCTS[DEFAULT_PRODUCT_ID];
const { reviews: sampleReviews, ...sampleWithoutReviews } = sample;

const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });
const json = (schema: object, example?: unknown) => ({
  "application/json": example === undefined ? { schema } : { schema, example },
});
const ok = (description: string, schema: object, example?: unknown) => ({
  description,
  content: json(schema, example),
});
const err = (name: string) => ({ $ref: `#/components/responses/${name}` });
const planned = { "x-status": "planned" };
const productIdParam = { $ref: "#/components/parameters/ProductId" };

export const openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "Farmart Grocery API",
    version: "1.0.0",
    description:
      "REST API designed from the Farmart Next.js storefront. It backs catalog browsing, " +
      "search, deals, product details, reviews, wishlist, cart, coupons, shipping quotes, " +
      "member registration, and express checkout.\n\n" +
      "**Implementation status:** Homepage and search endpoints (`/api/categories`, `/api/products`, `/api/products/{id}`, `/api/deals`, `/api/promotions/banners`, `/api/brands/featured`, `/api/hello`) are live and backed by a local SQLite database (`data/farmart.db`). Operations marked " +
      "`x-status: planned` describe contracts simulated on the client side.",
  },
  servers: [{ url: "/", description: "Current Next.js server" }],
  tags: [
    { name: "System", description: "Health and sample endpoints" },
    { name: "Catalog", description: "Categories, products, and pack options" },
    { name: "Promotions", description: "Deals of the day, banners, and featured brands" },
    { name: "Reviews", description: "Product reviews" },
    { name: "Wishlist", description: "Saved products for the current shopper" },
    { name: "Cart", description: "Shopping cart and applied coupon" },
    { name: "Coupons", description: "Voucher validation and claiming" },
    { name: "Shipping", description: "Delivery fees and free-shipping progress" },
    { name: "Members", description: "Member registration" },
    { name: "Checkout", description: "Order placement" },
  ],
  paths: {
    "/api/hello": {
      get: {
        tags: ["System"],
        summary: "Hello World",
        operationId: "getHello",
        "x-status": "implemented",
        responses: {
          200: ok("Greeting", ref("HelloResponse"), { message: "Hello World" }),
        },
      },
    },

    "/api/categories": {
      get: {
        tags: ["Catalog"],
        summary: "List product categories",
        description: "Feeds the header category selector and the storefront category cards.",
        operationId: "listCategories",
        "x-status": "implemented",
        responses: {
          200: ok("Categories", { type: "array", items: ref("Category") }, [
            { id: "fruits", name: "Fruits & Vegetables", productCount: 1 },
            { id: "breads", name: "Breads & Sweets", productCount: 1 },
            { id: "meats", name: "Raw Meats", productCount: 1 },
            { id: "wines", name: "Wines & Alcohol Drinks", productCount: 1 },
          ]),
        },
      },
    },

    "/api/products": {
      get: {
        tags: ["Catalog"],
        summary: "List or search products",
        description: "Powers the header search box (\"I'm searching for...\") with its category filter.",
        operationId: "listProducts",
        "x-status": "implemented",
        parameters: [
          { name: "q", in: "query", description: "Free-text search", schema: { type: "string" } },
          { name: "category", in: "query", description: "Category slug", schema: { type: "string", example: "wines" } },
          { name: "brand", in: "query", schema: { type: "string" } },
          { name: "bestSeller", in: "query", schema: { type: "boolean" } },
          { name: "topSaver", in: "query", schema: { type: "boolean" } },
          { name: "organic", in: "query", schema: { type: "boolean" } },
          { name: "inStock", in: "query", schema: { type: "boolean" } },
          {
            name: "sort", in: "query",
            schema: { type: "string", enum: ["relevance", "price_asc", "price_desc", "rating", "discount"], default: "relevance" },
          },
          { $ref: "#/components/parameters/Page" },
          { $ref: "#/components/parameters/Limit" },
        ],
        responses: {
          200: ok("Paginated product summaries", ref("ProductPage"), {
            data: Object.values(PRODUCTS).map(toSummary),
            page: 1, limit: 20, total: Object.keys(PRODUCTS).length,
          }),
          400: err("BadRequest"),
        },
      },
    },

    "/api/products/{id}": {
      get: {
        tags: ["Catalog"],
        summary: "Get product details",
        description: "Everything rendered on `/product/[id]`: gallery badges, pricing, stock, description, nutrition, storage, and shipping tabs.",
        operationId: "getProduct",
        "x-status": "implemented",
        parameters: [productIdParam],
        responses: {
          200: ok("Product", ref("Product"), sampleWithoutReviews),
          404: err("NotFound"),
        },
      },
    },

    "/api/products/{id}/related": {
      get: {
        tags: ["Catalog"],
        summary: "List related products",
        operationId: "listRelatedProducts",
        ...planned,
        parameters: [productIdParam],
        responses: {
          200: ok("Related products", { type: "array", items: ref("ProductSummary") },
            sample.relatedProductIds.map((id) => toSummary(PRODUCTS[id]))),
          404: err("NotFound"),
        },
      },
    },

    "/api/products/{id}/pack-options": {
      get: {
        tags: ["Catalog"],
        summary: "List purchasable pack options",
        description: "Standard Pack, Party Box x2 (save 10%), and Family Monthly Sub (save 20%).",
        operationId: "listPackOptions",
        ...planned,
        parameters: [productIdParam],
        responses: {
          200: ok("Pack options", { type: "array", items: ref("PackOption") }, [
            { id: "standard", label: "Standard Pack", description: sample.unit, discountPercent: 0, unitPrice: 49.5 },
            { id: "party-x2", label: "Party Box x2", description: "Double pack bundle", discountPercent: 10, unitPrice: 89.1 },
            { id: "family-sub", label: "Family Monthly Sub", description: "Delivered weekly", discountPercent: 20, unitPrice: 39.6, recurring: "weekly" },
          ]),
          404: err("NotFound"),
        },
      },
    },

    "/api/products/{id}/reviews": {
      get: {
        tags: ["Reviews"],
        summary: "List product reviews",
        operationId: "listReviews",
        ...planned,
        parameters: [
          productIdParam,
          { name: "sort", in: "query", schema: { type: "string", enum: ["newest", "highest", "lowest"], default: "newest" } },
          { $ref: "#/components/parameters/Page" },
          { $ref: "#/components/parameters/Limit" },
        ],
        responses: {
          200: ok("Reviews with rating summary", ref("ReviewPage"), {
            averageRating: sample.rating, reviewCount: sample.reviewCount,
            data: sampleReviews, page: 1, limit: 20, total: sampleReviews.length,
          }),
          404: err("NotFound"),
        },
      },
      post: {
        tags: ["Reviews"],
        summary: "Submit a review",
        description: "Backs the \"Write a review\" dialog.",
        operationId: "createReview",
        ...planned,
        parameters: [productIdParam],
        requestBody: {
          required: true,
          content: json(ref("CreateReviewRequest"), {
            author: "Jane Doe", rating: 5, title: "Fresh and tasty",
            comment: "Great packaging and arrived cold.",
          }),
        },
        responses: {
          201: ok("Review created", ref("Review")),
          400: err("BadRequest"),
          404: err("NotFound"),
        },
      },
    },

    "/api/deals": {
      get: {
        tags: ["Promotions"],
        summary: "Get deals of the day",
        description: "Deal cards plus the countdown timer shown on the storefront.",
        operationId: "listDeals",
        "x-status": "implemented",
        responses: {
          200: ok("Active deals", ref("DealsResponse"), {
            endsAt: "2026-10-20T23:59:59+07:00",
            products: Object.values(PRODUCTS).filter((p) => p.isTopSaver).map(toSummary),
          }),
        },
      },
    },

    "/api/promotions/banners": {
      get: {
        tags: ["Promotions"],
        summary: "List promotional banners",
        operationId: "listBanners",
        "x-status": "implemented",
        responses: {
          200: ok("Banners", { type: "array", items: ref("Banner") }, [
            { id: "summer-juice-milk", title: "Active Summer Juice Milk", ctaLabel: "Shop Now", href: "/api/products?category=dairy" },
            { id: "seeds-20-off", title: "20% Sale Off Seeds", ctaLabel: "Shop Now", href: "/api/products?category=fruits" },
          ]),
        },
      },
    },

    "/api/brands/featured": {
      get: {
        tags: ["Promotions"],
        summary: "List featured brands",
        operationId: "listFeaturedBrands",
        "x-status": "implemented",
        responses: {
          200: ok("Featured brands", { type: "array", items: ref("Brand") }),
        },
      },
    },

    "/api/wishlist": {
      get: {
        tags: ["Wishlist"],
        summary: "Get the shopper's wishlist",
        operationId: "getWishlist",
        ...planned,
        security: [{ sessionCookie: [] }],
        responses: {
          200: ok("Wishlist", ref("Wishlist"), { count: 1, items: [toSummary(sample)] }),
          401: err("Unauthorized"),
        },
      },
      post: {
        tags: ["Wishlist"],
        summary: "Add a product to the wishlist",
        operationId: "addWishlistItem",
        ...planned,
        security: [{ sessionCookie: [] }],
        requestBody: { required: true, content: json(ref("WishlistItemRequest"), { productId: DEFAULT_PRODUCT_ID }) },
        responses: {
          200: ok("Updated wishlist", ref("Wishlist")),
          401: err("Unauthorized"),
          404: err("NotFound"),
        },
      },
    },

    "/api/wishlist/{productId}": {
      delete: {
        tags: ["Wishlist"],
        summary: "Remove a product from the wishlist",
        operationId: "removeWishlistItem",
        ...planned,
        security: [{ sessionCookie: [] }],
        parameters: [{ name: "productId", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: ok("Updated wishlist", ref("Wishlist")),
          401: err("Unauthorized"),
        },
      },
    },

    "/api/cart": {
      get: {
        tags: ["Cart"],
        summary: "Get the current cart",
        description: "Header cart badge/total and product-page cart feedback.",
        operationId: "getCart",
        ...planned,
        responses: {
          200: ok("Cart", ref("Cart"), exampleCart()),
        },
      },
    },

    "/api/cart/items": {
      post: {
        tags: ["Cart"],
        summary: "Add an item to the cart",
        description: "Backs \"Add to Cart\" on the product page and sticky cart bar.",
        operationId: "addCartItem",
        ...planned,
        requestBody: {
          required: true,
          content: json(ref("AddCartItemRequest"), { productId: DEFAULT_PRODUCT_ID, packOptionId: "standard", quantity: 2 }),
        },
        responses: {
          201: ok("Updated cart", ref("Cart"), exampleCart()),
          400: err("BadRequest"),
          404: err("NotFound"),
          409: err("OutOfStock"),
        },
      },
    },

    "/api/cart/items/{itemId}": {
      patch: {
        tags: ["Cart"],
        summary: "Change item quantity",
        operationId: "updateCartItem",
        ...planned,
        parameters: [{ name: "itemId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { required: true, content: json(ref("UpdateCartItemRequest"), { quantity: 3 }) },
        responses: {
          200: ok("Updated cart", ref("Cart")),
          400: err("BadRequest"),
          404: err("NotFound"),
          409: err("OutOfStock"),
        },
      },
      delete: {
        tags: ["Cart"],
        summary: "Remove an item",
        operationId: "removeCartItem",
        ...planned,
        parameters: [{ name: "itemId", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: ok("Updated cart", ref("Cart")),
          404: err("NotFound"),
        },
      },
    },

    "/api/cart/coupon": {
      put: {
        tags: ["Cart"],
        summary: "Apply a coupon to the cart",
        description: "Backs the coupon dialog's apply action (e.g. `FARMARTNEW15`).",
        operationId: "applyCartCoupon",
        ...planned,
        requestBody: { required: true, content: json(ref("ApplyCouponRequest"), { code: "FARMARTNEW15" }) },
        responses: {
          200: ok("Cart with discount", ref("Cart")),
          404: err("NotFound"),
          422: err("InvalidCoupon"),
        },
      },
      delete: {
        tags: ["Cart"],
        summary: "Remove the applied coupon",
        operationId: "removeCartCoupon",
        ...planned,
        responses: { 200: ok("Cart without discount", ref("Cart")) },
      },
    },

    "/api/coupons/{code}": {
      get: {
        tags: ["Coupons"],
        summary: "Validate a coupon code",
        operationId: "getCoupon",
        ...planned,
        parameters: [{ name: "code", in: "path", required: true, schema: { type: "string", example: "FARMARTNEW15" } }],
        responses: {
          200: ok("Coupon", ref("Coupon"), {
            code: "FARMARTNEW15", description: "15% off for new members",
            discountType: "percent", value: 15, minSubtotal: 0, expiresAt: "2026-12-31T23:59:59+07:00",
          }),
          404: err("NotFound"),
        },
      },
    },

    "/api/shipping/quote": {
      get: {
        tags: ["Shipping"],
        summary: "Get a shipping quote",
        description: "Free standard delivery at $99+; otherwise a flat $4.99 fee. Drives the FreeShippingBar.",
        operationId: "getShippingQuote",
        ...planned,
        parameters: [{ name: "subtotal", in: "query", required: true, schema: { type: "number", minimum: 0, example: 49.5 } }],
        responses: {
          200: ok("Shipping quote", ref("ShippingQuote"), {
            subtotal: 49.5, threshold: 99, fee: 4.99, isFree: false, amountToFree: 49.5, progressPercent: 50,
          }),
          400: err("BadRequest"),
        },
      },
    },

    "/api/members": {
      post: {
        tags: ["Members"],
        summary: "Register as a member",
        description: "Storefront member signup form. Success grants a 15% welcome coupon.",
        operationId: "registerMember",
        ...planned,
        requestBody: {
          required: true,
          content: json(ref("RegisterMemberRequest"), {
            email: "yourdomain@gmail.com", password: "S3cure!pass", confirmPassword: "S3cure!pass",
          }),
        },
        responses: {
          201: ok("Member created", ref("RegisterMemberResponse"), {
            id: "mem_01HZX", email: "yourdomain@gmail.com", welcomeCoupon: "FARMARTNEW15",
          }),
          400: err("BadRequest"),
          409: { description: "Email already registered", content: json(ref("Error")) },
        },
      },
    },

    "/api/checkout/express": {
      post: {
        tags: ["Checkout"],
        summary: "Express checkout",
        description: "Backs \"Buy Now\" / express checkout. Places an order from the cart or a single item.",
        operationId: "expressCheckout",
        ...planned,
        security: [{ sessionCookie: [] }],
        requestBody: {
          required: true,
          content: json(ref("ExpressCheckoutRequest"), {
            items: [{ productId: DEFAULT_PRODUCT_ID, packOptionId: "standard", quantity: 1 }],
            couponCode: "FARMARTNEW15",
          }),
        },
        responses: {
          201: ok("Order placed", ref("Order")),
          400: err("BadRequest"),
          401: err("Unauthorized"),
          409: err("OutOfStock"),
        },
      },
    },
  },

  components: {
    securitySchemes: {
      sessionCookie: { type: "apiKey", in: "cookie", name: "farmart_session" },
    },
    parameters: {
      ProductId: {
        name: "id", in: "path", required: true,
        schema: { type: "string", enum: Object.keys(PRODUCTS), example: DEFAULT_PRODUCT_ID },
      },
      Page: { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 } },
      Limit: { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100, default: 20 } },
    },
    responses: {
      BadRequest: { description: "Validation failed", content: json(ref("Error"), { code: "VALIDATION_ERROR", message: "quantity must be >= 1" }) },
      Unauthorized: { description: "Session required", content: json(ref("Error"), { code: "UNAUTHORIZED", message: "Sign in required" }) },
      NotFound: { description: "Resource not found", content: json(ref("Error"), { code: "NOT_FOUND", message: "Product not found" }) },
      OutOfStock: { description: "Insufficient stock", content: json(ref("Error"), { code: "OUT_OF_STOCK", message: "Only 20 left in stock" }) },
      InvalidCoupon: { description: "Coupon expired or not applicable", content: json(ref("Error"), { code: "INVALID_COUPON", message: "Coupon has expired" }) },
    },
    schemas: {
      HelloResponse: {
        type: "object", required: ["message"],
        properties: { message: { type: "string" } },
      },
      Error: {
        type: "object", required: ["code", "message"],
        properties: {
          code: { type: "string" },
          message: { type: "string" },
          details: { type: "object", additionalProperties: true },
        },
      },
      Category: {
        type: "object", required: ["id", "name"],
        properties: {
          id: { type: "string", description: "Slug", example: "breads" },
          name: { type: "string", example: "Breads & Sweets" },
          productCount: { type: "integer" },
        },
      },
      Brand: {
        type: "object", required: ["id", "name"],
        properties: { id: { type: "string" }, name: { type: "string" }, logoUrl: { type: "string", format: "uri" } },
      },
      Banner: {
        type: "object", required: ["id", "title"],
        properties: {
          id: { type: "string" }, title: { type: "string" }, subtitle: { type: "string" },
          ctaLabel: { type: "string" }, href: { type: "string" }, imageUrl: { type: "string", format: "uri" },
        },
      },
      ProductSummary: {
        type: "object",
        required: ["id", "name", "brand", "categorySlug", "price", "originalPrice", "discountPercent", "rating", "reviewCount", "unit", "inStock"],
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          brand: { type: "string" },
          category: { type: "string" },
          categorySlug: { type: "string" },
          price: { type: "number", format: "double" },
          originalPrice: { type: "number", format: "double" },
          discountPercent: { type: "integer", minimum: 0, maximum: 100 },
          rating: { type: "number", minimum: 0, maximum: 5 },
          reviewCount: { type: "integer" },
          unit: { type: "string" },
          inStock: { type: "boolean" },
          stockCount: { type: "integer" },
          soldCount: { type: "integer" },
          totalStock: { type: "integer" },
          isBestSeller: { type: "boolean" },
          isTopSaver: { type: "boolean" },
          isOrganic: { type: "boolean" },
        },
      },
      Product: {
        allOf: [
          ref("ProductSummary"),
          {
            type: "object",
            required: ["sku", "description", "features", "nutritionFacts"],
            properties: {
              sku: { type: "string" },
              description: { type: "string" },
              features: { type: "array", items: { type: "string" } },
              nutritionFacts: ref("NutritionFacts"),
              storageInstructions: { type: "string" },
              origin: { type: "string" },
              shelfLife: { type: "string" },
              relatedProductIds: { type: "array", items: { type: "string" } },
            },
          },
        ],
      },
      NutritionFacts: {
        type: "object",
        required: ["servingSize", "calories", "fat", "carbs", "protein", "sodium"],
        properties: {
          servingSize: { type: "string" }, calories: { type: "string" }, fat: { type: "string" },
          carbs: { type: "string" }, protein: { type: "string" }, sodium: { type: "string" },
        },
      },
      ProductPage: paginated("ProductSummary"),
      PackOption: {
        type: "object", required: ["id", "label", "discountPercent", "unitPrice"],
        properties: {
          id: { type: "string", enum: ["standard", "party-x2", "family-sub"] },
          label: { type: "string" },
          description: { type: "string" },
          discountPercent: { type: "integer" },
          unitPrice: { type: "number" },
          recurring: { type: "string", enum: ["weekly", "monthly"] },
        },
      },
      Review: {
        type: "object", required: ["id", "author", "rating", "date", "comment", "verified"],
        properties: {
          id: { type: "string" },
          author: { type: "string" },
          rating: { type: "integer", minimum: 1, maximum: 5 },
          date: { type: "string", description: "ISO 8601 timestamp (UI renders relative time)" },
          title: { type: "string" },
          comment: { type: "string" },
          verified: { type: "boolean" },
        },
      },
      ReviewPage: {
        allOf: [
          paginated("Review"),
          { type: "object", properties: { averageRating: { type: "number" }, reviewCount: { type: "integer" } } },
        ],
      },
      CreateReviewRequest: {
        type: "object", required: ["author", "rating", "comment"],
        properties: {
          author: { type: "string", minLength: 1, maxLength: 80 },
          rating: { type: "integer", minimum: 1, maximum: 5 },
          title: { type: "string", maxLength: 120 },
          comment: { type: "string", minLength: 1, maxLength: 2000 },
        },
      },
      DealsResponse: {
        type: "object", required: ["endsAt", "products"],
        properties: {
          endsAt: { type: "string", format: "date-time", description: "Drives the countdown timer" },
          products: { type: "array", items: ref("ProductSummary") },
        },
      },
      WishlistItemRequest: {
        type: "object", required: ["productId"],
        properties: { productId: { type: "string" } },
      },
      Wishlist: {
        type: "object", required: ["count", "items"],
        properties: { count: { type: "integer" }, items: { type: "array", items: ref("ProductSummary") } },
      },
      CartItem: {
        type: "object", required: ["id", "productId", "name", "packOptionId", "quantity", "unitPrice", "lineTotal"],
        properties: {
          id: { type: "string" },
          productId: { type: "string" },
          name: { type: "string" },
          packOptionId: { type: "string" },
          quantity: { type: "integer", minimum: 1 },
          unitPrice: { type: "number" },
          lineTotal: { type: "number" },
        },
      },
      Cart: {
        type: "object", required: ["id", "itemCount", "items", "subtotal", "discount", "shipping", "total"],
        properties: {
          id: { type: "string" },
          itemCount: { type: "integer" },
          items: { type: "array", items: ref("CartItem") },
          couponCode: { type: ["string", "null"] },
          subtotal: { type: "number" },
          discount: { type: "number" },
          shipping: ref("ShippingQuote"),
          total: { type: "number" },
        },
      },
      AddCartItemRequest: {
        type: "object", required: ["productId", "quantity"],
        properties: {
          productId: { type: "string" },
          packOptionId: { type: "string", default: "standard" },
          quantity: { type: "integer", minimum: 1, maximum: 99 },
        },
      },
      UpdateCartItemRequest: {
        type: "object", required: ["quantity"],
        properties: { quantity: { type: "integer", minimum: 1, maximum: 99 } },
      },
      ApplyCouponRequest: {
        type: "object", required: ["code"],
        properties: { code: { type: "string" } },
      },
      Coupon: {
        type: "object", required: ["code", "discountType", "value"],
        properties: {
          code: { type: "string" },
          description: { type: "string" },
          discountType: { type: "string", enum: ["percent", "fixed"] },
          value: { type: "number" },
          minSubtotal: { type: "number" },
          expiresAt: { type: "string", format: "date-time" },
        },
      },
      ShippingQuote: {
        type: "object", required: ["subtotal", "threshold", "fee", "isFree", "amountToFree"],
        properties: {
          subtotal: { type: "number" },
          threshold: { type: "number", example: 99 },
          fee: { type: "number", description: "0 when free, otherwise 4.99" },
          isFree: { type: "boolean" },
          amountToFree: { type: "number" },
          progressPercent: { type: "integer", minimum: 0, maximum: 100 },
        },
      },
      RegisterMemberRequest: {
        type: "object", required: ["email", "password", "confirmPassword"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password", minLength: 8 },
          confirmPassword: { type: "string", format: "password" },
        },
      },
      RegisterMemberResponse: {
        type: "object", required: ["id", "email"],
        properties: { id: { type: "string" }, email: { type: "string", format: "email" }, welcomeCoupon: { type: "string" } },
      },
      ExpressCheckoutRequest: {
        type: "object",
        properties: {
          items: { type: "array", items: ref("AddCartItemRequest"), description: "Omit to check out the current cart" },
          couponCode: { type: "string" },
          shippingAddressId: { type: "string" },
          paymentMethodId: { type: "string" },
        },
      },
      Order: {
        type: "object", required: ["id", "status", "items", "total", "createdAt"],
        properties: {
          id: { type: "string" },
          status: { type: "string", enum: ["pending", "paid", "shipped", "delivered", "cancelled"] },
          items: { type: "array", items: ref("CartItem") },
          subtotal: { type: "number" },
          discount: { type: "number" },
          shippingFee: { type: "number" },
          total: { type: "number" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
} as const;

function paginated(itemSchema: string) {
  return {
    type: "object",
    required: ["data", "page", "limit", "total"],
    properties: {
      data: { type: "array", items: ref(itemSchema) },
      page: { type: "integer" },
      limit: { type: "integer" },
      total: { type: "integer" },
    },
  };
}

function toSummary(p: Product) {
  return {
    id: p.id, name: p.name, brand: p.brand, category: p.category, categorySlug: p.categorySlug,
    price: p.price, originalPrice: p.originalPrice, discountPercent: p.discountPercent,
    rating: p.rating, reviewCount: p.reviewCount, unit: p.unit, inStock: p.inStock,
    stockCount: p.stockCount, isBestSeller: p.isBestSeller ?? false,
    isTopSaver: p.isTopSaver ?? false, isOrganic: p.isOrganic ?? false,
  };
}

function exampleCart() {
  const subtotal = sample.price * 2;
  return {
    id: "cart_01HZX",
    itemCount: 2,
    items: [{
      id: "ci_1", productId: sample.id, name: sample.name, packOptionId: "standard",
      quantity: 2, unitPrice: sample.price, lineTotal: subtotal,
    }],
    couponCode: null,
    subtotal,
    discount: 0,
    shipping: { subtotal, threshold: 99, fee: 0, isFree: true, amountToFree: 0, progressPercent: 100 },
    total: subtotal,
  };
}
