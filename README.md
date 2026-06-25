# BudgetBoard

Личный трекер финансов (Personal Finance Tracker) — приложение для учёта доходов и
расходов, просмотра аналитики и контроля баланса по категориям.

Проект состоит из двух независимых частей, каждая живёт в своей папке:

| Папка            | Что это                                              | Технологии                                                    |
|------------------|------------------------------------------------------|---------------------------------------------------------------|
| `budgetboard/`   | **Frontend** — клиентское веб-приложение              | Nuxt 4, Vue 3, Nuxt UI, TailwindCSS, TypeScript, ApexCharts   |
| `backend/`       | **Backend** — REST API сервер                        | Python, FastAPI, Pydantic                                     |

---

## Содержание

- [Требования](#требования)
- [Структура проекта](#структура-проекта)
- [Быстрый старт](#быстрый-старт)
- [Backend (FastAPI)](#backend-fastapi)
  - [Установка](#установка-backend)
  - [Запуск](#запуск-backend)
  - [API эндпоинты](#api-эндпоинты)
  - [Хранение данных](#хранение-данных)
- [Frontend (Nuxt)](#frontend-nuxt)
  - [Установка](#установка-frontend)
  - [Запуск](#запуск-frontend)
  - [Страницы приложения](#страницы-приложения)
  - [Конфигурация](#конфигурация-frontend)
  - [Архитектура фронтенда](#архитектура-фронтенда)
- [Скрипты и линтинг](#скрипты-и-линтинг)

---

## Требования

- **Node.js** >= 18 (рекомендуется LTS) и **npm** — для frontend
- **Python** >= 3.10 и **pip** — для backend

---

## Структура проекта

```
BudgetBoard/
├── budgetboard/        # Frontend (Nuxt 4 + Vue 3)
│   ├── app/
│   │   ├── assets/         # стили (main.css)
│   │   ├── constants/      # константы (навигация и т.д.)
│   │   ├── features/       # фичи по доменам (transactions, index)
│   │   │   └── transactions/
│   │   │       ├── api/        # сервисы для запросов к API
│   │   │       ├── composables # Vue-компоузы (хуки работы с данными)
│   │   │       ├── models/     # TypeScript-типы и модели
│   │   │       └── ui/         # UI-компоненты фичи
│   │   ├── layouts/       # лейауты (default.vue)
│   │   ├── pages/         # файловый роутинг Nuxt
│   │   └── shared/        # общий код (config, lib, models, ui)
│   ├── public/            # статика
│   ├── nuxt.config.ts     # конфиг Nuxt
│   └── package.json
│
├── backend/            # Backend (FastAPI)
│   ├── app/
│   │   ├── main.py         # точка входа, роуты и бизнес-логика
│   │   ├── models.py       # Pydantic-модели и схемы
│   │   └── storage.py      # работа с JSON-хранилищем данных
│   ├── data/              # JSON-файлы с данными (gitignored)
│   │   ├── transactions.json
│   │   └── categories.json
│   ├── requirements.txt   # Python-зависимости
│   └── .gitignore
│
└── README.md           # этот файл
```

---

## Быстрый старт

Приложение требует запуска **обоих** серверов — backend и frontend — в отдельных
терминалах.

1. В первом терминале подними backend (см. [Backend](#backend-fastapi)):
   ```bash
   cd backend
   python -m venv .venv
   .venv\Scripts\activate          # Windows (PowerShell: .venv\Scripts\Activate.ps1)
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8000
   ```

2. Во втором терминале подними frontend (см. [Frontend](#frontend-nuxt)):
   ```bash
   cd budgetboard
   npm install
   npm run dev
   ```

3. Открой в браузере **http://localhost:3000**

Frontend ходит за данными на backend по адресу из `runtimeConfig.public.apiUrl`
(по умолчанию `http://127.0.0.1:8000`).

---

## Backend (FastAPI)

### Установка backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
# .venv/bin/activate            # macOS / Linux
pip install -r requirements.txt
```

> Зависимости: `fastapi==0.115.6`, `uvicorn[standard]==0.34.0`.

### Запуск backend

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Интерактивная документация API (Swagger UI) доступна после запуска по адресу:
**http://127.0.0.1:8000/docs**

### API эндпоинты

Все роуты определены в `backend/app/main.py`.

| Метод   | Маршрут                                  | Описание                                                  |
|---------|------------------------------------------|-----------------------------------------------------------|
| `GET`   | `/transactions`                          | Все сохранённые транзакции                                |
| `GET`   | `/transactions/categories`               | Список доступных категорий                                |
| `GET`   | `/transactions/categories/summary?type=` | Сводка по категориям за текущий месяц (`type=income\|expense`) |
| `GET`   | `/transactions/income/total`             | Сумма доходов за текущий месяц + процент изменения         |
| `GET`   | `/transactions/expense/total`            | Сумма расходов за текущий месяц + процент изменения        |
| `GET`   | `/transactions/balance`                  | Остаток (доходы минус расходы) + процент изменения         |
| `GET`   | `/transactions/count`                    | Количество транзакций за месяц + процент изменения         |
| `POST`  | `/transactions`                          | Создать новую транзакцию                                   |
| `PUT`   | `/transactions/{id}`                     | Обновить транзакцию                                        |
| `DELETE`| `/transactions/{id}`                     | Удалить транзакцию                                         |

Поле `changePercent` показывает изменение текущего месяца относительно среднего
значения по предыдущим месяцам и ограничено диапазоном `0–100`.

**Пример создания транзакции** (`POST /transactions`):

```json
{
  "type": "expense",
  "amount": 1200,
  "category": "Food",
  "date": "2026-06-04",
  "comment": "Lunch"
}
```

> Валидация: для `expense` поле `category` обязательно; `amount` должен быть > 0.
> Логика валидации — в `backend/app/models.py`.

### Хранение данных

Данные хранятся в виде JSON-файлов в папке `backend/data/` (эта папка добавлена в
`.gitignore` и в репозиторий не попадает):

- `transactions.json` — список всех транзакций.
- `categories.json` — список категорий расходов.

Вся работа с файлами вынесена в `backend/app/storage.py`. База данных не
используется — это простое файловое хранилище.

---

## Frontend (Nuxt)

### Установка frontend

```bash
cd budgetboard
npm install
```

### Запуск frontend

```bash
npm run dev
```

Сервер разработки поднимается на **http://localhost:3000**.

Сборка production-версии:

```bash
npm run build
npm run preview   # локальный предпросмотр production-сборки
```

### Страницы приложения

Роутинг в Nuxt — файловый (папка `budgetboard/app/pages/`). Пункты меню
(сайдбара) описаны в `budgetboard/app/constants/navigation.ts`.

| Путь            | Страница (`pages/*.vue`) | Назначение                                |
|-----------------|--------------------------|-------------------------------------------|
| `/`             | `index.vue`              | Дашборд: сводка доходов, расходов, баланса |
| `/transactions` | `transactions.vue`       | Список транзакций (таблица, CRUD)         |
| `/categories`   | `categories.vue`         | Управление категориями                    |
| `/analytics`    | `analytics.vue`          | Графики и аналитика                       |
| `/settings`     | `settings.vue`           | Настройки                                 |

### Конфигурация frontend

Базовый URL backend-а настраивается в `budgetboard/nuxt.config.ts`:

```ts
runtimeConfig: {
  public: {
    apiUrl: 'http://127.0.0.1:8000'   // адрес backend API
  }
}
```

В продакшене URL можно переопределить через переменную окружения
`NUXT_PUBLIC_API_URL`.

### Архитектура фронтенда

Проект следует **feature-based (FSD-подобной)** структуре:

- **`app/features/`** — крупные доменные фичи. Например, `transactions/` содержит
  внутри себя всё, что относится к транзакциям:
  - `api/` — сервис для HTTP-запросов (`transactions.service.ts`), использует
    Nuxt `$fetch` и `useRuntimeConfig`.
  - `composables/` — Vue-композаблы (`useTransactions`, `useTotal`,
    `useCategories` и др.) — аналогично сервисам/хукам в Angular.
  - `models/` — TypeScript-типы и вспомогательные функции форматирования.
  - `ui/` — компоненты, специфичные для фичи.
- **`app/shared/`** — переиспользуемый код вне доменов:
  - `ui/` — общие UI-компоненты (`AppSidebar`, `BaseWidget`, `DiagramWidget` и
    др.). Подключены глобально через `components: [{ path: '~/shared/ui', pathPrefix: false }]`
    в `nuxt.config.ts`.
  - `config/`, `lib/`, `models/` — конфиги, утилиты и общие модели.
- **`app/pages/`** — страницы, которые собирают фичи вместе.
- **`app/layouts/`** — лейауты (обёртки страниц, в т.ч. сайдбар).
- **`app/constants/`** — константы (например, навигация).

Связь с API осуществляется через `useTransactionService()` в
`budgetboard/app/features/transactions/api/transactions.service.ts`.

---

## Скрипты и линтинг

Команды выполняются из папки `budgetboard/`:

| Команда            | Действие                                  |
|--------------------|-------------------------------------------|
| `npm run dev`      | Запуск сервера разработки                 |
| `npm run build`    | Production-сборка                         |
| `npm run preview`  | Локальный предпросмотр сборки             |
| `npm run lint`     | Проверка кода ESLint                      |
| `npm run lint:fix` | Автоисправление проблем ESLint            |
| `npm run generate` | Статическая генерация (SSG)               |

В проекте настроены:
- **ESLint** (`eslint.config.mjs`) — через `@nuxt/eslint`.
- **Prettier** (`.prettierrc`).
- **EditorConfig** (`.editorconfig`): 2 пробела, UTF-8, LF.
- **Husky** (`.husky/`) — git-хуки.
