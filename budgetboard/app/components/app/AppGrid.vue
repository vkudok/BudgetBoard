<template>
  <UTable
    :loading="isLoading"
    loading-color="secondary"
    loading-animation="carousel"
    :data="data"
    :columns="columns"
    :column-visibility="columnVisibility"
    :meta="meta"
    class="flex-1 mt-5"
  />
</template>

<script setup lang="ts" generic="T">
import type {TableColumn} from '@nuxt/ui'
import type {TableMeta} from "@tanstack/vue-table";

defineProps<{
  data: T[]
  columns: TableColumn<T>[]
  columnVisibility?: Record<string, boolean>,
  meta?: TableMeta<T>
  isLoading: boolean
}>()
</script>
