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

The statistics endpoints return `changePercent` as a value from `0` to `100`.

### GET /transactions/income/total

Returns the sum of all transaction amounts where `type` is `income`.
The `changePercent` value compares the current month total with the average
monthly income from previous months. If there are no previous months, it compares
the current month total with the current month income before the latest income
transaction date.

Output:

```json
{
  "total": 5000,
  "changePercent": 10
}
```

### GET /transactions/expense/total

Returns the sum of all transaction amounts where `type` is `expense`.
The `changePercent` value compares the current month total with the average
monthly expense from previous months. If there are no previous months, it compares
the current month total with the current month expense before the latest expense
transaction date.

Output:

```json
{
  "total": 2700,
  "changePercent": 5
}
```

### GET /transactions/balance

Returns the remaining money from received income.

The backend first sums all transaction amounts where `type` is `income`,
then subtracts the sum of all transaction amounts where `type` is `expense`.
If the result is less than `0`, the endpoint returns `0`.
The `changePercent` value compares the current month balance with the average
monthly balance from previous months. If there are no previous months, it compares
the current month balance with the current month balance before the latest
transaction date.

Output:

```json
{
  "total": 2300,
  "changePercent": 15
}
```

### GET /transactions/count

Returns the total number of saved transactions.
The `changePercent` value compares the current month count with the average
monthly transaction count from previous months. If there are no previous months,
it compares the current month count with the current month count before the latest
transaction date.

Output:

```json
{
  "total": 12,
  "changePercent": 20
}
```

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
