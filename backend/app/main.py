from fastapi import FastAPI, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware

from app.models import Transaction, TransactionCreate, create_transaction
from app.storage import (
    delete_transaction,
    load_categories,
    load_transactions,
    save_transaction,
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


@app.post(
    "/transactions",
    response_model=Transaction,
    status_code=status.HTTP_201_CREATED,
)
def add_transaction(payload: TransactionCreate) -> Transaction:
    transaction = create_transaction(payload)

    return save_transaction(transaction)


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
