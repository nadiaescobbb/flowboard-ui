# FlowBoard — Revenue & Retention Operations Board

> A high-density, production-ready SaaS Revenue Operations & Churn Intelligence dashboard built with React 18, TypeScript 5.7, TanStack Query v5, and a testable Repository Pattern.

[Live Demo](https://flowboard-rouge.vercel.app) | [Source Code](https://github.com/nadiaescobbb/flowboard-ui)

---

## 📸 Visual Overview

![FlowBoard Dashboard Light Theme](./images/dashboard-light.png)

*Warm Paper Theme (Light Mode)*

![FlowBoard Dashboard Dark Theme](./images/dashboard-dark.png)

*Carbon Slate Theme (Dark Mode)*

---

## 🎯 Case Study & Business Context

Unlike generic analytics templates that show disconnected metrics, **FlowBoard** is structured as an operational software system for SaaS revenue teams. It addresses both **Product/Business pain** (identifying customer churn risk and revenue movement) and **Engineering pain** (isolating API contracts from UI rendering).

### Key Product Features
- **Retention Risk & Anomaly Detection**: Banner alert targeting accounts at risk of churn due to payment retries with actionable segment filtering.
- **Asymmetric Revenue Telemetry**: Weighted KPI hierarchy prioritizing Monthly Recurring Revenue (MRR) and Net Revenue Retention (NRR) over supporting subscription metrics.
- **Ranked Channel Attribution**: Conversion breakdown rendered via horizontal progress bars for direct, effortless data scanning.
- **Seamless Operational Customer Table**: High-density table supporting debounced searching, status filtering (`Paid`, `Retrying`, `Failed`), multi-column sorting, pagination, and CSV exports.
- **Portfolio Inspector (Dev Controls)**: Embedded floating panel allowing evaluators to simulate 500 server errors, slow network latency (2000ms), and empty dataset responses directly in the live demo.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph UI Layer ["UI & Presentation Layer"]
      DashboardPage["DashboardPage.tsx"]
      Header["Header.tsx"]
      KpiGrid["KpiGrid.tsx (Asymmetric Hierarchy)"]
      RevenueChart["RevenueChart.tsx (Recharts)"]
      ChannelBreakdown["ChannelBreakdown.tsx (Ranked Bars)"]
      CustomerTable["CustomerTable.tsx (Seamless Layout)"]
      DevToolsInspector["DevToolsInspector.tsx (Portfolio Inspector)"]
    end

    subgraph StateLayer ["State & Server Query Layer"]
      TQ["TanStack Query v5 Hooks"]
      SimCtx["SimulationContext (Latency / Error Injection)"]
      ThemeCtx["ThemeContext (Light Warm Paper / Dark Slate)"]
    end

    subgraph DomainLayer ["Domain & Repository Layer"]
      Repo["DashboardRepository (Repository Pattern)"]
      ResultMonad["Result Monad (Ok / Err)"]
      ZodValidation["Zod Runtime Schema Validation"]
      BrandedTypes["Branded Types (UserId, CurrencyAmount, Percentage)"]
    end

    DashboardPage --> TQ
    TQ --> Repo
    Repo --> ResultMonad
    Repo --> ZodValidation
    ZodValidation --> BrandedTypes
    DevToolsInspector --> SimCtx
    SimCtx --> Repo
```

---

## 💡 Engineering Highlights & Trade-offs

### 1. Functional Error Handling with Result Monad
Instead of relying on fragile `try/catch` blocks or silent `catch` fallbacks, API methods return an explicit `Result<T, E>` monad:
```ts
export type Ok<T> = { readonly isOk: true; readonly value: T };
export type Err<E> = { readonly isOk: false; readonly error: E };
export type Result<T, E = Error> = Ok<T> | Err<E>;
```
This guarantees that error states are handled explicitly before passing data to TanStack Query.

### 2. Compile-Time Branded Types & Runtime Zod Schemas
To prevent accidental domain parameter mixups (e.g., passing a `KPIId` where a `UserId` is expected), domain primitives use **Branded Types**. Runtime boundary safety is ensured via Zod schema parsing before data reaches UI components:
```ts
export type UserId = string & { readonly __brand: unique symbol };
export type CurrencyAmount = number & { readonly __brand: unique symbol };
```

### 3. Editorial-Technical Visual System
Designed to avoid generic "AI template" tropes:
- **Palette**: Warm paper tones in light mode (`#F8F7F4`), deep carbon slate console in dark mode (`#0F1115`).
- **Typography**: Dual hierarchy pairing `Inter` for UI elements and `JetBrains Mono` for currency, percentages, timestamps, and customer IDs.
- **Density**: Crisp 1px solid borders (`#E5E0D8`), compact table rows (40px), and zero decorative 3D elements.

---

## 🧪 Testing & Verification

The codebase maintains strict quality thresholds covering pure utilities, API adapters, and UI interactions:

```bash
# Run unit and integration tests
npm run test:run

# Run test coverage report (Target: 80%+)
npm run coverage

# Build production bundle
npm run build

# Run Playwright E2E browser tests
npm run e2e
```

---

## 🛠️ Tech Stack

| Layer | Tool | Rationale |
|---|---|---|
| Framework | React 18 | Declarative component architecture |
| Language | TypeScript 5.7 Strict | Domain type safety & branded types |
| Build Tool | Vite 6 | Instant HMR and optimized production bundles |
| Server State | TanStack Query v5 | Auto-caching, retries, and network state management |
| Charts | Recharts 2 | Responsive SVG data visualization |
| Validation | Zod | Runtime contract validation at data boundaries |
| Styling | Tailwind CSS + Custom CSS Variables | Design tokens for Warm Paper / Carbon Slate themes |
| Testing | Vitest + RTL + Playwright | Unit, component, and E2E browser coverage |
