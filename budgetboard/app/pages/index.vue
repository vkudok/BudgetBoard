<template>
  <div>
    <div class="flex justify-between">
      <PageInfoHeader name="Dashboard" />
      <TransactionDialog />
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
  </div>
</template>

<script setup lang="ts">
  import TransactionDialog from "../components/app/TransactionDialog.vue";
  import PageInfoHeader from "../components/app/PageInfoHeader.vue";
  import Widget from "~/components/app/Widget.vue";
  import { useTransactionService } from "~/features/transactions/services/transactions.service";
  import type { TotalBalance } from "~/features/transactions/models/transactions.model";

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

  onMounted(async () => {
    totalBalance.value = await transactionService.getTotalBalance();
    totalExpenseBalance.value =
      await transactionService.getExpenseTotalBalance();
    totalIncomeBalance.value = await transactionService.getIncomeTotalBalance();
    totalCount.value = await transactionService.getTotalCount();
  });
</script>
