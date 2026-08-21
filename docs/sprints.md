# SkyTec Prototype — Development Sprints Roadmap

This roadmap outlines the atomic, step-by-step implementation plan for the **SkyTec** B2B e-commerce interactive prototype. It follows Angular 21 best practices (standalone components, Signals, native control flow, `OnPush` change detection), Tailwind CSS v4 design tokens, and strict zero-backend in-memory data flow.

---

## Sprint 0: Core Foundation & Data Layer

Establish the data contracts, state services, and foundational routing configuration.

- [x] **0.1 Domain Models & Interfaces**
  - Create `src/app/core/models/product.model.ts` with strict TypeScript interfaces matching `products.json` (`Product`, `ProductSpecification`, `ProductFilterState`, `Category`, `Brand`).
  - Create `src/app/core/models/cart.model.ts` for cart items, quantities, and totals.
  - Create `src/app/core/models/user.model.ts` for mock authentication state.
- [x] **0.2 Product Core Service**
  - Create `src/app/core/services/product.service.ts` (`providedIn: 'root'`) importing `products.json` directly.
  - Implement reactive Signals: `products()`, `categories()`, `brands()`, and computed helpers (`featuredProducts()`).
  - Implement synchronous retrieval methods: `getProductById()`, `getProductBySku()`, `getRelatedProducts()`.
- [x] **0.3 Cart State Service**
  - Create `src/app/core/services/cart.service.ts` using Signals (`items()`, `totalCount()`, `subtotal()`).
  - Implement methods: `addItem()`, `removeItem()`, `updateQuantity()`, `clearCart()`, `generateWhatsAppLink()`.
- [x] **0.4 Standalone App Routing Structure**
  - Configure `src/app/app.routes.ts` with lazy-loaded route declarations for all features (`/`, `/catalogo`, `/produto/:id`, `/sobre-nos`, `/conta`, `/admin`).

---

## Sprint 1: Shared UI Kit & Global Layout

Construct reusable dumb UI components and the persistent application frame (Header, Mega Menu, Footer).

- [x] **1.1 Base Dumb UI Components**
  - `src/app/shared/ui/button/button.component.ts`: Action Blue & Dark Surface button variants with focus states.
  - `src/app/shared/ui/badge/badge.component.ts`: Status and category chips.
  - `src/app/shared/ui/input/input.component.ts`: High-contrast form controls with floating or standard labels.
- [x] **1.2 Global Sticky Header**
  - Create `src/app/shared/layout/header/header.component.ts` with `#101010` background.
  - Brand Logo anchor with high-contrast SVG / typography.
  - Expanding functional Search Bar with real-time query signal binding.
  - Action icons: WhatsApp direct CTA, User Account link, Cart trigger with live reactive badge counter.
- [x] **1.3 Desktop Mega Menu**
  - Implement hover-triggered multi-column CSS grid dropdown inside Header.
  - Category listings (Reta, Overlock, Galoneira, etc.) without endless vertical scrolling.
  - Mobile responsive hamburger navigation drawer.
- [x] **1.4 Global Footer**
  - Create `src/app/shared/layout/footer/footer.component.ts` with `#101010` background.
  - Multi-column grid: Company details, CNPJ, contact info, security badges, and quick links.
  - Bottom bar with exact attribution: `Created by: <Your Name> — ⟨ Quantum Computing | † | Software Engineering ⟩`.
- [x] **1.5 Shell Integration**
  - Integrate Header, `<router-outlet />`, and Footer into `src/app/app.html`.

---

## Sprint 2: Home Page Feature

Implement the high-conversion, utilitarian B2B landing page using copy and design specs.

- [x] **2.1 Hero Section Component**
  - Create `src/app/features/home/components/hero/hero.component.ts`.
  - Implement official copy: H1, H2, and clean industrial imagery/background overlay.
  - Primary CTA directing to catalog.
- [x] **2.2 Flagship Product Highlight Banner (SKYMAK R8)**
  - Create `src/app/features/home/components/flagship-banner/flagship-banner.component.ts`.
  - Implement Tag ("Referência em máquinas de costura no Brasil"), H3, supporting copy, and cut-out product image.
  - Direct CTA button: "CONSULTAR UM VENDEDOR" (WhatsApp link).
- [x] **2.3 Partner Brands Carousel**
  - Create `src/app/features/home/components/brand-carousel/brand-carousel.component.ts`.
  - Horizontal quick-filter bar featuring Jack, Sun Special, Siruba, etc.
  - Route navigation to Catalog filtered by clicked brand.
- [x] **2.4 Best Sellers Product Grid**
  - Create `src/app/features/home/components/featured-products/featured-products.component.ts`.
  - Responsive 2-column (mobile) to 4-column (desktop) grid using dumb `ProductCardComponent`.
- [x] **2.5 Machinery in Action (Media / Shorts)**
  - Create `src/app/features/home/components/media-section/media-section.component.ts`.
  - Utilitarian 16:9 / 9:16 responsive video placeholders with lazy iframe loading.
- [x] **2.6 Institutional Snippet**
  - Create `src/app/features/home/components/institutional-snippet/institutional-snippet.component.ts`.
  - Concise company intro paragraph with link to the full "Sobre Nós" page.
- [x] **2.7 Home View Assembly**
  - Assemble all sub-components into `src/app/features/home/home.component.ts`.

---

## Sprint 3: Institutional ("Sobre Nós") Page

Build the single-column, content-dense institutional storytelling page adhering to prose constraints.

- [x] **3.1 Institutional Layout & Container**
  - Create `src/app/features/about/about.component.ts`.
  - Apply `max-w-prose mx-auto` container with high-contrast typography.
- [x] **3.2 Content Blocks Implementation**
  - Block 1: "Sua Jornada na Costura Começa Aqui" with right-aligned facility/store visual.
  - Block 2: "Soluções Completas em Maquinário" with left-aligned macro needle/feed dog visual.
  - Block 3: "Linhas e Aviamentos" with right-aligned thread/supplies visual.
  - Block 4: "Por que escolher a SKYTEC?" with primary CTA "Fale com um Consultor".

---

## Sprint 4: Product Catalog & Filtering Engine

Build the reactive B2B catalog with zero-latency instant filtering and search.

- [x] **4.1 Reusable Product Card Component**
  - Create `src/app/shared/ui/product-card/product-card.component.ts`.
  - White card surface (`#FFFFFF`), product image, bold H3 title, SKU badge, large price typography, and full-width Action Blue "Add to Cart" button.
- [x] **4.2 Catalog Filter Sidebar (Desktop & Mobile Drawer)**
  - Create `src/app/features/catalog/components/catalog-filters/catalog-filters.component.ts`.
  - Checkbox groups for Brands and Categories/Stitch Types.
  - Reactive price range slider (min/max bounds computed from data).
  - Mobile bottom-sheet / off-canvas filter drawer with active filter badges and clear button.
- [x] **4.3 Catalog State & Search Coordination**
  - Create `src/app/features/catalog/services/catalog-state.service.ts` or coordinate via `ProductService`.
  - Computed reactive signal for filtered & sorted products with zero page reloads.
- [x] **4.4 Catalog Page Container**
  - Create `src/app/features/catalog/catalog.component.ts`.
  - 2-column layout (25% sticky left sidebar, 75% reactive product grid).
  - Empty search state with reset button.

---

## Sprint 5: Product Details Page (PDP)

Construct the technical, anti-vibe product page with buy box, specifications table, and related items.

- [x] **5.1 Buy Box & Gallery Component**
  - Create `src/app/features/catalog/pages/product-detail/components/pdp-gallery/pdp-gallery.component.ts` over `#f5f5f7` background.
  - Create `src/app/features/catalog/pages/product-detail/components/pdp-buy-box/pdp-buy-box.component.ts` with H1, SKU, prominent Price, quantity selector, and Action Blue "Add to Cart" button.
- [x] **5.2 Technical Description & Differentials**
  - Structured bullet points using clean SVG icons (strictly no decorative emojis).
- [x] **5.3 Specifications Table Component**
  - Create `src/app/features/catalog/pages/product-detail/components/pdp-specs-table/pdp-specs-table.component.ts`.
  - Full-width HTML table with subtle `border-gray-200` and alternating zebra striping (`#FFFFFF` / `#f5f5f7`).
- [x] **5.4 Related Products Recommendation Strip**
  - Horizontal grid of related machines filtered by category/brand.
- [x] **5.5 PDP Container Assembly**
  - Assemble `src/app/features/catalog/pages/product-detail/product-detail.component.ts` reading `:id` route parameter via `withComponentInputBinding()`.

---

## Sprint 6: Authentication (Login & Register)

Build the minimalist, distraction-free account access interface.

- [x] **6.1 Auth Card & Tabs Component**
  - Create `src/app/features/auth/auth.component.ts`.
  - Centered `#FFFFFF` card on `#f5f5f7` background.
  - H1: "Minha conta SKYTEC" with toggle tabs: "Entrar" and "Cadastrar".
- [x] **6.2 Login Reactive Form**
  - Email and password inputs with strict validation and error states.
- [x] **6.3 Register Reactive Form**
  - Name, CNPJ/CPF, Email, Phone/WhatsApp, and password fields.
- [x] **6.4 Mock Auth State Flow**
  - Connect form submission to `AuthService` to set mock user session and redirect.

---

## Sprint 7: Admin Panel (Mock Management)

Implement the data-dense, utilitarian management interface for B2B operations.

- [x] **7.1 Admin Layout & Sidebar**
  - Create `src/app/features/admin/admin.component.ts` with `#101010` fixed sidebar.
  - Navigation links: Products, Orders, Customers, Settings.
- [x] **7.2 Products Data Table**
  - Create `src/app/features/admin/components/admin-product-table/admin-product-table.component.ts`.
  - High data-density table with SKU, Name, Brand, Category, Price, and Quick Actions (Edit/Delete).
  - Search and column sorting.
- [x] **7.3 Add / Edit Product Modal Form**
  - Reactive form dialog to simulate adding a new machine to the in-memory signal store.
- [x] **7.4 Mock Orders & Customers Views**
  - Utilitarian summary tables for recent B2B order quotes and registered clients.

---

## Sprint 8: Cart Drawer, WhatsApp B2B Flow & Final Polish

Complete the checkout flow, lead generation, and accessibility verification.

- [x] **8.1 Slide-over Cart Drawer**
  - Create `src/app/shared/layout/cart-drawer/cart-drawer.component.ts`.
  - Item list, quantity increment/decrement, subtotal calculation, and remove action.
- [ ] **8.2 WhatsApp B2B Quote Integration**
  - Format cart contents into a pre-filled WhatsApp message payload (SKUs, quantities, estimated total).
  - "Finalizar Orçamento via WhatsApp" CTA trigger.
- [ ] **8.3 Accessibility (a11y) & WCAG AA Audit**
  - Validate high-contrast color ratios across light and dark surfaces.
  - Ensure full keyboard navigation (`Tab`, `Escape`, `Enter`) on Mega Menu, Modals, and Drawers.
  - Verify ARIA attributes on interactive controls.
- [ ] **8.4 Performance & Anti-Flicker Verification**
  - Audit `OnPush` change detection and pure Signal computations across all views.
  - Ensure zero page reloads and instant mock transitions.
