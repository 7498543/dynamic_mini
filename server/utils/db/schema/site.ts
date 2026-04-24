import {
  mysqlTable,
  varchar,
  json,
  timestamp,
  int,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';
import { softDeleteColumn, enabledColumn, timestamps } from './shared';

export const siteSettings = mysqlTable('site_settings', {
  id: int('id').primaryKey().autoincrement(),
  key: varchar('key', { length: 64 }).notNull().unique(),
  value: json('value').notNull(),
  ...enabledColumn,
  ...timestamps,
  ...softDeleteColumn,
});
