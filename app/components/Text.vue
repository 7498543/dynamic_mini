<template>
  <component
    :is="tag"
    v-bind="$attrs"
  >
    <slot v-if="$slots.default"></slot>
    <template v-else>{{ text }}</template>
  </component>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

withDefaults(
  defineProps<{
    tag?: string;
    text?: string;
  }>(),
  {
    tag: "span",
    text: "",
  },
);
</script>
