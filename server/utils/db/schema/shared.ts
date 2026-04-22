import { boolean, int, timestamp } from "drizzle-orm/mysql-core";

export const MYSQL_INDEXED_TEXT_LENGTH = 191;
export const MYSQL_URL_LENGTH = 512;

export function timestamps() {
  return {
    createdAt: timestamp("created_at", { mode: "string" })
      .default("CURRENT_TIMESTAMP")
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .default("CURRENT_TIMESTAMP")
      .$onUpdate(() => "CURRENT_TIMESTAMP")
      .notNull(),
  };
}

export function enabledColumn() {
  return {
    enabled: boolean("enabled").notNull().default(true),
  };
}

export function sortColumn() {
  return {
    sort: int("sort").notNull().default(0),
  };
}

export function softDeleteColumn() {
  return {
    deletedAt: timestamp("deleted_at", { mode: "string" }),
  };
}
