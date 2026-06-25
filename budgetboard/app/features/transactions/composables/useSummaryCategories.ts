import { useTransactionService } from "~/features/transactions/api/transactions.service";
import type { TransactionType } from "~/features/transactions/models/transactions.model";

export function useSummaryCategories(type: TransactionType) {
  const service = useTransactionService();

  const { data: summary, pending: loading, refresh } = useAsyncData(`summary-${type}`, () =>
    service.categories.getSummaryCategories(type),
  );

  return { summary, refresh, loading };
}
