<template>
  <div class="h-full flex flex-col">
    <div class="flex justify-between">
      <PageInfoHeader name="Transaction List" />
      <TransactionDialog @created="loadTransactions" />
    </div>
    <AppGrid
      class="flex-1"
      :data="data"
      :columns="columns"
      :meta="transactionMeta"
      :is-loading="isLoading"
      :need-global-filter="true"
    />
  </div>
</template>

<script setup lang="ts">
  import TransactionDialog from "../components/app/TransactionDialog.vue";
  import PageInfoHeader from "../components/app/PageInfoHeader.vue";
  import AppGrid from "~/components/app/AppGrid.vue";
  import { useTransactionService } from "~/features/transactions/services/transactions.service";
  import {
    type Transaction,
    transactionColumns,
    transactionMeta,
  } from "~/features/transactions/models/transactions.model";
  import type { Row } from "@tanstack/vue-table";
  import {
    actionButtons,
    type AppGridItems,
  } from "~/components/features/models/appGrid.model";

  const data = ref<Transaction[]>([]);
  const columns = [...transactionColumns, actionButtons(getRowItems)];
  const transactionService = useTransactionService();
  const isLoading = ref(false);

  onMounted(async () => {
    await loadTransactions();
  });

  async function loadTransactions() {
    isLoading.value = true;
    try {
      data.value = await transactionService.getTransactions();
      console.log(data.value);
      isLoading.value = false;
    } catch (error) {
      console.error(error);
      isLoading.value = false;
    }
  }

  function getRowItems(row: Row<Transaction>): AppGridItems[] {
    return [
      {
        label: "Delete",
        icon: "i-lucide-trash-2",
        async onSelect() {
          await useTransactionService().deleteTransaction(row.original.id);
        },
      },
      {
        label: "Edit",
        icon: "i-lucide-pencil",
        onSelect() {
          console.log(row);
          // copy(row.original.id)
          //
          // toast.add({
          //     title: 'Payment ID copied to clipboard!',
          //     color: 'success',
          //     icon: 'i-lucide-circle-check'
          // })
        },
      },
    ];
  }
</script>
