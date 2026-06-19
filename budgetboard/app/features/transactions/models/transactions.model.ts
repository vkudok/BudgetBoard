import type { TableColumn } from "@nuxt/ui";
import { getGridHeader } from "~/components/features/models/appGrid.model";
import type { Row } from "@tanstack/vue-table";

export interface TransactionCreate {
  type: TransactionType;
  amount: number;
  category: string;
  date: string;
  comment?: string;
}

export interface Transaction extends TransactionCreate {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface TotalBalance {
  total: number;
  changePercent: number;
}

export interface SummaryCategoriesItems {
  category: string;
  amount: number;
  percent: number;
}

export interface SummaryCategories {
  type: string;
  total: number;
  items: SummaryCategoriesItems[];
}

export type TransactionType = "income" | "expense";

export const transactionColumns: TableColumn<Transaction>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => getGridHeader(column, "Date"),
    meta: {
      class: {
        th: "text-center font-semibold",
        td: "text-center font-semibold",
      },
    },
    cell: ({ row }) => formatTransactionDate(row.getValue("date")),
  },
  {
    accessorKey: "comment",
    header: ({ column }) => getGridHeader(column, "Comment"),
    meta: {
      class: {
        th: "text-center font-semibold",
        td: "text-center font-semibold",
      },
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => getGridHeader(column, "Category"),
    meta: {
      class: {
        th: "text-center font-semibold",
        td: "text-center font-semibold",
      },
    },
    cell: ({ row }) => row.getValue("category") || "-",
  },
  {
    accessorKey: "type",
    header: ({ column }) => getGridHeader(column, "Type"),
    meta: {
      class: {
        th: "text-center font-semibold",
        td: "text-center font-semibold",
      },
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => getGridHeader(column, "Amount"),
    meta: {
      class: {
        th: "text-center font-semibold",
        td: "text-center font-semibold",
      },
    },
    cell: ({ row }) => getFormattedAmount(row),
  },
];

export function getFormattedAmount(row: Row<Transaction>) {
  const type = row.getValue("type") as string;
  const amount = row.getValue("amount") as number;
  const isNegative = type === "income" ? "+" : "-";
  const amountString = isNegative + formatCurrency(amount) + "₽";
  return h(
    "span",
    { class: type === "income" ? "text-success" : "text-error" },
    amountString,
  );
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("de-DE").format(amount);
}

export function formatTransactionDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  const localDate = new Date(year, month - 1, day);

  return localDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
}
