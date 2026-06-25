<template>
  <div class="flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
    <div v-if="needGlobalFilter" class="flex shrink-0 pt-4">
      <UInput
        v-model="globalFilter"
        :ui="{ base: 'h-12 text-base' }"
        class="max-w-sm"
        placeholder="Search..."
      >
        <template #leading>
          <UIcon name="i-lucide-search" />
        </template>
      </UInput>
    </div>
    <UTable
      v-model:global-filter="globalFilter"
      sticky
      :loading="isLoading"
      loading-color="secondary"
      loading-animation="carousel"
      :data="data"
      :columns="columns"
      :column-visibility="columnVisibility"
      :meta="meta"
      :ui="{
        root: 'app-grid-scrollbar h-full min-h-0 overflow-auto',
        base: 'min-w-full',
        th: 'bg-gray-100 dark:bg-gray-800',
      }"
      class="min-h-0 flex-1 mt-4 border border-gray-300 dark:border-gray-700 rounded-[7px]"
    />
  </div>
</template>

<script setup lang="ts" generic="T">
  import type { TableColumn } from "@nuxt/ui";
  import type { TableMeta } from "@tanstack/vue-table";

  defineProps<{
    data: T[];
    columns: TableColumn<T>[];
    isLoading: boolean;
    columnVisibility?: Record<string, boolean>;
    meta?: TableMeta<T>;
    needGlobalFilter?: boolean;
  }>();
  const globalFilter = ref("");
</script>

<style scoped>
  :deep(.app-grid-scrollbar) {
    scrollbar-color: rgb(156 163 175 / 0.45) transparent;
    scrollbar-width: thin;
  }

  :deep(.app-grid-scrollbar::-webkit-scrollbar) {
    width: 6px;
    height: 6px;
  }

  :deep(.app-grid-scrollbar::-webkit-scrollbar-track) {
    background: transparent;
  }

  :deep(.app-grid-scrollbar::-webkit-scrollbar-thumb) {
    background-color: rgb(156 163 175 / 0.45);
    border-radius: 999px;
  }

  :deep(.app-grid-scrollbar::-webkit-scrollbar-thumb:hover) {
    background-color: rgb(107 114 128 / 0.65);
  }
</style>
