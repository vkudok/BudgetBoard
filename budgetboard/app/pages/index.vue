<template>
  <div class="h-full flex flex-col gap-4">
    <div class="flex justify-between">
      <PageInfoHeader name="Dashboard" />
      <TransactionDialog @on-closed="onLoadData()" />
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
        :value="`${formatCurrency(totalIncomeBalance.total)}₽`"
        type="income"
        :change-percentage="totalIncomeBalance.changePercent"
        description="this month"
      />
      <Widget
        class="flex-1"
        title="Total expenses"
        :value="`${formatCurrency(totalExpenseBalance.total)}₽`"
        type="expense"
        :change-percentage="totalExpenseBalance.changePercent"
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
        <AppGrid :data="data" :columns="indexColumns" :is-loading="isLoading" />
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
  import TransactionDialog from "../components/app/TransactionDialog.vue";
  import PageInfoHeader from "../components/app/PageInfoHeader.vue";
  import Widget from "~/components/app/Widget.vue";
  import { useTransactionService } from "~/features/transactions/services/transactions.service";
  import {
    formatCurrency,
    formatTransactionDate,
    type SummaryCategories,
    type TotalBalance,
    type Transaction,
  } from "~/features/transactions/models/transactions.model";
  import DiagramWidget from "~/components/app/DiagramWidget.vue";
  import type { DiagramWidgetConfig } from "~/components/features/models/diagramWidget.model";
  import DynamicContentWidget from "~/components/app/DynamicContentWidget.vue";
  import AppGrid from "~/components/app/AppGrid.vue";
  import { indexColumns } from "~/features/index/models/index.model";

  const transactionService = useTransactionService();
  const totalBalance = ref<TotalBalance>({
    total: 0,
    changePercent: 0,
  });
  const totalExpenseBalance = ref<TotalBalance>({
    total: 0,
    changePercent: 0,
  });
  const totalIncomeBalance = ref<TotalBalance>({
    total: 0,
    changePercent: 0,
  });
  const totalCount = ref<TotalBalance>({
    total: 0,
    changePercent: 0,
  });
  const summaryCategoriesExpense = ref<SummaryCategories | null>(null);
  const data = ref<Transaction[]>([]);
  const isLoading = ref(false);

  const balanceChartItems = computed(() => {
    let balance = 0;

    return [...data.value]
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

  onMounted(async () => {
    await onLoadData();
  });

  async function onLoadData() {
    isLoading.value = true;
    try {
      totalBalance.value = await transactionService.summary.getTotalBalance();
      totalExpenseBalance.value =
        await transactionService.summary.getExpenseTotalBalance();
      totalIncomeBalance.value =
        await transactionService.summary.getIncomeTotalBalance();
      totalCount.value = await transactionService.summary.getTotalCount();
      summaryCategoriesExpense.value =
        await transactionService.categories.getSummaryCategories("expense");
      data.value = await transactionService.transactions.getTransactions();
    } catch (error) {
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  }
</script>

<style scoped>
  :deep(.balance-chart-tooltip) {
    transform: translateY(-100%);
  }
</style>
