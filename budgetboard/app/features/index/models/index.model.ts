import type { TableColumn } from "@nuxt/ui";
import { getGridHeader } from "~/components/features/models/appGrid.model";
import {
  formatCurrency,
  formatTransactionDate, getFormattedAmount,
  type Transaction,
} from "~/features/transactions/models/transactions.model";
import { AppIconBadge } from "#components";

export const indexColumns: TableColumn<Transaction>[] = [
  {
    id: "typeIndicator",
    meta: {
      class: {
        th: "text-center font-semibold",
        td: "text-center font-mono",
      },
    },
    cell: ({ row }) => {
      const type = row.original.type;

      return h(AppIconBadge, {
        direction: type !== "income" ? "up" : "down",
      });
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
    accessorKey: "amount",
    header: ({ column }) => getGridHeader(column, "Amount"),
    meta: {
      class: {
        th: "text-center font-semibold",
        td: "text-center font-mono",
      },
    },
    cell: ({ row }) => getFormattedAmount(row),
  },
];
