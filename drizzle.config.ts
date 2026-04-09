import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./server/utils/db/schema/index.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
