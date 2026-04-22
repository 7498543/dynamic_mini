import { relations } from "drizzle-orm";
import {
  index,
  int,
  mysqlTable,
  primaryKey,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import {
  MYSQL_INDEXED_TEXT_LENGTH,
  MYSQL_URL_LENGTH,
  enabledColumn,
  softDeleteColumn,
  timestamps,
} from "./shared";

export const sysUserSchema = mysqlTable(
  "sys_user",
  {
    id: int("id").autoincrement().primaryKey(),
    nickname: varchar("nickname", { length: 120 }).notNull(),
    username: varchar("username", { length: 64 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    email: varchar("email", { length: MYSQL_INDEXED_TEXT_LENGTH }),
    avatar: varchar("avatar", { length: MYSQL_URL_LENGTH }),
    ...enabledColumn(),
    ...timestamps(),
    ...softDeleteColumn(),
  },
  (table) => ({
    usernameIdx: uniqueIndex("sys_user_username_unique").on(table.username),
    emailIdx: uniqueIndex("sys_user_email_unique").on(table.email),
    enabledIdx: index("sys_user_enabled_deleted_idx").on(
      table.enabled,
      table.deletedAt,
    ),
  }),
);

export const permissionSchema = mysqlTable(
  "sys_permission",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    key: varchar("key", { length: 128 }).notNull(),
    ...enabledColumn(),
    ...timestamps(),
    ...softDeleteColumn(),
  },
  (table) => ({
    keyIdx: uniqueIndex("sys_permission_key_unique").on(table.key),
    enabledIdx: index("sys_permission_enabled_deleted_idx").on(
      table.enabled,
      table.deletedAt,
    ),
  }),
);

export const roleSchema = mysqlTable(
  "sys_role",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    ...enabledColumn(),
    ...timestamps(),
    ...softDeleteColumn(),
  },
  (table) => ({
    nameIdx: uniqueIndex("sys_role_name_unique").on(table.name),
    enabledIdx: index("sys_role_enabled_deleted_idx").on(
      table.enabled,
      table.deletedAt,
    ),
  }),
);

export const rolePermissionSchema = mysqlTable(
  "sys_role_permission",
  {
    roleId: int("role_id")
      .notNull()
      .references(() => roleSchema.id, { onDelete: "cascade" }),
    permissionId: int("permission_id")
      .notNull()
      .references(() => permissionSchema.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.roleId, table.permissionId] }),
  }),
);

export const rolePermissionRelations = relations(
  rolePermissionSchema,
  ({ one }) => ({
    role: one(roleSchema, {
      fields: [rolePermissionSchema.roleId],
      references: [roleSchema.id],
    }),
    permission: one(permissionSchema, {
      fields: [rolePermissionSchema.permissionId],
      references: [permissionSchema.id],
    }),
  }),
);

export const roleRelations = relations(roleSchema, ({ many }) => ({
  permissions: many(rolePermissionSchema),
}));

export const permissionRelations = relations(permissionSchema, ({ many }) => ({
  roles: many(rolePermissionSchema),
}));

export type SysUser = typeof sysUserSchema.$inferSelect;
export type NewSysUser = typeof sysUserSchema.$inferInsert;
export type Permission = typeof permissionSchema.$inferSelect;
export type NewPermission = typeof permissionSchema.$inferInsert;
export type Role = typeof roleSchema.$inferSelect;
export type NewRole = typeof roleSchema.$inferInsert;
export type RolePermission = typeof rolePermissionSchema.$inferSelect;
export type NewRolePermission = typeof rolePermissionSchema.$inferInsert;
