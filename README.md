# FlowBoard

> A frontend architecture case study exploring how analytics dashboards can evolve from mock data to production APIs without rewriting the UI.

[View the live demo](https://flowboard-rouge.vercel.app) | [Read the source code](https://github.com/nadiaescobbb/flowboard-ui)

**Focus areas:** TypeScript, React, testing, accessible design, dashboard architecture.

**Suggested GitHub topics:** `typescript`, `react`, `testing`, `accessible-design`, `dashboard`.

**Visual direction:** Editorial-technical revenue software. The interface uses warm paper tones in light mode, deeper operating-console surfaces in dark mode, burnt orange for action, and olive for positive movement.

---

## Why This Exists

FlowBoard was created as a portfolio project to practice and demonstrate how I structure a dashboard interface when the goal is not only visual polish, but maintainability.

It is not a real SaaS product and it does not connect to a production backend yet. The project uses mock data on purpose so the frontend decisions are easier to inspect:

- how data access is isolated from UI components;
- how asynchronous states are handled;
- how domain types protect component boundaries;
- how tables, charts, loading states, and error states are composed;
- how pure utilities can be tested without testing implementation details.

The core question behind the project was:

> How would I organize an analytics dashboard so it can later be connected to a real API without rewriting the UI?

---

## Problem It Solves

Many dashboard portfolio projects stop at "nice charts on a page." FlowBoard focuses on the next layer: the frontend structure around those charts.

The project simulates a product analytics dashboard where a team can scan:

- key business metrics;
- revenue trend data;
- acquisition channel performance;
- recent users;
- status filters, sorting, and pagination;
- loading and error states.

The practical problem it solves is not business analytics itself. The real problem is architectural: creating a small but realistic dashboard codebase that is easier to extend, test, and reason about than a single-page mockup.

---

## What It Demonstrates

- API access is isolated in `src/api/dashboard.ts`, so mock data can be replaced without touching UI components.
- TanStack Query handles loading, error, retry, cache, and refetch states through the same path a real backend would use.
- Branded types like `UserId`, `KPIId`, and `Percentage` prevent accidental domain mixups at compile time, such as passing a KPI id where a user id is expected.
- Runtime validation happens separately: `Percentage` validates when values are created, and the API payload is checked before data enters the UI layer.
- Custom SVG chart utilities power the revenue chart directly instead of sitting beside the component unused.
- Result helpers make API failures explicit before the hook adapts them to TanStack Query.
- The user table includes search, filters, sorting, pagination, and visible demo feedback for actions.
- Theme state lives in React context, with reusable class mapping for light and dark surfaces.
- Vitest covers validators, formatters, Result helpers, chart math, and user table interactions. Coverage thresholds track the pure utility layer at 80%+.
- Accessibility is treated as part of the implementation: aria labels, live status messaging, reduced motion support, and keyboard dismissal for dialogs.
- Playwright covers the theme toggle as an end-to-end browser flow.

---

## Tech Stack

| Layer | Tool | Why |
|---|---|---|
| UI | React 18 | Component model and ecosystem fit |
| Language | TypeScript strict | Safer domain boundaries |
| Build | Vite | Fast local workflow |
| Server state | TanStack Query | Loading, error, retry, and cache behavior |
| Styling | Tailwind CSS | Utility-first layout and theme speed |
| Tests | Vitest + Playwright | Unit, component, and browser coverage for critical dashboard behavior |
| Deploy | Vercel | Simple static deployment |

---

## Architecture

```txt
src/
  api/
    dashboard.ts
  components/
    user-table/
      Pagination.tsx
      SortableHeader.tsx
      UserMenu.tsx
      UserTable.tsx
      userTable.utils.ts
    AcquisitionChart.tsx
    DashboardSkeleton.tsx
    ErrorBoundary.tsx
    ErrorState.tsx
    Header.tsx
    KPICard.tsx
    RevenueChart.tsx
    Sidebar.tsx
  contexts/
    ThemeContext.tsx
  data/
    mockData.ts
  hooks/
    useDashboardData.ts
    useThemeClasses.ts
  pages/
    Dashboard.tsx
  types/
    index.ts
  utils/
    index.ts
    index.test.ts
```

The `user-table` module is split because tables tend to grow quickly. Keeping menu actions, pagination, sorting headers, and filtering helpers separate makes the component easier to review and extend.

---

## Key Decisions

### Data Layer Isolation

The dashboard reads data through `fetchDashboardData()` instead of importing mock data directly into components. Today that function returns local mock data; later it can call REST, GraphQL, or Supabase without changing the dashboard layout.

### TanStack Query

The app uses TanStack Query because dashboards almost always become server-state heavy. Even in this mock version, it owns runtime loading, error, retry, cache, and refetch behavior in one place.

### Result-Based Data Fetching

`fetchDashboardData()` returns a `Result<DashboardData>` instead of throwing directly. The `useDashboardData()` hook unwraps that result for TanStack Query, returning data on `ok` and throwing the error on `err` so retry and error UI still work through the query layer.

### Branded Types

IDs like `UserId` and `KPIId` are branded types. They prevent accidental ID mixups at compile time while runtime validators handle invalid values separately.

### Runtime Validation

Values such as `Percentage` are validated when they are created, and `fetchDashboardData()` validates the composed dashboard payload before returning `ok`. This keeps compile-time branding and runtime validation as separate responsibilities.

### Custom SVG Utilities

The revenue chart uses shared utility functions for point normalization and SVG path creation. This is intentionally lower level than using a chart library, because the goal was to show coordinate and rendering logic in code that the component actually uses.

### Accessibility

Interactive controls use descriptive `aria-label` values, status messages use live roles, and dialogs can be dismissed with Escape. The theme toggle is covered by an end-to-end browser test.

### Honest UI Actions

The interface includes action feedback for demo flows like invite, edit, profile preview, search, notification selection, and acquisition insights. These are not full backend flows; they are visible demo states instead of hidden `console.log` placeholders.

---

## Scope and Next Steps

| Current scope | Why it is scoped this way | Next production step |
|---|---|---|
| Mock data behind an API boundary | Keeps the frontend architecture inspectable while preserving a backend swap path. | Connect `fetchDashboardData()` to a real endpoint. |
| No authentication flow | The case study focuses on dashboard architecture, not identity management. | Add an auth provider and route protection without changing the data layer. |
| Demo-only mutations | Actions show visible UI feedback while avoiding fake persistence. | Add create, update, and delete flows with optimistic updates. |
| Limited E2E coverage | Playwright covers the theme toggle, while table and error flows remain in unit/component scope. | Add Playwright coverage for search, filters, pagination, and error recovery. |
| Custom SVG charting | The project exposes coordinate and rendering logic directly. | Use Recharts, Visx, or ECharts if production chart complexity grows. |
| Small dataset | The dataset is sized for interaction design and state coverage. | Add virtualization when the user list becomes large. |

---

## Getting Started

```bash
npm install
npm run dev
```

Local app:

```txt
http://localhost:5173
```

---

## Testing

```bash
npm run test:run
npm run e2e
npm run coverage
npm run lint
npm run build
```

### Unit and Component Tests

Run the Vitest suite:

```bash
npm run test:run
```

What it covers:

- runtime validators such as `createPercentage`;
- formatters and Result helpers;
- chart math and SVG utility behavior;
- user table search, status filters, pagination, empty states, dialogs, and demo action feedback.

Run coverage thresholds:

```bash
npm run coverage
```

Coverage thresholds currently track the pure utility layer at 80%+ while component tests cover user-visible behavior.

### Playwright E2E

Run the browser test:

```bash
npm run e2e
```

What it covers:

- theme toggle behavior in Chromium;
- persistence through `localStorage`;
- data stability across light and dark themes.

Playwright starts the Vite dev server automatically through `playwright.config.ts`.

### CI Checks

GitHub Actions runs these checks on `push` to `main` and on pull requests:

- `npm ci`;
- `npm run lint`;
- `npm run coverage`;
- `npm run build`;
- `npm run e2e`.

---

## What I Would Add Next

- Replace the mock API with a small real backend or Supabase table.
- Add Playwright tests for search, filters, pagination, dashboard loading, and error recovery.
- Add MSW for API-level mocks in component and hook tests.
- Add a mutation flow for inviting or editing a user.
- Add chart empty states and richer accessibility descriptions.

---

## Author

Built by Nadia Escobar as a frontend architecture portfolio case study.
