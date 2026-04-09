import { initSQLitePool } from "./sqlite";

const poolRegistry = new Map<string, SQLitePool>();

export function initDB() {
  const runtimeConfig = useRuntimeConfig();
  const pool = initSQLitePool({ url: runtimeConfig.database.url });
  poolRegistry.set("main", pool);
  return pool;
}

export function getPool(name = "main"): SQLitePool {
  const pool = poolRegistry.get(name);
  if (!pool) throw new Error(`DB pool "${name}" not found`);
  return pool;
}

export function getDB(name = "main") {
  const pool = getPool(name);
  return pool.get();
}

export async function closeAllDB() {
  for (const pool of poolRegistry.values()) {
    await pool.close();
  }
  poolRegistry.clear();
}
