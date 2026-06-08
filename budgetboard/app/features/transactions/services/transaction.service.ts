export type TransactionType = 'income' | 'expense'

export interface Transaction {
    type: TransactionType
    amount: number
    category?: string
    date: string
    comment?: string
}

export function useTransactionService() {
    const config = useRuntimeConfig()
    const apiUrl = config.public.apiUrl

    async function getTransactionsCategories() {
        return await $fetch<string[]>(`${apiUrl}/transactions/categories`, {
            method: 'GET',
        })
    }

    async function getTransactions() {
        return await $fetch<Transaction[]>(`${apiUrl}/transactions`, {
            method: 'GET',
        })
    }

    async function postTransactions(requestBody: Transaction) {
        const body = {
            ...requestBody,
            category: requestBody.category || undefined,
        }

        return await $fetch(`${apiUrl}/transactions`, {
            method: 'POST',
            body,
        })
    }

    return {
        getTransactionsCategories,
        getTransactions,
        postTransactions,
    }
}
