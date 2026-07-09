<template>
  <div class="flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
    <div
      v-if="props.globalFilterInfo?.filters.length"
      class="flex items-end gap-3 pt-4"
    >
      <UInput
        v-if="props.globalFilterInfo.needSearch"
        v-model="globalFilter"
        :ui="{ base: 'h-12 text-base' }"
        placeholder="Search..."
      >
        <template #leading>
          <UIcon name="i-lucide-search" />
        </template>
      </UInput>
      <TransactionFilters
        :filters="props.globalFilterInfo.filters"
        :values="filterValues"
        @update-filter-value="updateFilterValue"
      />
    </div>
    <UTable
      v-model:global-filter="globalFilter"
      sticky
      :loading="isLoading"
      loading-color="secondary"
      loading-animation="carousel"
      :data="filteredData"
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

<script setup lang="ts" generic="T, K extends object = Record<string, never>">
  import TransactionFilters from "~/shared/ui/TransactionFilters.vue";
  import type { GridConfig } from "~/shared/models/appGrid.model";

  const props = defineProps<GridConfig<T, K>>();
  const globalFilter = ref("");

  const filterValues = reactive<Record<string, K[keyof K] | undefined>>({});

  const filteredData = computed(() => {
    if (!props.globalFilterInfo?.filters.length) {
      return props.data;
    }

    return props.data.filter((row) => {
      return props.globalFilterInfo?.filters.every((filter) => {
        const key = String(filter.key);
        const filterValue = filterValues[key];

        if (
          filterValue === "" ||
          filterValue === undefined ||
          filterValue === null ||
          filterValue === filter.defaultValue
        ) {
          return true;
        }

        const rowValue = row[key as keyof typeof row];

        return String(rowValue)
          .toLowerCase()
          .includes(String(filterValue).toLowerCase());
      });
    });
  });

  watchEffect(() => {
    props.globalFilterInfo?.filters.forEach((filter) => {
      const key = String(filter.key);

      if (!(key in filterValues)) {
        filterValues[key] = filter.defaultValue;
      }
    });
  });

  function updateFilterValue(key: keyof K, value: K[keyof K]) {
    filterValues[String(key)] = value;
  }
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
