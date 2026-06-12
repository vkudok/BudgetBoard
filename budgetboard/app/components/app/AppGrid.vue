<template>
  <div v-if="needGlobalFilter" class="flex pt-4">
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
    class="flex-1 mt-4 border border-gray-300 rounded-[7px]"
  />
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
