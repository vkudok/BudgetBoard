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

### GET /transactions/categories

Returns the default transaction categories in English from `data/categories.json`.

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

### PUT /transactions/{transaction_id}

Updates one transaction by its `id`.

Input:

```json
{
  "type": "expense",
  "amount": 1500,
  "category": "Food",
  "date": "2026-06-12",
  "comment": "Dinner"
}
```

Returns the updated transaction.
Returns `404 Not Found` when a transaction with this `id` does not exist.

### DELETE /transactions/{transaction_id}

Deletes one transaction by its `id`.

Returns `204 No Content` when the transaction was deleted.
Returns `404 Not Found` when a transaction with this `id` does not exist.

Data is stored as JSON files in `data/`.
