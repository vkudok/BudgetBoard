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
    <ConfirmDialog
      :open="isDeleteConfirmOpen"
      :title="`Delete transaction?`"
      :description="`Are you sure you want to delete this transaction? This action cannot be undone.`"
      :confirm-text="`Delete`"
      :cancel-text="`Cancel`"
      @confirm-delete="confirmDelete($event)"
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
  import ConfirmDialog from "~/components/app/ConfirmDialog.vue";

  const data = ref<Transaction[]>([]);
  const columns = [...transactionColumns, actionButtons(getRowItems)];
  const transactionService = useTransactionService();
  const isLoading = ref(false);
  const isDeleteConfirmOpen = ref(false);
  const deleteRow = ref<Row<Transaction> | null>(null);

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

  //TODO сделать релоад таблицы
  async function confirmDelete(state: boolean) {
    isDeleteConfirmOpen.value = false;
    if (state && deleteRow.value) {
      await useTransactionService().deleteTransaction(
        deleteRow.value.original.id,
      );
      deleteRow.value = null;
    }
  }

  function getRowItems(row: Row<Transaction>): AppGridItems[] {
    return [
      {
        label: "Delete",
        icon: "i-lucide-trash-2",
        async onSelect() {
          isDeleteConfirmOpen.value = true;
          deleteRow.value = row;
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
