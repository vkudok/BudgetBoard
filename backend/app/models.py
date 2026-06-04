from datetime import date, datetime, timezone
from uuid import uuid4

from pydantic import BaseModel, Field


class TransactionCreate(BaseModel):
    type: str = Field(min_length=1)
    amount: float = Field(gt=0)
    category: str = Field(min_length=1)
    date: date
    comment: str | None = None


class Transaction(TransactionCreate):
    id: str
    createdAt: datetime
    updatedAt: datetime


def create_transaction(payload: TransactionCreate) -> Transaction:
    now = datetime.now(timezone.utc)

    return Transaction(
        id=str(uuid4()),
        createdAt=now,
        updatedAt=now,
        **payload.model_dump(),
    )

