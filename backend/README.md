# BudgetBoard Backend

Small FastAPI backend for the Personal Finance Tracker.

## Setup

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Run

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

## Endpoints

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

