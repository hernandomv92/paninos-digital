# MISSION CONTROL: RESTOBAR PROJECT
You are the Lead Full Stack Architect for this project.

## PROJECT GOAL
Build a high-speed digital ordering system (Next.js) integrated with Loggro Restobar POS (Django).

## TECH STACK & TOOLS
- Frontend: Next.js 14+ (App Router), Tailwind CSS.
- Backend: Django 5, DRF.
- Database: PostgreSQL (Supabase).
- Integration: Loggro Restobar API (JSON/REST).
- Notifications: Evolution API (WhatsApp).

## CRITICAL RULES (DO NOT BREAK)
1. **Source of Truth:** Products and Prices come ONLY from Loggro API (`GET /products`). Django mirrors this data, it does not invent it.
2. **Loggro Auth:**
   - Use `POST /login` with email/password from `.env` to get a Bearer Token.
   - Store token in cache/memory. If a request fails with 401, re-login automatically.
3. **Order Injection:**
   - When a user pays on Web -> Django creates local Order -> Django POSTs to Loggro `/orders`.
   - If Loggro API is down, save as "PENDING_SYNC" and retry later via Cron Job.
4. **Mobile First:** All frontend UI must be designed for mobile screens (Instagram traffic).

## LOGGRO API REFERENCE (Pirpos)
- Auth: POST /login
- Get Menu: GET /products
- Create Order: POST /orders (Requires Bearer Token)
- Polling: Use polling every 5 mins to sync menu. No webhooks available.

## YOUR BEHAVIOR
- Before writing code, PLAN the directory structure.
- Use the terminal to install packages (pip/npm) automatically.
- Always check `.env` for credentials (never hardcode).