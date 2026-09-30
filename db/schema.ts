import {
  pgTable,
  text,
  serial,
  timestamp,
  doublePrecision,
} from "drizzle-orm/pg-core"

export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  item: text("item").notNull(),
  quantity: doublePrecision("quantity").notNull(),
  unit: text("unit").notNull(),
  supplier: text("supplier"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  amount: doublePrecision("amount").notNull(),
  paidTo: text("paid_to"),
  paymentMode: text("payment_mode"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})
