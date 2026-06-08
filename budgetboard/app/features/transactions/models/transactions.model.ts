import type {TableColumn} from "@nuxt/ui";
import type { TableMeta, Row } from '@tanstack/vue-table'
import {getGridHeader} from "~/components/features/models/appGrid.model";

export interface TransactionCreate {
    type: TransactionType
    amount: number
    category: string
    date: string
    comment?: string
}

export interface Transaction extends TransactionCreate {
    id: string
    createdAt: string
    updatedAt: string
}

export type TransactionType = 'income' | 'expense'

export const transactionColumns: TableColumn<TransactionCreate>[] = [
    {
        accessorKey: 'type',
        header: ({ column }) => getGridHeader(column, 'Type'),
        meta: {
            class: {
                th: 'text-center font-semibold',
                td: 'text-center font-mono'
            }
        }
    },
    {
        accessorKey: 'amount',
        header: ({ column }) => getGridHeader(column, 'Amount'),
        meta: {
            class: {
                th: 'text-center font-semibold',
                td: 'text-center font-mono'
            }
        }
    },
    {
        accessorKey: 'category',
        header: ({ column }) => getGridHeader(column, 'Category'),
        meta: {
            class: {
                th: 'text-center font-semibold',
                td: 'text-center font-mono'
            }
        }
    },
    {
        accessorKey: 'date',
        header: ({ column }) => getGridHeader(column, 'Date'),
        meta: {
            class: {
                th: 'text-center font-semibold',
                td: 'text-center font-mono'
            }
        }
    },
    {
        accessorKey: 'comment',
        header: ({ column }) => getGridHeader(column, 'Comment'),
        meta: {
            class: {
                th: 'text-center font-semibold',
                td: 'text-center font-mono'
            }
        }
    }
];

export const transactionMeta: TableMeta<TransactionCreate> = {
    class: {
        tr: (row: Row<TransactionCreate>) => {
            if (row.original.type === 'expense') {
                return 'bg-error/10'
            }
            if (row.original.type === 'income') {
                return 'bg-success/10'
            }
            return ''
        }
    }
}