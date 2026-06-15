<template>
  <div
    class="w-50 font-semibold rounded-[7px] border border-gray-300 shadow-sm flex flex-col items-start gap-2 p-4"
  >
    <span class="text-sm">{{ props.title }}</span>
    <span
      :class="[
        'text-xl font-bold',
        props.type === 'value'
          ? 'text-black'
          : props.type === 'income'
            ? 'text-green-600'
            : 'text-red-600',
      ]"
      >{{ props.value }}</span
    >
    <div class="flex gap-1">
      <span
        :class="[
          'text-sm ',
          props.changePercentage >= 0 && (props.type === 'income' || props.type === 'value') ? 'text-green-600' : 'text-red-600',
        ]"
        >{{
          (props.changePercentage >= 0 ? `+` : `-`) + props.changePercentage
        }}%</span
      >
      <span class="text-sm">{{ props.description }}</span>
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
</script>
