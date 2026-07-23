# 🏷️ DealDrop — Real-Time E-Commerce Price Tracker

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Firecrawl](https://img.shields.io/badge/Firecrawl-Scraper-FF5D19?style=for-the-badge&logo=firecrawl)](https://firecrawl.dev/)
[![Resend](https://img.shields.io/badge/Resend-Email_Alerts-000000?style=for-the-badge&logo=resend)](https://resend.com/)

**DealDrop** is a modern, premium e-commerce price-tracking application built with Next.js 16, Tailwind CSS v4, and Supabase. By leveraging AI-powered web scraping via **Firecrawl**, it extracts product details, images, and prices dynamically from a variety of e-commerce storefronts. When price drops are detected, it notifies users in real time using **Resend** email alerts.

---

## 🌟 Key Features

*   **🌐 Smart E-Commerce Scraping**: Scrapes product details, current prices, currencies, and images automatically from links (supporting Amazon, Flipkart, Myntra, Ajio, Croma, and more) using Firecrawl's JSON schemas.
*   **📊 Interactive Price History & Charts**: Visualizes price movements over time using **Recharts** charts to help users decide the best time to buy.
*   **🔔 Automated Price Drop Alerts**: A secure cron-job endpoint checks prices periodically and sends automated email alerts via **Resend** when a price drop is detected.
*   **🔐 Secure User Authentication**: Authenticated workflows powered by Supabase Auth with custom Row-Level Security (RLS) policies.
*   **⚡ Modern Design System**: Built with Tailwind CSS v4, Shadcn components, glassmorphism UI accents, and dark-mode support.

---

## 🏗️ Technical Architecture

```mermaid
graph TD
    Client[Client App Router / UI] -->|Auth & Read/Write| Supabase[Supabase Database & Auth]
    Client -->|Server Actions| ServerActions[Next.js Server Actions]
    ServerActions -->|Web Scraping API| Firecrawl[Firecrawl JSON Extraction API]
    ServerActions -->|Persist Data| Supabase
    CronRoute[Automated Cron Endpoint / POST] -->|Fetch Products| Supabase
    CronRoute -->|Scrape Current Price| Firecrawl
    CronRoute -->|Detect Price Drop| EmailService[Email Alert Service]
    EmailService -->|Send Email| Resend[Resend SMTP/API]
    Resend -->|Notify| EndUser[E-mail Inbox]
```

---

## 🛠️ Tech Stack & Integration Partners

*   **Framework**: Next.js 16 (App Router, Server Actions, API routes)
*   **Database & Auth**: Supabase (PostgreSQL with RLS)
*   **Scraping Engine**: Firecrawl JS SDK
*   **Email Deliverability**: Resend SDK
*   **Charting**: Recharts
*   **Styling**: Tailwind CSS v4 & Shadcn / Base UI

---

## 📂 Project Structure

```
dealdrop/
├── app/                  # Next.js App Router folders
│   ├── actions.js        # Server Actions (CRUD, Auth redirects)
│   ├── api/cron/         # Background cron routes (Price checking logic)
│   └── page.jsx          # Dashboard root loader & landing router
├── components/           # Reusable UI React Components
│   ├── ui/               # Base UI components (Buttons, Cards, Inputs)
│   ├── AddProductForm.jsx# Tracking input panel
│   ├── Dashboard.jsx     # Main user workspace & analytics
│   ├── LandingPage.jsx   # Marketing page & call to actions
│   └── PriceChart.jsx    # Interactive SVG line graphs (Recharts)
├── lib/                  # Library configurations (Firecrawl, Resend, Email HTML)
└── utils/supabase/       # Server, client & middleware client creators
```

---

## 🗄️ Database Schema & Setup

Run the following SQL snippet inside the **Supabase SQL Editor** to construct the required tables, relations, and row-level security (RLS) rules:

```sql
-- 1. Create the products table
create table public.products (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  url text not null,
  name text not null,
  current_price numeric(10, 2) not null,
  currency text default 'USD' not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, url)
);

-- Enable Row Level Security (RLS)
alter table public.products enable row level security;

-- Policies for products table
create policy "Users can view their own products"
  on public.products for select
  using (auth.uid() = user_id);

create policy "Users can insert their own products"
  on public.products for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own products"
  on public.products for update
  using (auth.uid() = user_id);

create policy "Users can delete their own products"
  on public.products for delete
  using (auth.uid() = user_id);

-- 2. Create the price_history table
create table public.price_history (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  price numeric(10, 2) not null,
  currency text not null,
  checked_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.price_history enable row level security;

-- Policies for price_history table
create policy "Users can view price history of their own products"
  on public.price_history for select
  using (
    exists (
      select 1 from public.products
      where products.id = price_history.product_id
      and products.user_id = auth.uid()
    )
  );

create policy "Users can insert price history of their own products"
  on public.price_history for insert
  with check (
    exists (
      select 1 from public.products
      where products.id = price_history.product_id
      and products.user_id = auth.uid()
    )
  );

create policy "Users can delete price history of their own products"
  on public.price_history for delete
  using (
    exists (
      select 1 from public.products
      where products.id = price_history.product_id
      and products.user_id = auth.uid()
    )
  );
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the root of the `dealdrop` directory (or use `.env.local`):

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-public-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key" # Keep secret, used by cron

# Third-Party Integrations
FIRECRAWL_API_KEY="fc-xxxxxx..."
RESEND_API_KEY="re_xxxxxx..."
RESEND_FROM_EMAIL="DealDrop Alerts <alerts@yourdomain.com>"

# App Settings
NEXT_PUBLIC_APP_URL="http://localhost:3000"
CRON_SECRET="your-secure-cron-passphrase"
```

---

## 🚀 Getting Started

Follow these steps to run the application locally:

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/dealDrop.git
cd dealDrop/dealdrop
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## ⏰ Price Check Cron Job

To automate periodic price updates, send a authenticated `POST` request to the `/api/cron/check_price` route.

### Header Configuration:
*   **Authorization**: `Bearer <your-CRON_SECRET>`

### Query Parameters:
*   `test=true`: Simulates a mock price drop (decreases price by 10 points) without calling Firecrawl APIs, useful for testing Resend notification template behavior.

#### Example triggering locally:
```bash
curl -X POST http://localhost:3000/api/cron/check_price \
  -H "Authorization: Bearer your-secure-cron-passphrase"
```

In production, you can trigger this route periodically using **Vercel Cron Jobs**, **GitHub Actions**, or **Upstash Workflow**.

---

## 📄 License

This project is licensed under the MIT License.
