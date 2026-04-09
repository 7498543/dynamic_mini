<template>
  <component
    :is="renderComponent(block.component)"
    v-bind="block.componentProps ?? {}"
  >
    <template
      v-for="slotEntry in slotEntries"
      :key="slotEntry.name"
      #[slotEntry.name]
    >
      <template
        v-for="(child, index) in slotEntry.blocks"
        :key="child.id ?? `${slotEntry.name}-${index}`"
      >
        <template
          v-if="
            child.component === 'Text' &&
            typeof child.componentSlots === 'string'
          "
        >
          {{ child.componentSlots }}
        </template>
        <BlockRender v-else :block="child" :visited-blocks="visitedBlocks" />
      </template>
    </template>
  </component>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { Block, BlockSlotMap } from "~~/types/renderer";
import { useComponentMap } from "~/composables/useComponentMap";

defineOptions({
  name: "BlockRender",
});

const props = defineProps<{
  block: Block;
  visitedBlocks?: Set<number>;
}>();

const visitedBlocks = props.visitedBlocks || new Set<number>();

// Use component map composable
const { getComponent } = useComponentMap();

const slotEntries = computed(() => {
  const componentSlots = props.block.componentSlots;

  if (!componentSlots) {
    return [] as Array<{ name: string; blocks: Block[] }>;
  }

  let normalizedSlots: BlockSlotMap;
  if (Array.isArray(componentSlots)) {
    normalizedSlots = { default: componentSlots };
  } else if (typeof componentSlots === "string") {
    // Handle string slots by creating a text block
    normalizedSlots = {
      default: [
        {
          component: "Text",
          componentProps: {},
          componentSlots: componentSlots,
        },
      ],
    };
  } else {
    normalizedSlots = componentSlots;
  }

  return Object.entries(normalizedSlots)
    .filter(([, blocks]) => Array.isArray(blocks) && blocks.length > 0)
    .map(([name, blocks]) => ({
      name,
      blocks,
    }));
});

function renderComponent(name: string) {
  return getComponent(name);
}
</script>
