import { and, desc, eq, isNull } from "drizzle-orm";
import { getDB } from "../utils/db";
import { robots } from "../utils/db/schema";
import { createLogger } from "#server/utils/logger";

const defaultRobots = `User-agent: *
Allow: /`;

export default defineEventHandler(async (event) => {
  const logger = createLogger();
  logger.info("Get robots.txt", {
    path: event.path,
    method: event.method,
  });

  try {
    const db = getDB();

    const robot = await db.query.robots.findFirst({
      where: and(eq(robots.enabled, true), isNull(robots.deletedAt)),
      orderBy: [desc(robots.updatedAt), desc(robots.createdAt)],
    });

    setHeader(event, "Content-Type", "text/plain; charset=utf-8");
    return robot?.content || defaultRobots;
  } catch (error) {
    logger.error("Error fetching robots.txt", error);
    setHeader(event, "Content-Type", "text/plain; charset=utf-8");
    return defaultRobots;
  }
});
