<template>
  <div
    class="font-semibold rounded-[7px] border border-gray-300 dark:border-gray-700 shadow-sm flex flex-col items-start gap-2 p-4"
  >
    <span class="text-sm">{{ props.title }}</span>
    <ClientOnly>
      <ApexChart
        :height="chart.height"
        :type="chart.type"
        :series="chart.series"
        :options="chart.options ?? {}"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
  import ApexChart from "vue3-apexcharts";
  import type { DiagramWidgetConfig } from "~/components/features/models/diagramWidget.model";

  const props = defineProps<{
    title: string;
    chart: DiagramWidgetConfig;
  }>();
</script>
