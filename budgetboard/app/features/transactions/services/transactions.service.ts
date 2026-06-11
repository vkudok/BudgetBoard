import type {
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
    const body = {
      ...requestBody,
      category: requestBody.category || undefined,
    };

    return await $fetch<Transaction>(`${apiUrl}/transactions`, {
      method: "POST",
      body,
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
    postTransactions,
    deleteTransaction,
  };
}
