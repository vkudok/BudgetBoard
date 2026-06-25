import type { ApexOptions } from "apexcharts";

type ApexChartType =
  | "line"
  | "area"
  | "bar"
  | "pie"
  | "donut"
  | "radialBar"
  | "scatter"
  | "bubble"
  | "heatmap"
  | "candlestick"
  | "boxPlot"
  | "radar"
  | "polarArea"
  | "rangeBar"
  | "rangeArea"
  | "treemap";

type DiagramSeries =
  | number[]
  | {
      name?: string;
      data: number[] | { x: string | number; y: number }[];
    }[];

export type DiagramWidgetConfig = {
  type: ApexChartType;
  series: DiagramSeries;
  options?: ApexOptions;
  height?: number | string;
};
