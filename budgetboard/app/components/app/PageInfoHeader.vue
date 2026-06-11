<template>
  <div class="flex gap-3">
    <h2 class="text-2xl font-semibold">
      {{ name }}
    </h2>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    name: string;
  }>();
</script>
