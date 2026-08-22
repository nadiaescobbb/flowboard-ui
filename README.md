# FlowBoard

Dashboard de operaciones de revenue y retención para SaaS. React 18, TypeScript 5.7, TanStack Query v5.

[Demo en vivo](#) · [Código fuente](#)

## El problema que resuelve

Un dashboard de revenue no puede darse el lujo de mostrar un número mal cargado como si fuera un número real: si un endpoint de MRR falla y la UI lo interpreta como "cero ingresos", alguien toma una decisión de negocio sobre un dato que nunca existió. FlowBoard trata cada llamada a la API como una operación que puede fallar de forma explícita, no como una promesa que resuelve o explota.

Por eso las funciones de acceso a datos devuelven un tipo `Result<T, E>` en vez de lanzar excepciones:

```ts
export type Ok<T> = { readonly isOk: true; readonly value: T };
export type Err<E> = { readonly isOk: false; readonly error: E };
export type Result<T, E = Error> = Ok<T> | Err<E>;
```

Esto obliga a manejar el caso de error en el punto donde ocurre, antes de que el dato llegue a TanStack Query. No hay try/catch silenciosos ni pantallas que muestren un `0` que en realidad es un error de red.

El mismo criterio aplica a los identificadores. Pasar un `KPIId` donde se espera un `UserId` compila sin errores si ambos son `string` — hasta que produce un bug en producción que nadie ve en el código. Los identificadores de dominio son branded types, y el límite entre la API y la UI está validado en runtime con Zod, no solo en tiempo de compilación.

## Cómo se usa el panel de evaluación

FlowBoard incluye un panel flotante, colapsado por defecto, que permite simular errores 500, latencia de red de 2 segundos y respuestas de dataset vacío directamente sobre el demo en vivo. La razón de que exista es simple: un README puede describir el manejo de errores, pero solo se verifica rompiendo la aplicación en vivo.

## Sistema de diseño

Los tokens de color siguen rampas HSL cerradas de 9 pasos (100 a 900), tanto para los neutros de la superficie "Warm Paper" como para las series de datos en índigo. En los extremos de la rampa se sube la saturación y se corre el matiz hacia cian (198°) en los tintes claros y hacia azul profundo (235°) en los textos oscuros, para evitar el gris sucio que aparece cuando una rampa de color se genera solo interpolando luminosidad. Las alertas usan tres tonos coordinados (superficie, borde, texto) para mantener jerarquía sin bloques oscuros agresivos, y cada tendencia de KPI lleva flecha y signo además de color, para no depender del color como único canal de información.

## Stack

| Capa | Herramienta |
|---|---|
| Framework | React 18 |
| Lenguaje | TypeScript 5.7 (strict) |
| Build | Vite 6 |
| Estado de servidor | TanStack Query v5 |
| Gráficos | Recharts 2 |
| Validación | Zod |
| Testing | Vitest, React Testing Library, Playwright |

## Desarrollo local

```bash
npm install
npm run dev

# Tests unitarios y de integración
npm run test:run

# Cobertura (objetivo: 80%+)
npm run coverage

# Tests E2E
npm run e2e

# Build de producción
npm run build
```

## Créditos

Diseñado y desarrollado por Nadia Escobar 
