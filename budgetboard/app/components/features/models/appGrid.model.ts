import {UButton, UDropdownMenu} from "#components";
import type {Column, Row} from '@tanstack/vue-table'
import type {TableColumn} from "@nuxt/ui";

export interface AppGridItems {
    label: string
    icon?: string
    onSelect: () => void;
}

export const actionButtons = <T>(getItems: (row: Row<T>) => AppGridItems[]): TableColumn<T> => {
    return {
        id: 'actions',
        meta: {
            class: {
                td: 'text-right'
            }
        },
        cell: ({row}) => {
            return h(
                UDropdownMenu,
                {
                    content: {
                        align: 'end'
                    },
                    items: getItems(row),
                    'aria-label': 'Actions dropdown'
                },
                () =>
                    h(UButton, {
                        icon: 'i-lucide-ellipsis-vertical',
                        color: 'neutral',
                        variant: 'ghost',
                        'aria-label': 'Actions dropdown'
                    })
            )
        }
    }
}

export function getGridHeader<T>(column: Column<T>, label: string) {
    const isSorted = column.getIsSorted()

    return h(
        UDropdownMenu,
        {
            content: {
                align: 'start'
            },
            'aria-label': 'Actions dropdown',
            items: [
                {
                    label: 'Asc',
                    type: 'checkbox',
                    icon: 'i-lucide-arrow-up-narrow-wide',
                    checked: isSorted === 'asc',
                    onSelect: () => {
                        if (isSorted === 'asc') {
                            column.clearSorting()
                        } else {
                            column.toggleSorting(false)
                        }
                    }
                },
                {
                    label: 'Desc',
                    icon: 'i-lucide-arrow-down-wide-narrow',
                    type: 'checkbox',
                    checked: isSorted === 'desc',
                    onSelect: () => {
                        if (isSorted === 'desc') {
                            column.clearSorting()
                        } else {
                            column.toggleSorting(true)
                        }
                    }
                }
            ]
        },
        () =>
            h(UButton, {
                color: 'neutral',
                variant: 'ghost',
                label,
                icon: isSorted
                    ? isSorted === 'asc'
                        ? 'i-lucide-arrow-up-narrow-wide'
                        : 'i-lucide-arrow-down-wide-narrow'
                    : 'i-lucide-arrow-up-down',
                class: '-mx-2.5 data-[state=open]:bg-elevated',
                'aria-label': `Sort by ${isSorted === 'asc' ? 'descending' : 'ascending'}`
            })
    )
}
