import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import {
  enabledColumn,
  softDeleteColumn,
  sortColumn,
  timestamps,
} from "./shared";

// 图库
export const imageLibrary = sqliteTable("image_library", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  url: text("url").notNull(),
  localPath: text("local_path").notNull(),
  tags: text("tags").default("[]"),
  metadata: text("metadata", { mode: "json" }).notNull().default("[]"),
  ...enabledColumn(),
  ...timestamps(),
  ...softDeleteColumn(),
});

// 图库标签
export const imageLibraryTags = sqliteTable("image_library_tags", {
  id: int("id").primaryKey({ autoIncrement: true }),
  tag: text("tag").notNull(),
  usedCount: int("used_count").default(0),
  pageViewCount: int("page_view_count").default(0),
  clickCount: int("click_count").default(0),
  ...enabledColumn(),
  ...timestamps(),
  ...softDeleteColumn(),
});

// 站点机器人协议
export const robots = sqliteTable("robots", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  content: text("content").notNull(),
  ...enabledColumn(),
  ...timestamps(),
  ...softDeleteColumn(),
});
