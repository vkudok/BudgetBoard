import type { TableColumn } from "@nuxt/ui";
import type { TableMeta, Row } from "@tanstack/vue-table";
import { getGridHeader } from "~/components/features/models/appGrid.model";

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

export type TransactionType = "income" | "expense";

const formatTransactionDate = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);
  const localDate = new Date(year, month - 1, day);

  return localDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
};

export const transactionColumns: TableColumn<Transaction>[] = [
  {
    accessorKey: "type",
    header: ({ column }) => getGridHeader(column, "Type"),
    meta: {
      class: {
        th: "text-center font-semibold",
        td: "text-center font-mono",
      },
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => getGridHeader(column, "Amount"),
    meta: {
      class: {
        th: "text-center font-semibold",
        td: "text-center font-mono",
      },
    },
    cell: ({ row }) => {
      return row.getValue("amount") + "₽";
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => getGridHeader(column, "Category"),
    meta: {
      class: {
        th: "text-center font-semibold",
        td: "text-center font-mono",
      },
    },
    cell: ({ row }) => row.getValue("category") || "-",
  },
  {
    accessorKey: "date",
    header: ({ column }) => getGridHeader(column, "Date"),
    meta: {
      class: {
        th: "text-center font-semibold",
        td: "text-center font-mono",
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
        td: "text-center font-mono",
      },
    },
  },
];

export const transactionMeta: TableMeta<Transaction> = {
  class: {
    tr: (row: Row<Transaction>) => {
      if (row.original.type === "expense") {
        return "bg-error/10 dark:bg-error/20";
      }
      if (row.original.type === "income") {
        return "bg-success/10 dark:bg-success/20";
      }
      return "";
    },
  },
};
