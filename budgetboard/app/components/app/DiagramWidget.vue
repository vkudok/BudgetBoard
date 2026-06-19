<template>
  <ClientOnly>
    <div class="h-full flex items-center">
      <ApexChart
        :height="props.chart.height"
        :type="props.chart.type"
        :series="props.chart.series"
        :options="props.chart.options ?? {}"
      />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
  import ApexChart from "vue3-apexcharts";
  import type { DiagramWidgetConfig } from "~/components/features/models/diagramWidget.model";

  const props = defineProps<{
    chart: DiagramWidgetConfig;
  }>();
</script>
