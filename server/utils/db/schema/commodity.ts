import { relations } from "drizzle-orm";
import { index, int, json, mysqlTable, text, uniqueIndex, varchar } from "drizzle-orm/mysql-core";
import {
  MYSQL_INDEXED_TEXT_LENGTH,
  MYSQL_URL_LENGTH,
  enabledColumn,
  softDeleteColumn,
  sortColumn,
  timestamps,
} from "./shared";

export const commoditySchema = mysqlTable(
  "commodity",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 191 }).notNull(),
    slug: varchar("slug", { length: MYSQL_INDEXED_TEXT_LENGTH }).notNull(),
    description: text("description"),
    coverImage: varchar("cover_image", { length: MYSQL_URL_LENGTH }),
    ...enabledColumn(),
    ...sortColumn(),
    ...timestamps(),
    ...softDeleteColumn(),
  },
  (table) => ({
    slugIdx: uniqueIndex("commodity_slug_unique").on(table.slug),
    enabledIdx: index("commodity_enabled_deleted_sort_idx").on(
      table.enabled,
      table.deletedAt,
      table.sort,
    ),
  }),
);

export const commoditySkuSchema = mysqlTable(
  "commodity_sku",
  {
    id: int("id").autoincrement().primaryKey(),
    commodityId: int("commodity_id")
      .notNull()
      .references(() => commoditySchema.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 191 }).notNull(),
    code: varchar("code", { length: MYSQL_INDEXED_TEXT_LENGTH }).notNull(),
    attributes: json("attributes").$type<Record<string, unknown> | null>(),
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
