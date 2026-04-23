import { initDB, closeAllDB } from '../utils/db';

export default defineNitroPlugin(async (nitroApp) => {
  initDB();

  nitroApp.hooks.hook('close', async () => {
    await closeAllDB();
  });
});
