import { initializeData } from "@@/server/utils/db/initialize";

export default defineEventHandler(async () => {
  await initializeData();

  return {
    success: true,
  };
});
