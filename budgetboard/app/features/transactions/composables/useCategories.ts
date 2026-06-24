import { useTransactionService } from "~/features/transactions/services/transactions.service";
export function useCategories() {
  const service = useTransactionService();

  const { data: categories, refresh } = useAsyncData("categories", () =>
    service.categories.getCategories(),
  );

  return {
    categories,
    refresh,
  };
}
