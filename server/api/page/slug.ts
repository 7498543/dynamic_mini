import { and, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import { getDB } from "@@/server/utils/db";
import { pageSchema } from "@@/server/utils/db/schema";
import { normalizeSlug } from "~~/shared/slug/utils";
import {
  successResponse,
  errorResponse,
  StatusCode,
} from "@@/server/utils/response";

const querySchema = z.object({
  slug: z.string().trim().default("/"),
});

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const rawSlug = Array.isArray(query.slug) ? query.slug[0] : query.slug;
    const { slug } = querySchema.parse({ slug: rawSlug });
    const normalizedSlug = normalizeSlug(slug);
    const db = getDB();

    const pageData = await db.query.pageSchema.findFirst({
      where: and(
        eq(pageSchema.slug, normalizedSlug),
        isNull(pageSchema.deletedAt),
        eq(pageSchema.status, "published"),
      ),
    });

    if (!pageData) {
      return errorResponse(
        StatusCode.NOT_FOUND,
        `Page "${normalizedSlug}" not found`,
      );
    }

    const page = {
      ...pageData,
      content: Array.isArray(pageData.content) ? pageData.content : [],
      seo: pageData.seo ?? null,
      i18n: pageData.i18n ?? null,
      meta: pageData.meta ?? null,
    };

    return successResponse({ page }, "Page fetched successfully");
  } catch (error) {
    console.error("Error fetching page:", error);
    return errorResponse(StatusCode.SERVER_ERROR, "Internal server error");
  }
});
