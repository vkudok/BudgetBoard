<template>
  <div class="h-full flex flex-col">
    <div class="flex justify-between">
      <PageInfoHeader name="Transaction List"/>
      <TransactionDialog @created="loadTransactions"/>
    </div>
    <AppGrid class="flex-1" :data="data" :columns="transactionColumns" :meta="transactionMeta" :is-loading="isLoading"/>
  </div>
</template>

<script setup lang="ts">
import TransactionDialog from '../components/app/TransactionDialog.vue';
import PageInfoHeader from '../components/app/PageInfoHeader.vue';
import AppGrid from "~/components/app/AppGrid.vue";
import {useTransactionService} from "~/features/transactions/services/transactions.service";
import {type Transaction, transactionColumns, transactionMeta} from "~/features/transactions/models/transactions.model";

const data = ref<Transaction[]>([])
const transactionService = useTransactionService()
const isLoading = ref(false)

onMounted(async () => {
  await loadTransactions()
})

async function loadTransactions() {
  isLoading.value = true
  try {
    console.log('c');
    data.value = await transactionService.getTransactions()
    isLoading.value = false
  } catch (error) {
    console.error(error)
    isLoading.value = false
  }
}
</script>
