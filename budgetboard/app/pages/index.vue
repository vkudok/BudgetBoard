<template>
  <div>
    <div class="flex justify-between">
      <PageInfoHeader name="Dashboard" />
      <TransactionDialog @on-closed="onLoadData()" />
    </div>
    <div class="flex gap-4 mt-4">
      <Widget
        title="Total balance"
        :value="`${totalBalance.total}₽`"
        type="value"
        :change-percentage="totalBalance.changePercent"
        description="this month"
      />
      <Widget
        title="Total income"
        :value="`${totalIncomeBalance.total}₽`"
        type="income"
        :change-percentage="totalIncomeBalance.changePercent"
        description="this month"
      />
      <Widget
        title="Total expenses"
        :value="`${totalExpenseBalance.total}₽`"
        type="expense"
        :change-percentage="totalExpenseBalance.changePercent"
        description="this month"
      />
      <Widget
        title="Transactions count"
        :value="`${totalCount.total}`"
        type="value"
        :change-percentage="totalCount.changePercent"
        description="this month"
      />
    </div>
    <div class="flex gap-4 mt-4">
      <DiagramWidget title="Expense categories" :chart="donutExpenseChart" />
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
  } from "~/features/transactions/models/transactions.model";
  import DiagramWidget from "~/components/app/DiagramWidget.vue";
  import type { DiagramWidgetConfig } from "~/components/features/models/diagramWidget.model";

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

  const donutExpenseChart = computed<DiagramWidgetConfig>(() => ({
    type: "donut",
    options: {
      labels:
        summaryCategoriesExpense.value?.items.map((item) => item.category) ??
        [],
    },
    series:
      summaryCategoriesExpense.value?.items.map((item) => item.amount) ?? [],
  }));

  onMounted(async () => {
    await onLoadData();
  });

  async function getSummaryCategories(type: "income" | "expense") {
    summaryCategoriesExpense.value =
      await transactionService.categories.getSummaryCategories(type);
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
    await getSummaryCategories("expense");
  }
</script>
