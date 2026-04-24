// server/api/config.get.ts
import { getSiteConfig } from '../utils/config';

export default defineEventHandler(async () => {
  const config = await getSiteConfig();

  return config;
});
