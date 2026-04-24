import { initMySQLPool } from './mysql';
import type { MySQLPool } from './mysql';

const poolRegistry = new Map<string, MySQLPool>();

export function initDB() {
  const existingPool = poolRegistry.get('main');
  if (existingPool) {
    return existingPool;
  }

  const runtimeConfig = useRuntimeConfig();
  const databaseUrl = runtimeConfig.database.url;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not configured');
  }

  const protocol = new URL(databaseUrl).protocol;
  if (protocol !== 'mysql:') {
    throw new Error(
      `Unsupported database protocol "${protocol}". Only MySQL is supported.`
    );
  }

  const pool = initMySQLPool({ url: databaseUrl });
  poolRegistry.set('main', pool);
  return pool;
}

export function getPool(name = 'main'): MySQLPool {
  const pool = poolRegistry.get(name);
  if (!pool) throw new Error(`DB pool "${name}" not found`);
  return pool;
}

export function getDB(name = 'main') {
  const pool = getPool(name);
  return pool.get();
}

export async function closeAllDB() {
  for (const pool of poolRegistry.values()) {
    await pool.close();
  }
  poolRegistry.clear();
}
