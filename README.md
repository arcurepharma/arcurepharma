# 🏥 Arcure Pharma — Pharmacy E-commerce & Admin Panel

A modern, responsive pharmacy e-commerce website with a full admin panel.

**Stack:** Next.js (App Router) + React + TypeScript + Tailwind CSS · Drizzle ORM + Drizzle Kit · Neon PostgreSQL · ImageKit API

## ✨ Features

### Public Storefront
- **Header / Navbar** — logo, navigation links, cart icon with dynamic badge count, **theme toggle**
- **Theme Switcher** — toggle between **Leaf Green + White** and **Navy Blue + White** (flat/solid colors, no gradients); persists in localStorage
- **Custom Cursor** — glow dot + smooth trailing ring that follows the mouse (fine-pointer devices only)
- **Hero Slider** — dynamic 3-slide carousel; auto-slide duration controlled via the database
- **Our Products** — grid layout with elegant product cards (image, title, price, Add to Cart)
- **Client Testimonials** — "What Our Clients Say" review section
- **Vision Panel** — pharmacy mission & health commitment
- **About Us & Footer** — company note, privacy policy link, quick links, social icons, contact info
- **Footer Credit** — "Created by Muhammad Ayan"

### User Accounts & Panel (`/account`)
- **Register / Login** — create an account with email + password (JWT in an httpOnly cookie)
- **My Orders** — logged-in users see their full order history with live status
  (Pending → Confirmed → Dispatched → On the way → Delivered), item details, and totals
- **Order tracking** — each placed order is linked to the signed-in user's account
- Checkout offers an optional password to auto-create an account and track your order

### E-Commerce & Checkout
- Cart with add / remove / quantity controls, persisted via Zustand
- Customer order form (Email, optional Password for account, Full Address: House/Flat #, Street, Landmark, Postal Code, Phone)
- Delivery charges applied dynamically from admin settings
- **Thank You page** with full printable invoice (item names, quantities, individual prices, delivery fee, total)

### Admin Panel (`/admin`)
- **Dashboard** — stats overview + recent orders
- **Slider Management** (CRUD) — upload via ImageKit, edit, delete, add; plus auto-slide duration setting (seconds)
- **Product Management** (CRUD) — title, price, description, category, image upload. **Multiple images per product** supported (upload several, mark a cover image)
- **Product Detail Page** (`/product/[id]`) — image gallery with thumbnails, quantity selector, Add to Cart + Buy Now
- **Category Management** (CRUD) — create, edit and delete product categories; product forms load categories from the database
- **Delivery Fee Control** — global delivery charge setting
- **Order Management** — table of all orders, detail view (customer contact, shipping address, items, full invoice summary), status dropdown (Confirmed / Dispatched / On the way / Delivered)

### Checkout
- All delivery/contact fields are mandatory (full name, email, phone, house/flat #, street, landmark, postal code)
- Optional password auto-creates an account to track orders

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Create a `.env.local` file (see `.env.local` for the template) with:
```env
DATABASE_URL=postgresql://...your-neon-db-url...
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
ADMIN_PASSWORD=admin123
AUTH_SECRET=any-long-random-string-for-jwt-signing
```

### 3. Set up the database
```bash
# Generate SQL migrations from the schema (already generated in /drizzle)
npm run db:generate

# Push the schema to your Neon PostgreSQL database
npm run db:push

# (Optional) Seed default settings (delivery fee, slider duration)
npm run db:seed
```

### 4. Run the dev server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

- **Storefront:** `/`
- **Product detail:** `/product/[id]`
- **Checkout:** `/checkout`
- **User account / order tracking:** `/account`
- **Admin panel:** `/admin`

## 📁 Project Structure
```
src/app/                  # Next.js routes
  api/                    # REST API (products, sliders, orders, settings, upload)
  admin/                  # Admin panel pages
  checkout/               # Checkout page
  thank-you/              # Printable invoice page
src/components/
  storefront/             # Navbar, HeroSlider, ProductCard, Testimonials, VisionPanel, Footer
  admin/                  # AdminSidebar
src/db/                   # Drizzle schema + client
src/lib/                  # ImageKit + utilities
src/store/                # Zustand cart store
scripts/seed.ts           # Seed script
drizzle/                  # Generated SQL migrations
```

## 🛠 Tech Notes
- Uses **Drizzle ORM** with **Neon serverless driver** (`drizzle-orm/neon-http`)
- **ImageKit** used for product & slider image uploads (with remote-pattern config in `next.config.ts`)
- Cart state persisted in `localStorage` via Zustand `persist`
- Green & white medical theme (`#0F766E` / `#16A34A`)

> Note: On Windows, if you hit a "Cannot find native binding" error for `lightningcss` / `@next/swc`, remove `node_modules` + `package-lock.json` and run `npm install` again.

Created by **Muhammad Ayan**.
