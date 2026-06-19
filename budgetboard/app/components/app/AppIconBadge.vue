<template>
  <span
    :class="[
      'inline-flex size-9 shrink-0 items-center justify-center rounded-full',
      props.direction === 'down'
        ? 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400'
        : 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400',
    ]"
  >
    <ArrowDown
      v-if="props.direction === 'down'"
      aria-hidden="true"
      class="size-5"
      :stroke-width="3"
    />
    <ArrowUp v-else aria-hidden="true" class="size-5" :stroke-width="3" />
  </span>
</template>

<script setup lang="ts">
  import { ArrowDown, ArrowUp } from "@lucide/vue";

  const props = defineProps<{
    direction: "up" | "down";
  }>();
</script>
