<template>
  <div class="h-full flex flex-col gap-4">
    <div class="flex justify-between">
      <PageInfoHeader name="Dashboard" />
      <TransactionDialog @on-closed="refreshAll()" />
    </div>
    <div class="flex gap-4">
      <Widget
        class="flex-1"
        title="Total balance"
        :value="`${formatCurrency(totalBalance.total)}₽`"
        type="value"
        :change-percentage="totalBalance.changePercent"
        description="this month"
      >
        <div class="mb-5">
          <DiagramWidget :chart="dataForChart" />
        </div>
      </Widget>
      <Widget
        class="flex-1"
        title="Total income"
        :value="`${formatCurrency(incomeTotalBalance.total)}₽`"
        type="income"
        :change-percentage="incomeTotalBalance.changePercent"
        description="this month"
      />
      <Widget
        class="flex-1"
        title="Total expenses"
        :value="`${formatCurrency(expenseTotalBalance.total)}₽`"
        type="expense"
        :change-percentage="expenseTotalBalance.changePercent"
        description="this month"
      />
      <Widget
        class="flex-1"
        title="Transactions count"
        :value="`${totalCount.total}`"
        type="value"
        :change-percentage="totalCount.changePercent"
        description="this month"
      />
    </div>
    <div class="flex min-h-0 flex-1 items-start gap-4 overflow-hidden">
      <DynamicContentWidget
        class="flex-1 self-stretch"
        title="Recent categories"
      >
        <AppGrid
          :data="transactionsList"
          :columns="indexColumns"
          :is-loading="isLoading.value"
        />
      </DynamicContentWidget>
      <DynamicContentWidget
        v-if="!!summaryCategoriesExpense?.items.length"
        class="shrink-0"
        title="Expense categories"
      >
        <DiagramWidget :chart="donutExpenseChart" />
      </DynamicContentWidget>
    </div>
  </div>
</template>

<script setup lang="ts">
  import TransactionDialog from "~/features/transactions/ui/TransactionDialog.vue";
  import PageInfoHeader from "~/shared/ui/PageInfoHeader.vue";
  import Widget from "~/shared/ui/Widget.vue";
  import {
    formatCurrency,
    formatTransactionDate,
  } from "~/features/transactions/models/transactions.model";
  import DiagramWidget from "~/shared/ui/DiagramWidget.vue";
  import type { DiagramWidgetConfig } from "~/shared/models/diagramWidget.model";
  import DynamicContentWidget from "~/shared/ui/DynamicContentWidget.vue";
  import AppGrid from "~/shared/ui/AppGrid.vue";
  import { indexColumns } from "~/features/index/models/index.model";
  import { useTransactions } from "~/features/transactions/composables/useTransactions";
  import { useTotal } from "~/features/transactions/composables/useTotal";
  import { useSummaryCategories } from "~/features/transactions/composables/useSummaryCategories";

  const totalData = useTotal();
  const transactionData = useTransactions();
  const summaryCategoriesData = useSummaryCategories("expense");

  const summaryCategoriesExpense = summaryCategoriesData.summary;
  const totalBalance = totalData.totalBalance;
  const expenseTotalBalance = totalData.expenseTotalBalance;
  const incomeTotalBalance = totalData.incomeTotalBalance;
  const totalCount = totalData.getTotalCount;
  const transactionsList = transactionData.data.transactionsList;
  const isLoading = computed(
    () =>
      totalData.loading ||
      transactionData.loading ||
      summaryCategoriesData.loading,
  );

  const balanceChartItems = computed(() => {
    let balance = 0;

    return [...transactionsList.value]
      .sort((currentTransaction, nextTransaction) => {
        return (
          new Date(currentTransaction.date).getTime() -
          new Date(nextTransaction.date).getTime()
        );
      })
      .map((transaction) => {
        const amount =
          transaction.type === "income"
            ? transaction.amount
            : -transaction.amount;

        balance += amount;

        return {
          date: transaction.date,
          balance: Math.max(balance, 0),
        };
      });
  });

  const dataForChart = computed<DiagramWidgetConfig>(() => ({
    type: "line",
    series: [
      {
        name: "Balance",
        data: balanceChartItems.value.map((item) => item.balance),
      },
    ],
    height: "30px",
    options: {
      xaxis: {
        categories: balanceChartItems.value.map((item) =>
          formatTransactionDate(item.date),
        ),
      },
      chart: {
        background: "transparent",
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
      },
      stroke: {
        curve: "smooth",
        width: 3,
        colors: ["#00a63e"],
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return `${formatCurrency(val)}₽`;
          },
        },
        cssClass: "balance-chart-tooltip",
      },
      grid: {
        show: false,
      },
    },
  }));

  const donutExpenseChart = computed<DiagramWidgetConfig>(() => ({
    type: "donut",
    options: {
      labels:
        summaryCategoriesExpense.value?.items.map((item) => item.category) ??
        [],
      dataLabels: {
        enabled: false,
      },
      legend: {
        fontWeight: 700,
        formatter: function (val, opts) {
          return `${val} <br/> ₽${opts?.w.globals.seriesTotals[opts.seriesIndex]} (${Math.floor(opts?.w.globals.seriesPercent[opts.seriesIndex])}%)`;
        },
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                showAlways: true,
                show: true,
              },
            },
          },
        },
      },
    },
    series:
      summaryCategoriesExpense.value?.items.map((item) => item.amount) ?? [],
  }));

  async function refreshAll() {
    await Promise.all([
      totalData.refresh(),
      transactionData.refresh(),
      summaryCategoriesData.refresh(),
    ]);
  }
</script>

<style scoped>
  :deep(.balance-chart-tooltip) {
    transform: translateY(-100%);
  }
</style>
