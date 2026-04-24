import { eq } from 'drizzle-orm';
import { siteSettings } from '../db/schema/site';

const storage = useStorage('cache');

const CACHE_KEY = 'site:config';

export async function getSiteConfig() {
  const cached = await storage.getItem(CACHE_KEY);
  if (cached) return cached;
  const db = getDB();

  const rows = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.enabled, true), eq(siteSettings.value, null));

  const result: Record<string, any> = {};
  for (const row of rows) {
    result[row.key] = row.value;
  }

  await storage.setItem(CACHE_KEY, result);
  return result;
}

export async function updateSiteConfig(config: Record<string, any>) {
  const db = getDB();
  await db.insert(siteSettings).values(config);

  // cache invalidate
  await storage.removeItem(CACHE_KEY);
}
