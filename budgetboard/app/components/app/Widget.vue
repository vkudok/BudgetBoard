<template>
  <div
    class="font-semibold rounded-[7px] border border-gray-300 dark:border-gray-700 shadow-sm flex flex-col items-start gap-2 p-4"
  >
    <span class="text-sm">{{ props.title }}</span>
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
    <div class="flex flex-col justify-center flex-1">
      <slot v-if="slots.default" />
      <div class="flex gap-1">
        <span
          :class="[
            'text-sm ',
            props.changePercentage >= 0 &&
            (props.type === 'income' || props.type === 'value')
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400',
          ]"
          >{{
            (props.changePercentage >= 0 ? `+` : `-`) + props.changePercentage
          }}%</span
        >
        <span class="text-sm">{{ props.description }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    title: string;
    value: string;
    type: "income" | "expense" | "value";
    changePercentage: number;
    description: string;
  }>();

  const slots = useSlots();
</script>
