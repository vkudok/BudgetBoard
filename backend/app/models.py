from datetime import date, datetime, timezone
from uuid import uuid4

from pydantic import BaseModel, Field, model_validator


class TransactionCreate(BaseModel):
    type: str = Field(min_length=1)
    amount: float = Field(gt=0)
    category: str | None = Field(default=None, min_length=1)
    date: date
    comment: str | None = None

    @model_validator(mode="after")
    def validate_category(self) -> "TransactionCreate":
        if self.type == "expense" and not self.category:
            raise ValueError("Category is required for expense transactions")

        return self


class Transaction(TransactionCreate):
    id: str
    createdAt: datetime
    updatedAt: datetime


class TransactionAmountTotal(BaseModel):
    total: float
    changePercent: float


class TransactionCategorySummaryItem(BaseModel):
    category: str
    amount: float
    percent: float


class TransactionCategoriesSummary(BaseModel):
    type: str
    total: float
    items: list[TransactionCategorySummaryItem]


def create_transaction(payload: TransactionCreate) -> Transaction:
    now = datetime.now(timezone.utc)

    return Transaction(
        id=str(uuid4()),
        createdAt=now,
        updatedAt=now,
        **payload.model_dump(),
    )
