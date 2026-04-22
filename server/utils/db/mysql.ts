import { drizzle, MySqlDatabase } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema/index";

export interface MySQLConfig {
  url: string;
  connectionLimit?: number;
}

export interface MySQLPool {
  query: MySqlDatabase<typeof schema>;
  close: () => Promise<void>;
  get: () => MySqlDatabase<typeof schema>;
}

export function initMySQLPool(config: MySQLConfig): MySQLPool {
  const url = new URL(config.url);

  if (url.protocol !== "mysql:") {
    throw new Error(`Invalid MySQL connection string: ${config.url}`);
  }

  const database = url.pathname.replace(/^\/+/, "");
  if (!database) {
    throw new Error("MySQL connection string must include a database name");
  }

  const pool = mysql.createPool({
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database,
    waitForConnections: true,
    connectionLimit: config.connectionLimit ?? 10,
    queueLimit: 0,
  });

  const db: MySqlDatabase<typeof schema> = drizzle(pool, { schema, mode: "default" });

  async function close() {
    await pool.end();
  }

  return {
    query: db,
    close,
    get: () => db,
  };
}
