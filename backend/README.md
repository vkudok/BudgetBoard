# BudgetBoard Backend

Small FastAPI backend for the Personal Finance Tracker.

## Setup

```bash
python -m venv .venv
.venv\Scripts\activate
python -m pip install -r requirements.txt
```

## Run

```bash
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

## Endpoints

### GET /transactions

Returns all saved transactions from `data/transactions.json`.

### POST /transactions

```json
{
  "type": "expense",
  "amount": 1200,
  "category": "Food",
  "date": "2026-06-04",
  "comment": "Lunch"
}
```

Transactions are stored in `data/transactions.json`.
