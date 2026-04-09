import { int } from "drizzle-orm/sqlite-core";

export function timestamps() {
  return {
    createdAt: int("created_at", { mode: "timestamp" })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: int("updated_at", { mode: "timestamp" })
      .$defaultFn(() => new Date())
      .notNull(),
  };
}

export function enabledColumn() {
  return {
    enabled: int("enabled", { mode: "boolean" }).notNull().default(true),
  };
}

export function sortColumn() {
  return {
    sort: int("sort").notNull().default(0),
  };
}

export function softDeleteColumn() {
  return {
    deletedAt: int("deleted_at").notNull().default(0),
  };
}
