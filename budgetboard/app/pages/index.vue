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
        :value="`${totalBalance.total}₽`"
        type="value"
        :change-percentage="totalBalance.changePercent"
        description="this month"
      />
      <Widget
        class="flex-1"
        title="Total income"
        :value="`${totalIncomeBalance.total}₽`"
        type="income"
        :change-percentage="totalIncomeBalance.changePercent"
        description="this month"
      />
      <Widget
        class="flex-1"
        title="Total expenses"
        :value="`${totalExpenseBalance.total}₽`"
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
      <DynamicContentWidget class="shrink-0" title="Expense categories">
        <DiagramWidget title="Expense categories" :chart="donutExpenseChart" />
      </DynamicContentWidget>
    </div>
  </div>
</template>

<script setup lang="ts">
  import TransactionDialog from "../components/app/TransactionDialog.vue";
  import PageInfoHeader from "../components/app/PageInfoHeader.vue";
  import Widget from "~/components/app/Widget.vue";
  import { useTransactionService } from "~/features/transactions/services/transactions.service";
  import type {
    SummaryCategories,
    TotalBalance,
    Transaction,
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

  async function loadTransactions() {
    isLoading.value = true;
    try {
      data.value = await transactionService.transactions.getTransactions();
    } catch (error) {
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function getSummaryCategories(type: "income" | "expense") {
    return await transactionService.categories.getSummaryCategories(type);
  }

  async function loadTotalValues() {
    try {
      totalBalance.value = await transactionService.summary.getTotalBalance();
      totalExpenseBalance.value =
        await transactionService.summary.getExpenseTotalBalance();
      totalIncomeBalance.value =
        await transactionService.summary.getIncomeTotalBalance();
      totalCount.value = await transactionService.summary.getTotalCount();
    } catch (error) {
      console.error(error);
    }
  }

  async function onLoadData() {
    await loadTotalValues();
    summaryCategoriesExpense.value = await getSummaryCategories("expense");
    await loadTransactions();
  }
</script>
