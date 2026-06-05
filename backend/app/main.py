from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware

from app.models import Transaction, TransactionCreate, create_transaction
from app.storage import load_transactions, save_transaction

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


@app.post(
    "/transactions",
    response_model=Transaction,
    status_code=status.HTTP_201_CREATED,
)
def add_transaction(payload: TransactionCreate) -> Transaction:
    transaction = create_transaction(payload)

    return save_transaction(transaction)
