<template>
  <div
    class="min-w-0 min-h-0 max-w-full font-semibold content-center rounded-[7px] border border-gray-300 dark:border-gray-700 shadow-sm flex flex-col items-start gap-2 overflow-hidden p-4"
  >
    <span class="text-sm">{{ props.title }}</span>

    <div class="w-full min-w-0 min-h-0 max-w-full flex-1 overflow-auto">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    title: string;
  }>();
</script>
