import { relations } from "drizzle-orm";
import {
  index,
  int,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import type { Block, I18nMap, Meta, Seo } from "../../../../types/renderer";
import { softDeleteColumn, sortColumn, timestamps } from "./shared";

export const pageSchema = sqliteTable(
  "page",
  {
    id: int("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    description: text("description"),
    slug: text("slug").notNull(),
    layout: text("layout").notNull().default("default"),
    status: text("status").notNull().default("published"),
    content: text("content", { mode: "json" }).$type<Block[] | null>(),
    seo: text("seo", { mode: "json" }).$type<Seo | null>(),
    i18n: text("i18n", { mode: "json" }).$type<I18nMap | null>(),
    meta: text("meta", { mode: "json" }).$type<Meta | null>(),
    publishedAt: int("published_at", { mode: "timestamp" }),
    ...sortColumn(),
    ...timestamps(),
    ...softDeleteColumn(),
  },
  (table) => ({
    slugIdx: uniqueIndex("page_slug_unique").on(table.slug),
    statusIdx: index("page_status_sort_idx").on(table.status, table.sort),
  }),
);

export const pageVersion = sqliteTable(
  "page_version",
  {
    id: int("id").primaryKey({ autoIncrement: true }),
    pageId: int("page_id")
      .notNull()
      .references(() => pageSchema.id, { onDelete: "cascade" }),
    version: int("version").notNull(),
    layout: text("layout").notNull().default("default"),
    content: text("content", { mode: "json" }).$type<Block[] | null>(),
    seo: text("seo", { mode: "json" }).$type<Seo | null>(),
    i18n: text("i18n", { mode: "json" }).$type<I18nMap | null>(),
    meta: text("meta", { mode: "json" }).$type<Meta | null>(),
    note: text("note"),
    createdAt: int("created_at", { mode: "timestamp" })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => ({
    pageIdIdx: index("page_version_page_id_idx").on(table.pageId),
    pageVersionIdx: uniqueIndex("page_version_page_id_version_unique").on(
      table.pageId,
      table.version,
    ),
  }),
);

export const pageRelations = relations(pageSchema, ({ many }) => ({
  versions: many(pageVersion),
}));

export const pageVersionRelations = relations(pageVersion, ({ one }) => ({
  page: one(pageSchema, {
    fields: [pageVersion.pageId],
    references: [pageSchema.id],
  }),
}));

export type Page = typeof pageSchema.$inferSelect;
export type NewPage = typeof pageSchema.$inferInsert;
export type PageVersion = typeof pageVersion.$inferSelect;
export type NewPageVersion = typeof pageVersion.$inferInsert;
