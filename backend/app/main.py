from datetime import date
from typing import Literal

from fastapi import FastAPI, HTTPException, Query, Response, status
from fastapi.middleware.cors import CORSMiddleware

from app.models import (
    Transaction,
    TransactionAmountTotal,
    TransactionCategoriesSummary,
    TransactionCategorySummaryItem,
    TransactionCreate,
    create_transaction,
)
from app.storage import (
    delete_transaction,
    load_categories,
    load_transactions,
    save_transaction,
    update_transaction,
)

app = FastAPI(title="BudgetBoard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/transactions", response_model=list[Transaction])
def get_transactions() -> list[Transaction]:
    return load_transactions()


@app.get("/transactions/categories", response_model=list[str])
def get_transaction_categories() -> list[str]:
    return load_categories()


@app.get(
    "/transactions/categories/summary",
    response_model=TransactionCategoriesSummary,
)
def get_transaction_categories_summary(
    transaction_type: Literal["income", "expense"] = Query(alias="type"),
) -> TransactionCategoriesSummary:
    transactions = load_transactions()
    category_totals = get_current_month_category_totals_by_transaction_type(
        transactions,
        transaction_type,
    )
    total = sum(category_totals.values())
    items = [
        TransactionCategorySummaryItem(
            category=category,
            amount=amount,
            percent=calculate_percent(amount, total),
        )
        for category, amount in sorted(
            category_totals.items(),
            key=lambda item: item[1],
            reverse=True,
        )
    ]

    return TransactionCategoriesSummary(
        type=transaction_type,
        total=total,
        items=items,
    )


def get_current_month_key() -> tuple[int, int]:
    today = date.today()

    return today.year, today.month


def get_transaction_month_key(transaction: Transaction) -> tuple[int, int]:
    return transaction.date.year, transaction.date.month


def calculate_change_percent(current_value: float, previous_value: float) -> float:
    if previous_value == 0:
        return 100 if current_value > 0 else 0

    change_percent = ((current_value - previous_value) / previous_value) * 100
    limited_change_percent = min(max(change_percent, 0), 100)

    return round(limited_change_percent, 2)


def calculate_percent(value: float, total: float) -> float:
    if total == 0:
        return 0

    return round((value / total) * 100, 2)


def get_previous_month_average(monthly_values: dict[tuple[int, int], float]) -> float | None:
    current_month_key = get_current_month_key()
    previous_values = [
        value
        for month_key, value in monthly_values.items()
        if month_key < current_month_key
    ]

    if not previous_values:
        return None

    return sum(previous_values) / len(previous_values)


def get_comparison_value(
    previous_month_average: float | None, current_month_previous_value: float
) -> float:
    if previous_month_average is not None:
        return previous_month_average

    return current_month_previous_value


def get_current_month_transactions(
    transactions: list[Transaction],
) -> list[Transaction]:
    current_month_key = get_current_month_key()

    return [
        transaction
        for transaction in transactions
        if get_transaction_month_key(transaction) == current_month_key
    ]


def get_latest_transaction_date(transactions: list[Transaction]) -> date | None:
    if not transactions:
        return None

    return max(transaction.date for transaction in transactions)


def get_monthly_totals_by_transaction_type(
    transactions: list[Transaction], transaction_type: str
) -> dict[tuple[int, int], float]:
    monthly_totals: dict[tuple[int, int], float] = {}

    for transaction in transactions:
        if transaction.type != transaction_type:
            continue

        month_key = get_transaction_month_key(transaction)
        monthly_totals[month_key] = monthly_totals.get(month_key, 0) + transaction.amount

    return monthly_totals


def get_current_month_total_by_transaction_type(
    transactions: list[Transaction], transaction_type: str
) -> float:
    current_month_key = get_current_month_key()

    return sum(
        transaction.amount
        for transaction in transactions
        if transaction.type == transaction_type
        and get_transaction_month_key(transaction) == current_month_key
    )


def get_current_month_category_totals_by_transaction_type(
    transactions: list[Transaction], transaction_type: str
) -> dict[str, float]:
    category_totals: dict[str, float] = {}

    for transaction in get_current_month_transactions(transactions):
        if transaction.type != transaction_type:
            continue

        category = transaction.category or "Uncategorized"
        category_totals[category] = category_totals.get(category, 0) + transaction.amount

    return category_totals


def get_current_month_total_before_latest_date_by_transaction_type(
    transactions: list[Transaction], transaction_type: str
) -> float:
    current_month_transactions = [
        transaction
        for transaction in get_current_month_transactions(transactions)
        if transaction.type == transaction_type
    ]
    latest_date = get_latest_transaction_date(current_month_transactions)

    if latest_date is None:
        return 0

    return sum(
        transaction.amount
        for transaction in current_month_transactions
        if transaction.date < latest_date
    )


@app.get("/transactions/income/total", response_model=TransactionAmountTotal)
def get_income_total() -> TransactionAmountTotal:
    transactions = load_transactions()
    total = get_current_month_total_by_transaction_type(transactions, "income")
    monthly_totals = get_monthly_totals_by_transaction_type(transactions, "income")
    previous_average = get_previous_month_average(monthly_totals)
    previous_value = get_comparison_value(
        previous_average,
        get_current_month_total_before_latest_date_by_transaction_type(
            transactions, "income"
        ),
    )
    change_percent = calculate_change_percent(total, previous_value)

    return TransactionAmountTotal(total=total, changePercent=change_percent)


@app.get("/transactions/expense/total", response_model=TransactionAmountTotal)
def get_expense_total() -> TransactionAmountTotal:
    transactions = load_transactions()
    total = get_current_month_total_by_transaction_type(transactions, "expense")
    monthly_totals = get_monthly_totals_by_transaction_type(transactions, "expense")
    previous_average = get_previous_month_average(monthly_totals)
    previous_value = get_comparison_value(
        previous_average,
        get_current_month_total_before_latest_date_by_transaction_type(
            transactions, "expense"
        ),
    )
    change_percent = calculate_change_percent(total, previous_value)

    return TransactionAmountTotal(total=total, changePercent=change_percent)


def get_monthly_balances(transactions: list[Transaction]) -> dict[tuple[int, int], float]:
    monthly_incomes = get_monthly_totals_by_transaction_type(transactions, "income")
    monthly_expenses = get_monthly_totals_by_transaction_type(transactions, "expense")
    month_keys = monthly_incomes.keys() | monthly_expenses.keys()

    return {
        month_key: max(
            monthly_incomes.get(month_key, 0) - monthly_expenses.get(month_key, 0),
            0,
        )
        for month_key in month_keys
    }


def get_current_month_transaction_count(transactions: list[Transaction]) -> int:
    return len(get_current_month_transactions(transactions))


def get_current_month_transaction_count_before_latest_date(
    transactions: list[Transaction],
) -> int:
    current_month_transactions = get_current_month_transactions(transactions)
    latest_date = get_latest_transaction_date(current_month_transactions)

    if latest_date is None:
        return 0

    return len(
        [
            transaction
            for transaction in current_month_transactions
            if transaction.date < latest_date
        ]
    )


def get_monthly_transaction_counts(
    transactions: list[Transaction],
) -> dict[tuple[int, int], int]:
    monthly_counts: dict[tuple[int, int], int] = {}

    for transaction in transactions:
        month_key = get_transaction_month_key(transaction)
        monthly_counts[month_key] = monthly_counts.get(month_key, 0) + 1

    return monthly_counts


@app.get("/transactions/balance", response_model=TransactionAmountTotal)
def get_balance() -> TransactionAmountTotal:
    transactions = load_transactions()
    income_total = get_current_month_total_by_transaction_type(transactions, "income")
    expense_total = get_current_month_total_by_transaction_type(transactions, "expense")
    total = max(income_total - expense_total, 0)
    monthly_balances = get_monthly_balances(transactions)
    previous_average = get_previous_month_average(monthly_balances)
    previous_income_total = get_current_month_total_before_latest_date_by_transaction_type(
        transactions, "income"
    )
    previous_expense_total = get_current_month_total_before_latest_date_by_transaction_type(
        transactions, "expense"
    )
    previous_value = get_comparison_value(
        previous_average,
        max(previous_income_total - previous_expense_total, 0),
    )
    change_percent = calculate_change_percent(total, previous_value)

    return TransactionAmountTotal(total=total, changePercent=change_percent)


@app.get("/transactions/count", response_model=TransactionAmountTotal)
def get_transaction_count() -> TransactionAmountTotal:
    transactions = load_transactions()
    total = get_current_month_transaction_count(transactions)
    monthly_counts = get_monthly_transaction_counts(transactions)
    previous_average = get_previous_month_average(monthly_counts)
    previous_value = get_comparison_value(
        previous_average,
        get_current_month_transaction_count_before_latest_date(transactions),
    )
    change_percent = calculate_change_percent(total, previous_value)

    return TransactionAmountTotal(total=total, changePercent=change_percent)


@app.post(
    "/transactions",
    response_model=Transaction,
    status_code=status.HTTP_201_CREATED,
)
def add_transaction(payload: TransactionCreate) -> Transaction:
    transaction = create_transaction(payload)

    return save_transaction(transaction)


@app.put("/transactions/{transaction_id}", response_model=Transaction)
def edit_transaction(transaction_id: str, payload: TransactionCreate) -> Transaction:
    transaction = update_transaction(transaction_id, payload)

    if transaction is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )

    return transaction


@app.delete(
    "/transactions/{transaction_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_transaction(transaction_id: str) -> Response:
    was_deleted = delete_transaction(transaction_id)

    if not was_deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )

    return Response(status_code=status.HTTP_204_NO_CONTENT)
