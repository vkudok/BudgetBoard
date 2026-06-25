import { useTransactionService } from "~/features/transactions/api/transactions.service";
import type {
  Transaction,
  TransactionCreate,
} from "~/features/transactions/models/transactions.model";

export function useTransactions() {
  const service = useTransactionService();

  const {
    data: transactionsList,
    pending: loading,
    refresh,
  } = useAsyncData(
    "transactions",
    () => service.transactions.getTransactions(),
    { default: () => [] as Transaction[] },
  );

  async function remove(id: string) {
    await service.transactions.deleteTransaction(id);
    await refresh();
  }

  async function post(requestBody: TransactionCreate) {
    await service.transactions.postTransactions(requestBody);
    await refresh();
  }

  async function edit(id: string, requestBody: TransactionCreate) {
    await service.transactions.editTransactions(id, requestBody);
    await refresh();
  }

  return {
    data: { transactionsList, remove, post, edit, refresh },
    loading,
    refresh
  };
}
