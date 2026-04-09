import {
  index,
  int,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { enabledColumn, softDeleteColumn, timestamps } from "./shared";

export const sysUserSchema = sqliteTable(
  "sys_user",
  {
    id: int("id").primaryKey({ autoIncrement: true }),
    nickname: text("nickname").notNull(),
    username: text("username").notNull(),
    password: text("password").notNull(),
    email: text("email").notNull(),
    avatar: text("avatar"),
    ...enabledColumn(),
    ...timestamps(),
    ...softDeleteColumn(),
  },
  (table) => ({
    usernameIdx: uniqueIndex("sys_user_username_unique").on(table.username),
    emailIdx: uniqueIndex("sys_user_email_unique").on(table.email),
    enabledIdx: index("sys_user_enabled_idx").on(table.enabled),
  }),
);

export type SysUser = typeof sysUserSchema.$inferSelect;
export type NewSysUser = typeof sysUserSchema.$inferInsert;
