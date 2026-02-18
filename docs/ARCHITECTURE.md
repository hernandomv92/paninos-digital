# 🏗️ Paninos Project Architecture

This document serves as the high-level map of the Paninos digital ecosystem. It describes how the components interact, the data flow, and the key technologies involved.

## 🌟 Core Philosophy
**"Loggro is the Source of Truth, Antigravity is the Experience."**

We do not create products or prices. We display what Loggro provides and send orders back to it. Our value is in the **Speed**, **UX**, and **Reliability** of the ordering process.

## 🧩 System Components

### 1. The Brain (Loggro Restobar)
- **Role:** ERP, POS, Inventory Management.
- **Responsibility:** Master data for Products, Prices, and Stock. Receives final orders.
- **Integration:** REST API.

### 2. The Body (Backend - Django)
- **Role:** API Gateway & Logic Layer.
- **Technology:** Django 5 + Django REST Framework.
- **Database:** PostgreSQL (Supabase) via Transaction Pooler (Port 6543).
- **Key Functions:**
  - Mirrors Loggro data (Sync).
  - Handles Order creation logic.
  - Manages "Pending Sync" state if Loggro is down.
  - Serves API to Frontend (`/api/menu`, `/api/orders`).

### 3. The Face (Frontend - Next.js)
- **Role:** Customer User Interface.
- **Technology:** Next.js 14+ (App Router), Tailwind CSS v4.
- **Key Functions:**
  - Displays Menu (ISR/SSG for speed).
  - Shopping Cart State.
  - Checkout Form.
  - Optimistic UI updates.

### 4. The Voice (Notifications - Evolution API)
- **Role:** WhatsApp Messaging.
- **Technology:** Evolution API (WhatsApp Instance).
- **Key Functions:**
  - Sends order confirmation to Customer.
  - Alerts Store Staff of new orders.

---

## 🔄 Data Flow

### 1. Menu Synchronization (Read)
`Loggro API` -> `Django Command (sync_menu)` -> `Supabase (PostgreSQL)` -> `Next.js API Route` -> `User Device`

### 2. Order Placing (Write)
`User Device` -> `Next.js Checkout` -> `Django API` -> `Supabase (Pending)` -> `Django Signal/Task` -> `Loggro API` -> `Supabase (Confirmed)`

---

## 🛠️ Infrastructure (VPS Hostinger)
- **OS:** Ubuntu (Dockerized Environment).
- **Management:** Easypanel.
- **Reverse Proxy:** Traefik (handles SSL automatically).
- **Resources:** 4GB RAM, 1 vCPU (Efficiency is paramount).

## 🔒 Security Principles
- **Environment Variables:** ALL secrets (API Keys, DB URLs) must be in `.env`.
- **Database Access:** Frontend NEVER talks to Database directly. Always via Django API.
- **Cors:** Strict CORS policy allowing only `paninos.co` and localhost.
