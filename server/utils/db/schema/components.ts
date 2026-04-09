import {
  index,
  int,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import type { BlockSlotMap } from "~~/types/renderer";
import {
  enabledColumn,
  softDeleteColumn,
  sortColumn,
  timestamps,
} from "./shared";

export const componentSchema = sqliteTable(
  "component",
  {
    id: int("id").primaryKey({ autoIncrement: true }),
    component: text("component").notNull(),
    displayName: text("display_name"),
    description: text("description"),
    componentProps: text("component_props", { mode: "json" }).$type<Record<
      string,
      unknown
    > | null>(),
    componentSlots: text("component_slots", {
      mode: "json",
    }).$type<BlockSlotMap | null>(),
    ...enabledColumn(),
    ...sortColumn(),
    ...timestamps(),
    ...softDeleteColumn(),
  },
  (table) => ({
    componentIdx: uniqueIndex("component_component_unique").on(table.component),
    enabledIdx: index("component_enabled_sort_idx").on(
      table.enabled,
      table.sort,
    ),
  }),
);

export type ProjectComponent = typeof componentSchema.$inferSelect;
export type NewProjectComponent = typeof componentSchema.$inferInsert;
