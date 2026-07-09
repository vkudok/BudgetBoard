<template>
  <div class="flex gap-3 w-full">
    <UFormField
      v-for="filter in filters"
      :key="String(filter.key)"
      :label="filter.label"
      :name="String(filter.key)"
      class="flex-1"
    >
      <USelect
        v-if="filter.type === 'select'"
        :model-value="values[String(filter.key)]"
        @update:model-value="updateFilterValue(filter.key, $event)"
        :items="filter.options"
        class="w-full"
        :ui="{ base: 'h-12 text-base' }"
      />
      <UInput
        v-else-if="filter.type === 'number'"
        :model-value="values[String(filter.key)]"
        @update:model-value="updateFilterValue(filter.key, Number($event))"
        type="number"
        class="w-full"
        :ui="{ base: 'h-12 text-base' }"
        :placeholder="filter.placeholder"
      />
      <UInput
        v-else-if="filter.type === 'date'"
        :model-value="values[String(filter.key)]"
        @update:model-value="updateFilterValue(filter.key, $event)"
        type="date"
        class="w-full"
        :ui="{ base: 'h-12 text-base' }"
        :placeholder="filter.placeholder"
      />
      <UInput
        v-else
        :model-value="values[String(filter.key)]"
        @update:model-value="updateFilterValue(filter.key, $event)"
        type="text"
        class="w-full"
        :ui="{ base: 'h-12 text-base' }"
        :placeholder="filter.placeholder"
      />
    </UFormField>
  </div>
</template>
<script setup lang="ts" generic="K extends object">
  import type { FilterConfig } from "~/shared/models/appGrid.model";

  defineProps<{
    filters: FilterConfig<K>[];
    values: Record<string, K[keyof K] | undefined>;
  }>();

  const emit = defineEmits<{
    updateFilterValue: [key: keyof K, value: K[keyof K]];
  }>();

  function updateFilterValue(key: keyof K, value: K[keyof K]) {
    emit("updateFilterValue", key, value);
  }
</script>
