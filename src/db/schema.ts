import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  decimal,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  description: text("description").default(""),
  category: varchar("category", { length: 100 }).default("General"),
  imageUrl: text("image_url").notNull(),
  images: jsonb("images").$type<string[]>().default([]),
  videoUrl: text("video_url"),
  benefits: jsonb("benefits").$type<string[]>().default([]), // ["Anti-aging", "Hydrating"]
  ingredients: text("ingredients").default(""),
  howToUse: text("how_to_use").default(""),
  warnings: text("warnings").default(""),
  isPrescriptionRequired: integer("is_prescription_required").default(0).notNull(),
  sku: varchar("sku", { length: 100 }),
  views: integer("views").default(0).notNull(),
  isActive: integer("is_active").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sliders = pgTable("sliders", {
  id: uuid("id").defaultRandom().primaryKey(),
  imageUrl: text("image_url").notNull(),
  title: varchar("title", { length: 255 }).default(""),
  subtitle: varchar("subtitle", { length: 500 }).default(""),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id"),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }).notNull(),
  customerName: varchar("customer_name", { length: 255 }).default(""),
  address: text("address").notNull(),
  landmark: varchar("landmark", { length: 255 }).default(""),
  postalCode: varchar("postal_code", { length: 20 }).default(""),
  items: jsonb("items").notNull(),
  deliveryFee: decimal("delivery_fee", { precision: 10, scale: 2 }).default("0"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).default("COD").notNull(),
  paymentStatus: varchar("payment_status", { length: 50 }).default("Pending").notNull(), // Pending, Paid, Failed
  transactionId: varchar("transaction_id", { length: 255 }),
  status: varchar("status", { length: 50 }).default("Pending").notNull(), // Pending, Confirmed, Processing, Shipped, Delivered, Cancelled
  trackingNumber: varchar("tracking_number", { length: 255 }),
  notes: text("notes"),
  statusHistory: jsonb("status_history").$type<{status: string, timestamp: string, note: string}[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).default(""),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 50 }).default(""),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const settings = pgTable("settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: text("value").notNull(),
});

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).default(""),
  rating: integer("rating").default(5).notNull(),
  text: text("text").notNull(),
  imageUrl: text("image_url"),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const complaints = pgTable("complaints", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).default(""),
  email: varchar("email", { length: 255 }).notNull(),
  orderId: varchar("order_id", { length: 255 }).default(""),
  subject: varchar("subject", { length: 255 }).default(""),
  message: text("message").notNull(),
  status: varchar("status", { length: 50 }).default("Open").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Wishlist system
export const wishlists = pgTable("wishlists", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Product bundles/combos
export const bundles = pgTable("bundles", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").default(""),
  imageUrl: text("image_url"),
  productIds: jsonb("product_ids").$type<string[]>().notNull(),
  regularPrice: decimal("regular_price", { precision: 10, scale: 2 }).notNull(),
  discountedPrice: decimal("discounted_price", { precision: 10, scale: 2 }).notNull(),
  isActive: integer("is_active").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Analytics events
export const analyticsEvents = pgTable("analytics_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventType: varchar("event_type", { length: 100 }).notNull(), // page_view, product_view, add_to_cart, purchase
  userId: uuid("user_id"),
  sessionId: varchar("session_id", { length: 255 }),
  productId: uuid("product_id"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Prescriptions
export const prescriptions = pgTable("prescriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "cascade" }),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }).notNull(),
  prescriptionUrl: text("prescription_url").notNull(),
  productIds: jsonb("product_ids").$type<string[]>(),
  status: varchar("status", { length: 50 }).default("Pending").notNull(), // Pending, Approved, Rejected
  reviewedBy: varchar("reviewed_by", { length: 255 }),
  reviewNotes: text("review_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at"),
});

// Translations for multi-language
export const translations = pgTable("translations", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  en: text("en").notNull(),
  ur: text("ur").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Payment methods
export const paymentMethods = pgTable("payment_methods", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(), // COD, JazzCash, EasyPaisa, Card
  isActive: integer("is_active").default(1).notNull(),
  config: jsonb("config"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Loyalty points
export const loyaltyPoints = pgTable("loyalty_points", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  points: integer("points").default(0).notNull(),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "set null" }),
  reason: varchar("reason", { length: 255 }).default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Product inventory tracking
export const inventory = pgTable("inventory", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull().unique(),
  stockQuantity: integer("stock_quantity").default(0).notNull(),
  lowStockThreshold: integer("low_stock_threshold").default(10).notNull(),
  isInStock: integer("is_in_stock").default(1).notNull(),
  lastRestocked: timestamp("last_restocked"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// WhatsApp chat history
export const chatHistory = pgTable("chat_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  userPhone: varchar("user_phone", { length: 50 }).notNull(),
  userName: varchar("user_name", { length: 255 }).default(""),
  userEmail: varchar("user_email", { length: 255 }).default(""),
  messages: jsonb("messages").$type<{role: string, content: string, timestamp: string}[]>().default([]),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "set null" }),
  status: varchar("status", { length: 50 }).default("Active").notNull(), // Active, Completed, Transferred
  conversationType: varchar("conversation_type", { length: 50 }).default("Support").notNull(), // Support, OrderTracking, ProductInfo
  shiftedToWhatsApp: integer("shifted_to_whatsapp").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
