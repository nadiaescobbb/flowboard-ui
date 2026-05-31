# FlowBoard

> A frontend architecture case study for a revenue dashboard designed to survive a backend swap.

[View the live demo](https://flowboard-rouge.vercel.app) | [Read the source code](https://github.com/nadiaescobbb/flowboard-dashboard)

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
- Branded types like `UserId`, `KPIId`, and `Percentage` prevent accidental domain mixups at compile time.
- Custom SVG chart utilities expose the coordinate and path-generation logic instead of hiding it behind a chart library.
- `AsyncState<T>` and Result helpers make success, loading, and failure states explicit.
- The user table includes search, filters, sorting, pagination, and visible demo feedback for actions.
- Theme state lives in React context, with reusable class mapping for light and dark surfaces.
- Unit tests cover validators, formatters, Result helpers, and chart math with an 80%+ coverage threshold.
- Accessibility is treated as part of the implementation: aria labels, roles, keyboard paths, and reduced motion support.

---

## Tech Stack

| Layer | Tool | Why |
|---|---|---|
| UI | React 18 | Component model and ecosystem fit |
| Language | TypeScript strict | Safer domain boundaries |
| Build | Vite | Fast local workflow |
| Server state | TanStack Query | Loading, error, retry, and cache behavior |
| Styling | Tailwind CSS | Utility-first layout and theme speed |
| Tests | Vitest | Fast unit tests close to the Vite stack |
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

The app uses TanStack Query because dashboards almost always become server-state heavy. Even in this mock version, it demonstrates loading, error, retry, cache, and refetch behavior in one place.

### Branded Types

IDs like `UserId` and `KPIId` are branded types. This prevents accidental ID mixups at compile time while keeping runtime data simple.

### Custom SVG Utilities

The revenue chart uses custom utility functions for point normalization and SVG path creation. This is intentionally lower level than using a chart library, because the goal was to show coordinate and rendering logic.

### Honest UI Actions

The interface includes action feedback for demo flows like invite, edit, profile preview, search, notification selection, and acquisition insights. These are not full backend flows; they are visible demo states instead of hidden `console.log` placeholders.

---

## Scope and Next Steps

| Current scope | Why it is scoped this way | Next production step |
|---|---|---|
| Mock data behind an API boundary | Keeps the frontend architecture inspectable while preserving a backend swap path. | Connect `fetchDashboardData()` to a real endpoint. |
| No authentication flow | The case study focuses on dashboard architecture, not identity management. | Add an auth provider and route protection without changing the data layer. |
| Demo-only mutations | Actions show visible UI feedback while avoiding fake persistence. | Add create, update, and delete flows with optimistic updates. |
| Unit tests only | The first test layer covers validators, formatters, Result helpers, and chart math. | Add Playwright coverage for table, theme, and error flows. |
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

## Verification

```bash
npm run build
npm run test:run
npm run lint
npm run coverage
```

The most important checks are:

- TypeScript compilation through `npm run build`;
- Vitest unit tests through `npm run test:run`;
- linting through `npm run lint`.

---

## What I Would Add Next

- Replace the mock API with a small real backend or Supabase table.
- Add Playwright tests for user search, filter, pagination, theme toggle, and error state.
- Add a mutation flow for inviting or editing a user.
- Add chart empty states and richer accessibility descriptions.
- Add CI so every pull request proves build, lint, and tests pass.

---

## Author

Built by Nadia Escobar as a frontend architecture portfolio case study.
