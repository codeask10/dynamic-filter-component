# Dynamic Filter Component

A React + TypeScript data table with a schema-driven filter builder. Add a
field to a filter config and the right operators and input widget (text,
number, amount range, date, date range, boolean, select, multi-select) show
up automatically — no UI code changes needed per field.

## Stack

React · TypeScript · Vite · MUI

## Getting started

```bash
npm install
npm run dev          # start the app
npm run mock-api     # optional: json-server on :3001, serves mock/db.json
```

Other scripts: `npm run build`, `npm run type-check`, `npm run preview`.

## How it works

- **`filters/`** — per-entity filter schemas (which fields are filterable,
  which operators each one supports). This is the single source of truth
  the FilterBuilder renders from.
- **`services/`** — filtering business logic (operator evaluation,
  `applyFilters`, validation). No React here.
- **`components/FilterBuilder/`** — the filter UI. Each row is
  `Field → Operator → value input → Delete`; the value widget is picked
  purely from the field's type and selected operator.
- **`components/DataTable/`** — a generic, paginated table with loading and
  empty states.
- **`pages/`** — one page per entity (Users, Transactions, Orders), each
  just wiring its data + columns + filter schema into `PageView`.

## Project structure

```
src/
├── api/         entity types
├── components/  DataTable, FilterBuilder, PageView
├── data/        static in-memory datasets
├── filters/     filter schema per entity
├── pages/       Users / Transactions / Orders
├── services/    operators, filtering engine, validation
├── theme/       MUI theme
├── types/       shared domain types
└── utils/       generic helpers (date, currency, nested value lookup)
```
