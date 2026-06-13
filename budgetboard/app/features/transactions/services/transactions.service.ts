import type {
  TotalBalance,
  Transaction,
  TransactionCreate,
} from "~/features/transactions/models/transactions.model";

export function useTransactionService() {
  const config = useRuntimeConfig();
  const apiUrl = config.public.apiUrl;

  async function getTransactionsCategories() {
    return await $fetch<string[]>(`${apiUrl}/transactions/categories`, {
      method: "GET",
    });
  }

  async function getTransactions() {
    return await $fetch<Transaction[]>(`${apiUrl}/transactions`, {
      method: "GET",
    });
  }

  async function postTransactions(requestBody: TransactionCreate) {
    return await $fetch<Transaction>(`${apiUrl}/transactions`, {
      method: "POST",
      body: requestBody,
    });
  }

  async function editTransactions(id: string, requestBody: TransactionCreate) {
    return await $fetch<Transaction>(`${apiUrl}/transactions/${id}`, {
      method: "PUT",
      body: requestBody,
    });
  }

  async function getTotalBalance() {
    return await $fetch<TotalBalance>(`${apiUrl}/transactions/balance`, {
      method: "GET",
    });
  }

  async function getExpenseTotalBalance() {
    return await $fetch<TotalBalance>(`${apiUrl}/transactions/expense/total`, {
      method: "GET",
    });
  }

  async function getIncomeTotalBalance() {
    return await $fetch<TotalBalance>(`${apiUrl}/transactions/income/total`, {
      method: "GET",
    });
  }

  async function getTotalCount() {
    return await $fetch<TotalBalance>(`${apiUrl}/transactions/count`, {
      method: "GET",
    });
  }

  async function deleteTransaction(id: string): Promise<void> {
    await $fetch(`${apiUrl}/transactions/${id}`, {
      method: "DELETE",
    });
  }

  return {
    getTransactionsCategories,
    getTransactions,
    getTotalBalance,
    getExpenseTotalBalance,
    getIncomeTotalBalance,
    editTransactions,
    postTransactions,
    getTotalCount,
    deleteTransaction,
  };
}
