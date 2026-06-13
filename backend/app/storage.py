import json
from datetime import datetime, timezone
from pathlib import Path

from app.models import Transaction, TransactionCreate

DATA_DIR = Path(__file__).resolve().parents[1] / "data"
TRANSACTIONS_FILE = DATA_DIR / "transactions.json"
CATEGORIES_FILE = DATA_DIR / "categories.json"


def load_transactions() -> list[Transaction]:
    if not TRANSACTIONS_FILE.exists():
        return []

    with TRANSACTIONS_FILE.open("r", encoding="utf-8") as file:
        raw_transactions = json.load(file)

    return [Transaction.model_validate(item) for item in raw_transactions]


def save_transactions(transactions: list[Transaction]) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    with TRANSACTIONS_FILE.open("w", encoding="utf-8") as file:
        json.dump(
            [transaction.model_dump(mode="json") for transaction in transactions],
            file,
            ensure_ascii=False,
            indent=2,
        )


def save_transaction(transaction: Transaction) -> Transaction:
    transactions = load_transactions()
    transactions.append(transaction)
    save_transactions(transactions)

    return transaction


def update_transaction(
    transaction_id: str, payload: TransactionCreate
) -> Transaction | None:
    transactions = load_transactions()

    for index, transaction in enumerate(transactions):
        if transaction.id != transaction_id:
            continue

        updated_transaction = Transaction(
            id=transaction.id,
            createdAt=transaction.createdAt,
            updatedAt=datetime.now(timezone.utc),
            **payload.model_dump(),
        )
        transactions[index] = updated_transaction
        save_transactions(transactions)

        return updated_transaction

    return None


def delete_transaction(transaction_id: str) -> bool:
    transactions = load_transactions()
    remaining_transactions = [
        transaction for transaction in transactions if transaction.id != transaction_id
    ]

    if len(remaining_transactions) == len(transactions):
        return False

    save_transactions(remaining_transactions)

    return True


def load_categories() -> list[str]:
    if not CATEGORIES_FILE.exists():
        return []

    with CATEGORIES_FILE.open("r", encoding="utf-8") as file:
        categories = json.load(file)

    return [str(category) for category in categories]
