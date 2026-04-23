<template>
  <BlockRender
    v-for="(block, index) in blocks"
    :key="block.id"
    :block="block"
  />
</template>

<script lang="ts" setup>
import type { Page } from '~~/server/utils/db/schema';

const route = useRoute();

const normalizedSlug = computed(() => normalizeSlug(route.path));

const { data, error } = await useAsyncData(
  'page-by-slug',
  () =>
    useHttp<{ page: Page }>('/api/page/slug', {
      method: 'GET',
      query: {
        slug: normalizedSlug.value,
      },
    }),
  {
    watch: [normalizedSlug],
  }
);

const pageError = error.value as {
  statusCode?: number;
  statusMessage?: string;
  message?: string;
} | null;

if (pageError) {
  throw createError({
    statusCode: pageError.statusCode ?? 500,
    statusMessage:
      pageError.statusMessage ?? pageError.message ?? 'Failed to load page',
  });
}

const page = computed(() => data.value?.page ?? null);
const blocks = computed(() => page.value?.content ?? []);
const pageTitle = computed(
  () => page.value?.seo?.title || page.value?.name || normalizedSlug.value
);

const pageDescription = computed(
  () => page.value?.seo?.description || page.value?.description || ''
);

onMounted(() => {
  if (page.value?.layout) {
    setPageLayout(page.value.layout);
  }
});

useSeoMeta({
  title: () => pageTitle.value,
  ogTitle: () => pageTitle.value,
  description: () => pageDescription.value,
  ogDescription: () => pageDescription.value,
});
</script>

<style scoped>
.page-shell {
  min-height: 100vh;
  padding: clamp(24px, 5vw, 56px) 20px;
  background:
    radial-gradient(circle at top, rgba(14, 165, 233, 0.12), transparent 38%),
    linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
}

.page-shell__panel {
  width: min(920px, 100%);
  margin: 0 auto;
  padding: clamp(24px, 4vw, 48px);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(14px);
}

.page-shell__header {
  display: grid;
  gap: 12px;
  margin-bottom: 28px;
}

.page-shell__slug {
  margin: 0;
  color: #0f766e;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.page-shell__title {
  margin: 0;
  color: #0f172a;
  font-size: clamp(32px, 6vw, 56px);
  line-height: 0.95;
}

.page-shell__description {
  max-width: 60ch;
  margin: 0;
  color: #475569;
  font-size: 16px;
  line-height: 1.7;
}

.page-shell__content {
  display: grid;
  gap: 20px;
}

.page-shell__empty {
  padding: 24px;
  border: 1px dashed rgba(15, 118, 110, 0.28);
  border-radius: 20px;
  background: rgba(240, 253, 250, 0.9);
  color: #0f766e;
}

.page-shell__empty p {
  margin: 0;
  line-height: 1.7;
}
</style>
