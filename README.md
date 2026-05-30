# FlowBoard Analytics Dashboard

> Frontend architecture case study built with React, TypeScript, TanStack Query, Vite, Tailwind CSS, and Vitest.

[Live Demo](https://flowboard-rouge.vercel.app) | [GitHub](https://github.com/nadiaescobbb/flowboard-dashboard)

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

- React component composition for dashboard screens.
- TypeScript strict mode and branded domain types.
- TanStack Query for server-state flow, even with mocked data.
- A separated API layer in `src/api/dashboard.ts`.
- Custom SVG chart utilities for path generation and normalization.
- User table search, filtering, sorting, pagination, and action feedback.
- Theme handling with React context and reusable theme class mapping.
- Unit tests for validators, formatters, Result helpers, and chart utilities.
- Explicit loading and error UI.

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

## Honest Limitations

| Limitation | Why it exists | Production next step |
|---|---|---|
| Mock data only | Portfolio scope | Connect the API layer to a real endpoint |
| No authentication | Not the goal of this case study | Add auth provider and route protection |
| No backend mutations | Demo actions only | Add create/update/delete flows with optimistic updates |
| No E2E tests yet | Initial test scope focused on pure utilities | Add Playwright for table, theme, and error flows |
| No chart library | Custom SVG was intentional practice | Use Recharts, Visx, or ECharts for complex production charts |
| Small dataset | Enough for UI behavior | Add virtualization for large user lists |

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
