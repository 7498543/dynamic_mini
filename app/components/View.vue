<template>
  <component
    :is="tag"
    v-bind="$attrs"
  >
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

withDefaults(
  defineProps<{
    tag?: string;
  }>(),
  {
    tag: "div",
  },
);
</script>
