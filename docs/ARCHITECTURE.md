# ARCHITECTURE.md: Project Structure & Data Flow

This document defines the macro-architecture for the Skytec Prototype. It complements the base rules defined in `.gemini/GEMINI.md`. The goal is to maintain a scalable, module-less architecture using Angular 21, optimized for rapid prototyping using mock data.

## 1. Directory Structure

The `src/app` directory follows a simplified Feature-Sliced approach, strictly separating domain logic from reusable UI elements.

- `core/`: Contains singletons and application-wide configurations.
  - `data/`: Houses the static mock files (e.g., `products.json`).
  - `services/`: Singleton services (`providedIn: 'root'`) responsible for reading mock data.
  - `models/`: TypeScript interfaces representing the domain (Product, Category, etc.).
- `shared/`: Highly reusable, domain-agnostic UI components (dumb components).
  - `ui/`: Buttons, inputs, generic cards, modals.
  - `layout/`: Global Header and Footer components.
- `features/`: Domain-specific routing and container components.
  - `home/`: Hero section, brand carousels.
  - `catalog/`: Product listing, filtering logic, and the Product Details Page (PDP).
  - `auth/`: Login and registration containers.
  - `admin/`: Mock dashboard view.

## 2. Component Pattern (Smart vs. Dumb)

Even for a prototype, strictly separate data fetching from presentation.

- **Smart Components (Containers):** Located in `features/`. They inject core services to retrieve mock data, manage local state (using Signals), and pass data down. They rarely contain layout CSS.
- **Dumb Components (Presentational):** Located in `shared/ui/`. They receive data strictly via `input()` and emit events via `output()`. They contain the bulk of the Tailwind markup.

## 3. Mock Data Strategy

Since this is an interactive prototype (mocked frontend) without a backend, follow this data flow:

1.  **Interfaces First:** Define strict TypeScript interfaces in `core/models/` matching the JSON structure.
2.  **Service Abstraction:** Create a `ProductService` in `core/services/`. This service must directly import the JSON file (`import productData from '../data/products.json'`) and expose it via Signals.
3.  **No HTTP Requests:** Do not use `HttpClient` or attempt to mock HTTP interceptors for this phase. Keep the data layer synchronously available in memory to ensure zero-latency interactions during the presentation.

## 4. Styling & Layout Rules

- **Tailwind Exclusive:** All layout, spacing, and typography must be handled via Tailwind utility classes directly in the HTML template.
- **SCSS Restriction:** Component-level `.scss` files should be kept empty unless strictly necessary for complex animations or overriding external library styles. Do not write custom CSS grid or flexbox rules; use Tailwind's `grid` and `flex`.
- **Tokens:** Adhere exclusively to the custom color variables defined in `src/styles.scss` (e.g., `bg-base-bg`, `text-dark-surface`).

## 5. Routing Strategy

- Use standalone routing (no `RouterModule.forRoot()`).
- Every major domain under `features/` must be lazy-loaded using `loadComponent` or `loadChildren` in the main `app.routes.ts` file.
