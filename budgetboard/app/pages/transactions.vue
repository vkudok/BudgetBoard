<template>
  <div class="h-full flex flex-col">
    <div class="flex justify-between">
      <PageInfoHeader name="Transaction List" />
      <TransactionDialog :data-to-edit="dataToEdit" @on-closed="refreshAll" />
    </div>
    <AppGrid
      class="flex-1"
      :data="data"
      :columns="columns"
      :is-loading="isLoading"
      :global-filter-info="{
        needSearch: true,
        filters: transactionFilters,
        values: filterValuesConfig,
      }"
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
  import TransactionDialog from "~/features/transactions/ui/TransactionDialog.vue";
  import PageInfoHeader from "~/shared/ui/PageInfoHeader.vue";
  import AppGrid from "~/shared/ui/AppGrid.vue";
  import {
    filterValuesConfig,
    type Transaction,
    transactionColumns,
    transactionFiltersConfig,
  } from "~/features/transactions/models/transactions.model";
  import type { Row } from "@tanstack/vue-table";
  import {
    actionButtons,
    type AppGridItems,
  } from "~/shared/models/appGrid.model";
  import ConfirmDialog from "~/shared/ui/ConfirmDialog.vue";
  import { useTransactions } from "~/features/transactions/composables/useTransactions";
  import { useCategories } from "~/features/transactions/composables/useCategories";

  const transactionsData = useTransactions();
  const categoriesData = useCategories();
  const transactionFilters = computed(() => {
    const categoryOptions =
      categoriesData.categories.value?.map((category) => ({
        label: category,
        value: category,
      })) ?? [];

    return transactionFiltersConfig.map((filter) => {
      if (filter.key !== "category") {
        return filter;
      }

      return {
        ...filter,
        options: [...(filter.options ?? []), ...categoryOptions],
      };
    });
  });
  const data = transactionsData.data.transactionsList;
  const dataToEdit = ref<Transaction | null>(null);
  const columns = [...transactionColumns, actionButtons(getRowItems)];
  const isLoading = ref(false);
  const openDeleteDialog = ref(false);
  const deleteRow = ref<Row<Transaction> | null>(null);

  async function refreshAll() {
    if (dataToEdit.value !== null) {
      dataToEdit.value = null;
    }
    return await transactionsData.refresh();
  }

  async function confirmDelete(state: boolean) {
    openDeleteDialog.value = false;
    if (state && deleteRow.value) {
      await transactionsData.data.remove(deleteRow.value.original.id);
      await refreshAll();
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
