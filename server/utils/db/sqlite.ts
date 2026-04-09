import { drizzle, LibSQLDatabase } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema/index";

export interface SQLiteConfig {
  url: string;
}

export interface SQLitePool {
  query: LibSQLDatabase<typeof schema>;
  close: () => Promise<void>;
  get: () => LibSQLDatabase<typeof schema>;
}

export function initSQLitePool(config: SQLiteConfig): SQLitePool {
  const client = createClient({ url: config.url });
  const db: LibSQLDatabase<typeof schema> = drizzle({ client, schema });

  async function close() {
    await client.close();
  }

  return {
    query: db,
    close,
    get: () => db,
  };
}
