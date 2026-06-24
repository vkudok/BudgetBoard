import { useTransactionService } from "~/features/transactions/services/transactions.service";
import type {
  TotalBalance,
} from "~/features/transactions/models/transactions.model";

export function useTotal() {
  const service = useTransactionService();

  const {
    data: totalBalance,
    pending: p1,
    refresh: r1,
  } = useAsyncData("totalBalance", () => service.summary.getTotalBalance(), {
    default: (): TotalBalance => {
      return { total: 0, changePercent: 0 };
    },
  });

  const {
    data: expenseTotalBalance,
    pending: p2,
    refresh: r2,
  } = useAsyncData(
    "expenseTotalBalance",
    () => service.summary.getExpenseTotalBalance(),
    {
      default: (): TotalBalance => {
        return { total: 0, changePercent: 0 };
      },
    },
  );

  const {
    data: incomeTotalBalance,
    pending: p3,
    refresh: r3,
  } = useAsyncData(
    "incomeTotalBalance",
    () => service.summary.getIncomeTotalBalance(),
    {
      default: (): TotalBalance => {
        return { total: 0, changePercent: 0 };
      },
    },
  );

  const {
    data: getTotalCount,
    pending: p4,
    refresh: r4,
  } = useAsyncData("getTotalCount", () => service.summary.getTotalCount(), {
    default: (): TotalBalance => {
      return { total: 0, changePercent: 0 };
    },
  });

  async function refresh() {
    await Promise.all([r1(), r2(), r3(), r4()]);
  }

  const loading = computed(() => p1.value || p2.value || p3.value || p4.value);

  return {
    totalBalance,
    expenseTotalBalance,
    incomeTotalBalance,
    getTotalCount,
    refresh,
    loading
  };
}
