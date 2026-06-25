<template>
  <DynamicContentWidget :title="props.title">
    <div class="flex flex-col h-full">
      <span
        :class="[
          'text-xl font-bold',
          props.type === 'value'
            ? 'text-gray-950 dark:text-gray-50'
            : props.type === 'income'
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400',
        ]"
        >{{ props.value }}</span
      >
      <div class="flex flex-col justify-center flex-1 mt-2">
        <div class="w-full min-w-0">
          <slot v-if="slots.default" />
        </div>
        <div class="flex-1 flex gap-1 items-center">
          <span
            :class="[
              'text-sm ',
              props.changePercentage >= 0 &&
              (props.type === 'income' || props.type === 'value')
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400',
            ]"
            >{{
              (props.changePercentage >= 0 ? `+` : `-`) +
              props.changePercentage
            }}%</span
          >
          <span class="text-sm">{{ props.description }}</span>
        </div>
      </div>
    </div>
  </DynamicContentWidget>
</template>

<script setup lang="ts">
  import DynamicContentWidget from "~/shared/ui/DynamicContentWidget.vue";

  const props = defineProps<{
    title: string;
    value: string;
    type: "income" | "expense" | "value";
    changePercentage: number;
    description: string;
  }>();

  const slots = useSlots();
</script>
