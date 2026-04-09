import { relations } from "drizzle-orm";
import {
  index,
  int,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import {
  enabledColumn,
  softDeleteColumn,
  sortColumn,
  timestamps,
} from "./shared";

export const commoditySchema = sqliteTable(
  "commodity",
  {
    id: int("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    coverImage: text("cover_image"),
    ...enabledColumn(),
    ...sortColumn(),
    ...timestamps(),
    ...softDeleteColumn(),
  },
  (table) => ({
    slugIdx: uniqueIndex("commodity_slug_unique").on(table.slug),
    enabledIdx: index("commodity_enabled_sort_idx").on(
      table.enabled,
      table.sort,
    ),
  }),
);

export const commoditySkuSchema = sqliteTable(
  "commodity_sku",
  {
    id: int("id").primaryKey({ autoIncrement: true }),
    commodityId: int("commodity_id")
      .notNull()
      .references(() => commoditySchema.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    code: text("code").notNull(),
    attributes: text("attributes", { mode: "json" }).$type<Record<
      string,
      unknown
    > | null>(),
    price: int("price").notNull().default(0),
    originalPrice: int("original_price"),
    stock: int("stock").notNull().default(0),
    ...enabledColumn(),
    ...timestamps(),
    ...softDeleteColumn(),
  },
  (table) => ({
    codeIdx: uniqueIndex("commodity_sku_code_unique").on(table.code),
    commodityIdx: index("commodity_sku_commodity_id_idx").on(table.commodityId),
  }),
);

export const commodityRelations = relations(commoditySchema, ({ many }) => ({
  skus: many(commoditySkuSchema),
}));

export const commoditySkuRelations = relations(
  commoditySkuSchema,
  ({ one }) => ({
    commodity: one(commoditySchema, {
      fields: [commoditySkuSchema.commodityId],
      references: [commoditySchema.id],
    }),
  }),
);

export type Commodity = typeof commoditySchema.$inferSelect;
export type NewCommodity = typeof commoditySchema.$inferInsert;
export type CommoditySku = typeof commoditySkuSchema.$inferSelect;
export type NewCommoditySku = typeof commoditySkuSchema.$inferInsert;
