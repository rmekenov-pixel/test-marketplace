# Project State & Context — Kitap App (Test Marketplace)

## Current Phase & Stack
- **Project**: Test marketplace (Kitap App) — маркетплейс литературы (книги, каталог, корзина, роли продавца/покупателя).
- **Stack**: React 19, TypeScript, Vite, TailwindCSS, Zustand, i18next, React Router 7, Vitest.
- **Test suite**: 
pm test (vitest run) — 7 test suites, 30 tests.
- **Build**: 
pm run build (	sc -b && vite build).
- **Second Brain Integration**: C:\My PROJECTS\II nd brain\Second-Brain.

## Workflow Standard
- Любое изменение кодовой базы сопровождается прогоном тестов (
pm test).
- Запись результатов фиксируется в Second-Brain/journal/YYYY-MM-DD/test-marketplace.md.
- Финальные изменения коммитятся и пушатся в git.
