# Rakib Panjabi House

> **Premium Panjabi & Fashion E-commerce Store**
> A luxurious, modern online store for traditional and contemporary menswear, built with Next.js 16, TypeScript, Supabase, and Tailwind CSS.

![Status](https://img.shields.io/badge/status-in_development-orange)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4)

---

## 🌟 Overview

**Rakib Panjabi House** is a full-featured e-commerce platform specializing in premium Panjabis, shirts, ethnic wear, and accessories. The design is inspired by top global fashion brands — luxurious, minimal, fast, and conversion-focused.

### ✨ Key Features

- 🛍️ **Full E-commerce Flow** — Browse, search, filter, cart, checkout, order tracking
- 👤 **User Authentication** — Email/password + Google OAuth via Supabase Auth
- 🎨 **Premium Design** — Charcoal + cream + gold palette, Playfair Display + Inter typography
- 📱 **Fully Responsive** — Mobile-first, tablet, desktop, ultra-wide
- 🌙 **Dark Mode** — System-aware with manual toggle
- ⚡ **Blazing Fast** — Server-side rendering, image optimization, lazy loading
- 🔍 **SEO Optimized** — Structured data, sitemap, robots.txt, OpenGraph
- 🌐 **Multi-language Ready** — English + Bengali (i18n)
- 💳 **Multiple Payment Methods** — SSLCommerz, Stripe, bKash, Nagad, COD
- 📦 **Shipping Integration** — Pathao, SteadFast, RedX, Sundarban
- 📊 **Admin Dashboard** — Product, order, customer, inventory management
- 📝 **Blog & Content** — Articles, lookbook, brand story

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 + shadcn/ui |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth + Google OAuth |
| **ORM/Client** | @supabase/supabase-js + @supabase/ssr |
| **State Management** | Zustand (client) + TanStack Query (server) |
| **Forms** | React Hook Form + Zod |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Fonts** | Playfair Display (serif) + Inter (sans) |
| **Deployment** | Vercel |
| **Image Storage** | Cloudinary (planned) |

---

## 📦 Project Structure

```
src/
├── app/
│   ├── (auth)/                    # Auth route group (login, register, forgot-password)
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── auth/callback/            # OAuth callback route
│   ├── layout.tsx                # Root layout (fonts, ThemeProvider, SEO metadata)
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Premium theme (charcoal + gold + cream)
│
├── components/
│   ├── layout/                   # Header, Footer, Container, SectionHeading
│   ├── home/                     # Homepage sections (Hero, Flash Sale, etc.)
│   ├── cart/                     # Cart drawer
│   ├── ui/                       # shadcn/ui primitives
│   ├── logo.tsx                  # Brand logo component
│   └── theme-provider.tsx        # next-themes wrapper
│
├── lib/
│   ├── supabase.ts               # Supabase client (server, browser, admin)
│   ├── auth-actions.ts           # Server actions for auth
│   ├── brand.ts                  # Brand config, categories, nav data
│   ├── store.ts                  # Zustand stores (cart, wishlist, compare)
│   ├── types.ts                  # TypeScript types
│   └── utils.ts                  # Utility functions
│
└── prisma/
    ├── schema.prisma             # Prisma schema (for reference)
    └── migrations/
        ├── 0000_bootstrap.sql    # One-time bootstrap SQL
        └── 0001_init.sql         # Complete database schema
```

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 18+ (or Bun)
- A Supabase account (free tier works)
- A GitHub account (for deployment)

### 2. Install Dependencies

```bash
# Using bun (recommended)
bun install

# Or using npm
npm install
```

### 3. Environment Setup

```bash
# Copy the example env file
cp .env.example .env.local

# Edit .env.local and fill in your Supabase credentials
# Get them from: https://supabase.com/dashboard/project/YOUR_PROJECT_REF/settings/database
```

### 4. Database Setup

1. Go to your Supabase project's SQL Editor:
   `https://supabase.com/dashboard/project/YOUR_PROJECT_REF/sql/new`
2. Open `prisma/migrations/0001_init.sql` and copy its entire contents
3. Paste into the SQL Editor and click **Run**
4. This creates all tables, triggers, RLS policies, and seed data

### 5. Run Development Server

```bash
bun run dev
# Visit http://localhost:3000
```

---

## 🎨 Design System

### Color Palette

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--background` | Warm Cream `oklch(0.985 0.002 95)` | Deep Charcoal `oklch(0.13 0.005 264)` | Page background |
| `--foreground` | Deep Charcoal `oklch(0.18 0.01 264)` | Warm White `oklch(0.95 0.005 80)` | Body text |
| `--primary` | Deep Charcoal | Warm Cream | Buttons, primary actions |
| `--accent` | Burnished Gold `oklch(0.72 0.13 75)` | Gold `oklch(0.75 0.13 75)` | Highlights, prices, CTAs |
| `--muted` | Light Beige | Dark Slate | Secondary backgrounds |
| `--border` | Light Beige | White 10% | Borders, dividers |

### Typography

- **Headings**: Playfair Display (serif) — elegant, editorial
- **Body**: Inter (sans-serif) — clean, readable
- **Sizes**: Mobile-first responsive scale (text-sm → text-7xl)

---

## 📊 Database Schema

The database includes 30+ tables covering:

- **Auth**: `profiles` (extends Supabase `auth.users`)
- **Catalog**: `categories`, `brands`, `products`, `product_images`, `product_variants`, `product_sizes`, `product_colors`, `product_specifications`, `product_tags`
- **Bundles**: `bundles`, `bundle_items`, `bundle_products`, `product_frequently_bought_together`
- **Cart/Wishlist**: `carts`, `cart_items`, `wishlist_items`, `compare_items`, `recently_viewed`
- **Orders**: `orders`, `order_items`, `order_tracking_history`, `payment_transactions`, `refunds`, `order_coupons`
- **Users**: `addresses`, `notifications`, `support_tickets`
- **Marketing**: `coupons`, `gift_vouchers`, `banners`
- **Content**: `blog_posts`, `blog_comments`
- **Settings**: `settings`, `newsletter_subscribers`

All tables have **Row Level Security (RLS)** policies for production-grade security.

---

## 🧪 Available Scripts

```bash
bun run dev          # Start dev server (port 3000)
bun run build        # Production build
bun run start        # Start production server
bun run lint         # Run ESLint
bun run db:push      # Push Prisma schema (legacy, use SQL migrations)
bun run db:generate  # Generate Prisma client
bun run db:studio    # Open Prisma Studio (DB GUI)
bun run db:seed      # Seed database with sample data
```

---

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Add all environment variables from `.env.example`
4. Set `NEXT_PUBLIC_SUPABASE_URL` to your production Supabase URL
5. Deploy!

### Update Supabase Auth URLs

After deployment, update your Supabase Auth settings:
- Go to Supabase Dashboard → Authentication → URL Configuration
- Set **Site URL** to your Vercel URL
- Add your Vercel URL to **Redirect URLs**

---

## 📝 License

This project is proprietary. All rights reserved by Rakib Panjabi House.

---

## 🤝 Contributing

This is a private commercial project. For any issues or feature requests, please contact the development team directly.

---

**Built with ❤️ in Bangladesh**
