<template></template>

<script lang="ts" setup>
import { useRoute } from "vue-router";

const route = useRoute();
const props = defineProps({
  error: Object,
});
</script>
