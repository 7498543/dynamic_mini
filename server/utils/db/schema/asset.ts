import { relations } from "drizzle-orm";
import { index, int, json, mysqlTable, text, uniqueIndex, varchar } from "drizzle-orm/mysql-core";
import {
  MYSQL_URL_LENGTH,
  enabledColumn,
  softDeleteColumn,
  sortColumn,
  timestamps,
} from "./shared";

export const imageLibrary = mysqlTable(
  "image_library",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 191 }).notNull(),
    originalName: varchar("original_name", { length: 255 }).notNull(),
    url: varchar("url", { length: MYSQL_URL_LENGTH }).notNull(),
    localPath: varchar("local_path", { length: MYSQL_URL_LENGTH }).notNull(),
    fileSize: int("file_size").notNull().default(0),
    mimeType: varchar("mime_type", { length: 128 }).notNull(),
    width: int("width").default(0),
    height: int("height").default(0),
    metadata: json("metadata")
      .$type<Record<string, unknown>>()
      .notNull()
      .$defaultFn(() => ({})),
    ...enabledColumn(),
    ...sortColumn(),
    ...timestamps(),
    ...softDeleteColumn(),
  },
  (table) => ({
    enabledIdx: index("image_library_enabled_deleted_sort_idx").on(
      table.enabled,
      table.deletedAt,
      table.sort,
    ),
  }),
);

export const imageLibraryTags = mysqlTable(
  "image_library_tags",
  {
    id: int("id").autoincrement().primaryKey(),
    imageId: int("image_id").references(() => imageLibrary.id, {
      onDelete: "cascade",
    }),
    tag: varchar("tag", { length: 120 }).notNull(),
    usedCount: int("used_count").default(0),
    pageViewCount: int("page_view_count").default(0),
    clickCount: int("click_count").default(0),
    ...enabledColumn(),
    ...timestamps(),
    ...softDeleteColumn(),
  },
  (table) => ({
    tagIdx: uniqueIndex("image_library_tags_tag_unique").on(table.tag),
    imageIdx: index("image_library_tags_image_id_idx").on(table.imageId),
    enabledIdx: index("image_library_tags_enabled_deleted_idx").on(
      table.enabled,
      table.deletedAt,
    ),
  }),
);

export const imageRelations = relations(imageLibrary, ({ many }) => ({
  tags: many(imageLibraryTags),
}));

export const imageTagRelations = relations(imageLibraryTags, ({ one }) => ({
  image: one(imageLibrary, {
    fields: [imageLibraryTags.imageId],
    references: [imageLibrary.id],
  }),
}));

export const robots = mysqlTable(
  "robots",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    content: text("content").notNull(),
    ...enabledColumn(),
    ...timestamps(),
    ...softDeleteColumn(),
  },
  (table) => ({
    nameIdx: uniqueIndex("robots_name_unique").on(table.name),
    enabledIdx: index("robots_enabled_deleted_updated_idx").on(
      table.enabled,
      table.deletedAt,
      table.updatedAt,
    ),
  }),
);
