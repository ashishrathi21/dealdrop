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

### 1. System Components & Integrations

The architecture comprises the Next.js frontend clients communicating via Server Actions to Supabase and Scraping APIs, alongside a separate cron-triggered routine running on the server.

```mermaid
graph TD
    subgraph Frontend [Next.js App Router - Client Layer]
        UI[UI Components / landing page]
        Charts[Recharts Engine]
        Forms[Add/Delete Product Forms]
    end

    subgraph Backend [Next.js App Router - Server Layer]
        Actions[Server Actions - actions.js]
        CronJob[Cron Route - POST /api/cron/check_price]
    end

    subgraph Services [External Integration Services]
        Firecrawl[Firecrawl Scraper API]
        Resend[Resend Email API]
    end

    subgraph Database [Database & Auth Layer]
        S_Auth[Supabase Auth]
        S_DB[(Supabase PostgreSQL)]
    end

    %% Connections
    UI -->|Render History| Charts
    Forms -->|Trigger| Actions
    Actions -->|Scrape Request| Firecrawl
    Actions -->|Query/Mutate| S_DB
    UI -->|Auth Check| S_Auth
    
    CronJob -->|Service Role Query| S_DB
    CronJob -->|Periodic Scrape| Firecrawl
    CronJob -->|Trigger Email Alert| Resend
    Resend -->|Delivery| UserMail([User Email Inbox])
```

---

### 2. Product Insertion Flow
When a user submits a product URL to track:

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser
    participant SA as Server Action (addProduct)
    participant FC as Firecrawl Scraper
    participant DB as Supabase DB

    User->>SA: Submit URL (Form Data)
    critical Authenticate User
        SA->>DB: Verify JWT token & getUser()
        DB-->>SA: User Authenticated
    end
    SA->>FC: Scrape URL (request JSON output matching schema)
    FC-->>SA: Return product details & current price
    
    rect rgb(240, 248, 255)
        note right of SA: Upsert product (onConflict user_id, url)
        SA->>DB: Upsert into 'products' table
        DB-->>SA: Product record created/updated
    end
    
    alt If new product OR price changed
        SA->>DB: Insert record into 'price_history'
    end
    
    SA-->>User: Success response & Revalidate client view
```

---

### 3. Periodic Cron Job Flow (Price Checking & Alerts)
Automated task triggered by a scheduler (e.g., Vercel Cron, GitHub Actions, or local curl):

```mermaid
sequenceDiagram
    autonumber
    participant Scheduler as Cron Scheduler
    participant API as POST /api/cron/check_price
    participant DB as Supabase DB
    participant FC as Firecrawl Scraper
    participant Resend as Resend Email Service

    Scheduler->>API: POST with Bearer CRON_SECRET
    API->>DB: Fetch all products (using Service Role)
    DB-->>API: List of tracked products
    
    loop Process Batch (Size: 5 concurrent requests)
        API->>FC: Scrape product URL
        FC-->>API: Return latest price & details
        API->>DB: Update 'products' table (current_price)
        
        alt Price Changed
            API->>DB: Insert into 'price_history'
        end

        alt Price Dropped (New Price < Old Price)
            API->>DB: Fetch user email by product.user_id (auth.admin)
            DB-->>API: User email address
            API->>Resend: sendPriceDropAlert(userEmail, product, oldPrice, newPrice)
            Resend-->>API: Send confirmation status
        end
    end
    
    API-->>Scheduler: Return summary results (Total processed, changed, alerts sent)
```

---

### 4. Security Architecture & RLS Model
*   **Row-Level Security (RLS)**: Enforced directly on the PostgreSQL level to guarantee tenant isolation.
    *   All queries (SELECT, INSERT, UPDATE, and DELETE) on the `products` table check `auth.uid() = user_id`.
    *   For the `price_history` table, queries check that the related product belongs to the authenticated user using `exists (select 1 from products where id = product_id and user_id = auth.uid())`.
*   **Bypassing RLS Securely**: The Cron job API endpoint bypasses RLS by using Supabase’s admin **Service Role Key** so it can query all products from all users simultaneously. This API endpoint is protected by a strong bearer token (`CRON_SECRET`) and will reject any request without it.

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
├── app/                              # Next.js App Router root directory
│   ├── api/                          # Backend API endpoints
│   │   └── cron/
│   │       └── check_price/
│   │           └── route.js          # Scheduled price checking logic (POST) & test trigger (GET)
│   ├── auth/                         # Authentication callback routes
│   │   └── callback/
│   │       └── route.js              # Handles post-OAuth code exchange to cookies
│   ├── actions.js                    # Server Actions containing secure database mutations (addProduct, deleteProduct, getProducts, signOut)
│   ├── globals.css                   # Custom global style utilities and Tailwind imports
│   ├── layout.js                     # HTML document template structure wrapping children
│   └── page.jsx                      # Route page handler. Switches view between LandingPage and Dashboard depending on session
├── components/                       # Client & Server React components
│   ├── ui/                           # Base UI primitives generated by Shadcn CLI
│   │   ├── badge.jsx                 # Status tags and discount indicators
│   │   ├── button.jsx                # Themeable button layouts
│   │   ├── card.jsx                  # Standard containers used across the dashboard
│   │   ├── dialog.jsx                # Overlay modals for user workflows
│   │   └── input.jsx                 # Text fields for forms
│   ├── AddProductForm.jsx            # Form component requesting product URLs with error tracking
│   ├── AuthButton.jsx                # Login/Sign out switch buttons
│   ├── AuthModal.js                  # Login/Signup forms connected to Supabase
│   ├── Dashboard.jsx                 # Dashboard workspace showing cards, general stats, and historical charts
│   ├── DashboardChart.jsx            # Aggregated user savings/tracking chart visualizer
│   ├── LandingPage.jsx               # Landing page with CTA, reviews, and FAQ accordion
│   ├── PriceChart.jsx                # Embedded line chart visualizer (Recharts) in each ProductCard
│   ├── ProductCard.jsx               # Cards showing image, price, store type, and actions (Delete/Expand charts)
│   ├── ThemeProvider.jsx             # React context provider for client-side styling themes
│   └── ThemeToggle.jsx               # Light/Dark mode header toggle switch
├── lib/                              # Helper libraries and module initializations
│   ├── email.js                      # Email compilation templates and Resend client dispatch actions
│   ├── firecrawl.js                  # Firecrawl scrapers with explicit JSON extract templates
│   └── utils.js                      # Class name merge utilities (clsx & tailwind-merge)
├── public/                           # Static assets served directly (icons, logo images, banner pictures)
├── utils/                            # Shared utilities and configurations
│   └── supabase/                     # Supabase JS SDK clients configurations
│       ├── client.js                 # Client-side component DB client
│       ├── middleware.js             # Next.js request middleware to check user authentication session
│       └── server.js                 # Server actions/API route DB client containing server cookies access
├── components.json                   # Configurations for Shadcn UI components
├── eslint.config.mjs                 # Linters configurations
├── jsconfig.json                     # JS path alias mapping (e.g. @/* mappings to directory roots)
├── next.config.mjs                   # Next.js configuration rules (e.g. allowing third-party product image domains)
├── package.json                      # Scripts, devDependencies, and dependencies versions lists
├── postcss.config.mjs                # PostCSS rules for Tailwind CSS compilations
└── proxy.js                          # Local environment forwarding proxy
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

### Relational Schema Diagram (ERD)

```mermaid
erDiagram
    users ||--o{ products : "tracks"
    products ||--o{ price_history : "has historical logs"

    users {
        uuid id PK
        string email
    }

    products {
        uuid id PK
        uuid user_id FK "References auth.users"
        text url "Unique with user_id"
        text name
        numeric current_price
        text currency
        text image_url
        timestamp created_at
        timestamp updated_at
    }

    price_history {
        uuid id PK
        uuid product_id FK "References products"
        numeric price
        text currency
        timestamp checked_at
    }
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
