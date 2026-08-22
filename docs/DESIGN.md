# DESIGN.md: Frontend Interface Guidelines

## 1. Global Philosophy & Tech Stack

- **Architecture (Angular SPA):** Single Page Application. Zero page reloads (no flickering) during routing, filtering, or pagination. State updates must be instant and reactive.
- **Mobile-First Grid:** Layouts must be built using Tailwind CSS utility classes, starting from mobile breakpoints and scaling up to desktop.
- **Anti-Vibe Coding:** Strictly utilitarian, data-dense, and straightforward. Prohibited elements include: neon gradients, soft/colored shadows, pulsating animations, AI-generated visual fluff, and complex nested containers. Rely on standard Tailwind grid and flexbox alignments.
- **Accessibility & Functionality:** High-contrast text only. Generous padding on touch targets (buttons, links). Form over decoration: let the product images stand out.

## 2. Design Tokens (Tailwind Basis)

| Element         | Hex Code  | Usage Context                                          |
| --------------- | --------- | ------------------------------------------------------ |
| Dark Surface    | `#101010` | Header, Footer, and Admin Sidebar backgrounds.         |
| Base Background | `#f5f5f7` | Main body background (applies to `<body>`).            |
| Brand Blue      | `#0573cc` | Logo elements, active states, highlighted icons.       |
| Action Blue     | `#077fbd` | Primary CTAs (Add to Cart, WhatsApp) and hover states. |
| Card Surface    | `#FFFFFF` | Product cards, form containers, dropdowns.             |

## 3. Page Structures & Layouts

**Global Components**

- **Header (Sticky):** Background `#101010`.
- _Left:_ Brand Logo.
- _Center:_ Wide, functional search bar (expanding on focus).
- _Right:_ WhatsApp button, User Account icon, Cart icon.
- _Navigation:_ Hover-triggered _Mega Menu_ (desktop). Categories must be displayed in a multi-column CSS grid, strictly avoiding endless vertical scrolling dropdowns.

- **Footer:** Background `#101010`.
- _Layout:_ Multi-column grid containing company details, CNPJ, contact info, security badges, and quick links.
- _Bottom Bar:_ Centered copyright and signature: `Created by: <Your Name> - ⟨ Quantum Computing | † | Software Engineering ⟩`.

**Home Page**

- **Hero Section:** Utilitarian banner focused on a flagship product or current main category. No visual clutter.
- **Brand Carousel:** Horizontal list of partner brands (Jack, Sun Special, etc.) acting as quick filters.
- **Product Highlights:** Responsive grid (2 columns mobile, 4+ desktop) displaying top-selling machines.
- **Media / Shorts:** A section with standard 16:9 or 9:16 video placeholders (lazy-loaded YouTube iframes) demonstrating machines in action.
- **Institutional Snippet:** A brief, one-paragraph text block introducing the company, with a CTA linking to the full "About Us" page.

**Product Catalog & Search**

- **Desktop Layout:** Two columns.
- _Sidebar (Left, 25% w, Sticky):_ Native HTML checkboxes and range sliders for filters (Brand, Stitch Type, Price).
- _Product Grid (Right, 75% w):_ Reactive grid updating instantly upon filter changes.

- **Mobile Layout:** Filters are hidden by default and accessible via an off-canvas sidebar or bottom sheet modal.
- **Product Card Anatomy:** Background `#FFFFFF`. Contains: clean product image, short bold H3 title, SKU, current price (largest text), and a full-width "Add to Cart" button (Action Blue).

**Product Details Page (PDP)**

- **Top Layout (Buy Box):** Two columns. Left: Clean product image gallery over `#f5f5f7` background. Right: H1 Title, SKU, Price, quantity selector, and full-width Action Blue "Add to Cart" button.
- **Content Strategy (Anti-Vibe):** Strictly prohibit the use of emojis (⚙️, 📌, etc.) as bullet points. Use standard CSS markers or professional SVG icons from a library like Lucide/Heroicons.
- **Specifications Table:** Standard full-width HTML `<table>`. Borders should be subtle (`border-gray-200`). Alternate row background colors (zebra striping) using `#FFFFFF` and `#f5f5f7` for readability, avoiding heavy structural lines.
- **Related Products:** A single horizontal row (or grid) of minimal product cards at the bottom of the page.

**About Us (Institutional)**

- **Layout:** Single-column, center-aligned.
- **Typography Constraint:** Text container strictly limited to `max-w-prose` (Tailwind) to ensure optimal reading width and prevent eye strain.
- **Structure:** Clear `h2` section headers. Brief paragraphs mixed with static, high-quality rectangular images of the store/facilities (no abstract or decorative imagery).

**Login / Register**

- **Layout:** Ultra-minimalist. Background `#f5f5f7`.
- **Content:** A single, centered `#FFFFFF` card containing standard form inputs (email, password).
- **Restriction:** Absolutely no institutional walls of text, marketing copy, or "benefits of creating an account" paragraphs. Purely functional authentication.

**Admin Panel (Mock)**

- **Layout:** High data-density focus.
- **Sidebar:** Fixed `#101010` left sidebar for navigation (Products, Orders, Customers).
- **Main Content:** Full-width area utilizing standard data-tables. Tables must include clear columns, pagination, and simple action buttons (Edit/Delete). Aesthetics are entirely secondary to utility and screen real estate.
