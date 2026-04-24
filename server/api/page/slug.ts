import { and, eq, isNull } from 'drizzle-orm';
import { z } from 'zod';

const querySchema = z.object({
  slug: z.string().trim().default('/'),
});

export default defineEventHandler(async (event) => {
  try {
    const query = await getValidatedQuery(event, querySchema.safeParse);
    if (!query.success) {
      return badRequestResponse(event, 'Invalid query');
    }
    const normalizedSlug = normalizeSlug(query.data.slug);
    const db = getDB();

    const pageData = await db.query.pageSchema.findFirst({
      where: and(
        eq(pageSchema.slug, normalizedSlug),
        isNull(pageSchema.deletedAt),
        eq(pageSchema.status, 'published')
      ),
    });

    if (!pageData) {
      return notAuthorizedResponse(event, `Page "${normalizedSlug}" not found`);
    }

    const page = {
      ...pageData,
      content: Array.isArray(pageData.content) ? pageData.content : [],
      seo: pageData.seo ?? null,
      i18n: pageData.i18n ?? null,
      meta: pageData.meta ?? null,
    };

    return successResponse(event, { page }, 'Page fetched successfully');
  } catch (error) {
    console.error('Error fetching page:', error);
    return serverFaultResponse(event, 'Internal server error');
  }
});
