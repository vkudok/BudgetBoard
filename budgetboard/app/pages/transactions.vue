<template>
  <div class="h-full flex flex-col">
    <div class="flex justify-between">
      <PageInfoHeader name="Transaction List" />
      <TransactionDialog
        :data-to-edit="dataToEdit"
        @on-closed="loadTransactions"
      />
    </div>
    <AppGrid
      class="flex-1"
      :data="data"
      :columns="columns"
      :is-loading="isLoading"
      :need-global-filter="true"
    />
    <ConfirmDialog
      :open="openDeleteDialog"
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
  } from "~/features/transactions/models/transactions.model";
  import type { Row } from "@tanstack/vue-table";
  import {
    actionButtons,
    type AppGridItems,
  } from "~/components/features/models/appGrid.model";
  import ConfirmDialog from "~/components/app/ConfirmDialog.vue";

  const data = ref<Transaction[]>([]);
  const dataToEdit = ref<Transaction | null>(null);
  const columns = [...transactionColumns, actionButtons(getRowItems)];
  const transactionService = useTransactionService();
  const isLoading = ref(false);
  const openDeleteDialog = ref(false);
  const deleteRow = ref<Row<Transaction> | null>(null);

  onMounted(async () => {
    await loadTransactions();
  });

  async function loadTransactions() {
    isLoading.value = true;
    if (dataToEdit.value !== null) {
      dataToEdit.value = null;
    }
    try {
      data.value = await transactionService.transactions.getTransactions();
    } catch (error) {
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function confirmDelete(state: boolean) {
    openDeleteDialog.value = false;
    if (state && deleteRow.value) {
      await transactionService.transactions.deleteTransaction(
        deleteRow.value.original.id,
      );
      await loadTransactions();
      deleteRow.value = null;
    }
  }

  function getRowItems(row: Row<Transaction>): AppGridItems[] {
    return [
      {
        label: "Delete",
        icon: "i-lucide-trash-2",
        async onSelect() {
          openDeleteDialog.value = true;
          deleteRow.value = row;
        },
      },
      {
        label: "Edit",
        icon: "i-lucide-pencil",
        onSelect() {
          dataToEdit.value = row.original;
        },
      },
    ];
  }
</script>
