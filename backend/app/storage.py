import json
from pathlib import Path

from app.models import Transaction

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


def load_categories() -> list[str]:
    if not CATEGORIES_FILE.exists():
        return []

    with CATEGORIES_FILE.open("r", encoding="utf-8") as file:
        categories = json.load(file)

    return [str(category) for category in categories]
