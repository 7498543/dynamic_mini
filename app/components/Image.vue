<template>
  <img v-bind="$attrs" >
    <template v-if="picture">
      <picture v-for="item in picture" :key="item.srcset" :srcset="item.srcset" :type="item.type"></picture> 
    </template>
  </img>
</template>

<script setup lang="ts">
defineOptions({
  name: "Image",
});

defineProps<{
  picture?: {
    srcset: string;
    type: string;
  }[]
}>(
  
);
</script>
