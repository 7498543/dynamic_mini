import { index, int, json, mysqlTable, text, uniqueIndex, varchar } from "drizzle-orm/mysql-core";
import type { BlockSlotMap } from "~~/types/renderer";
import {
  MYSQL_INDEXED_TEXT_LENGTH,
  enabledColumn,
  softDeleteColumn,
  sortColumn,
  timestamps,
} from "./shared";

export const componentSchema = mysqlTable(
  "component",
  {
    id: int("id").autoincrement().primaryKey(),
    component: varchar("component", {
      length: MYSQL_INDEXED_TEXT_LENGTH,
    }).notNull(),
    displayName: varchar("display_name", { length: 191 }),
    description: text("description"),
    componentProps: json("component_props").$type<Record<string, unknown> | null>(),
    componentSlots: json("component_slots").$type<BlockSlotMap | null>(),
    ...enabledColumn(),
    ...sortColumn(),
    ...timestamps(),
    ...softDeleteColumn(),
  },
  (table) => ({
    componentIdx: uniqueIndex("component_component_unique").on(table.component),
    enabledIdx: index("component_enabled_deleted_sort_idx").on(
      table.enabled,
      table.deletedAt,
      table.sort,
    ),
  }),
);

export type ProjectComponent = typeof componentSchema.$inferSelect;
export type NewProjectComponent = typeof componentSchema.$inferInsert;
