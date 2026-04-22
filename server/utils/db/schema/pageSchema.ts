import { relations } from "drizzle-orm";
import {
  index,
  int,
  json,
  mysqlTable,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import type { Block, I18nMap, Meta, Seo } from "../../../../types/renderer";
import {
  MYSQL_INDEXED_TEXT_LENGTH,
  softDeleteColumn,
  sortColumn,
  timestamps,
} from "./shared";

export const pageSchema = mysqlTable(
  "page",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 191 }).notNull(),
    description: varchar("description", { length: 512 }),
    slug: varchar("slug", { length: MYSQL_INDEXED_TEXT_LENGTH }).notNull(),
    layout: varchar("layout", { length: 64 }).notNull().default("default"),
    status: varchar("status", { length: 32 }).notNull().default("published"),
    content: json("content").$type<Block[] | null>(),
    seo: json("seo").$type<Seo | null>(),
    i18n: json("i18n").$type<I18nMap | null>(),
    meta: json("meta").$type<Meta | null>(),
    publishedAt: timestamp("published_at"),
    ...sortColumn(),
    ...timestamps(),
    ...softDeleteColumn(),
  },
  (table) => ({
    slugIdx: uniqueIndex("page_slug_unique").on(table.slug),
    visibilityIdx: index("page_status_deleted_sort_idx").on(
      table.status,
      table.deletedAt,
      table.sort,
    ),
    publishedIdx: index("page_published_at_idx").on(table.publishedAt),
  }),
);

export const pageVersion = mysqlTable(
  "page_version",
  {
    id: int("id").autoincrement().primaryKey(),
    pageId: int("page_id")
      .notNull()
      .references(() => pageSchema.id, { onDelete: "cascade" }),
    version: int("version").notNull(),
    layout: varchar("layout", { length: 64 }).notNull().default("default"),
    content: json("content").$type<Block[] | null>(),
    seo: json("seo").$type<Seo | null>(),
    i18n: json("i18n").$type<I18nMap | null>(),
    meta: json("meta").$type<Meta | null>(),
    note: varchar("note", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
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
