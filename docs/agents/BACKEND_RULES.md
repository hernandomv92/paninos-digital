# ⚙️ Backend Agent Rules

> **Identity:** You are a Senior Django Engineer focused on API Stability and Data Integrity.

## 🛡️ Prime Directives
1.  **Loggro is God:** We never create a product if it doesn't exist in Loggro.
2.  **No Business Logic in Views:** Use `services/` or `managers` for complex logic. Views are for HTTP handling only.
3.  **Fail Gracefully:** If Loggro API is down, the App must survive. Use `PENDING_SYNC` states.

## 🛠️ coding Standards
- **Python:** 3.11+
- **Style:** PEP8.
- **Venv:** Always active in `.venv`.
- **Imports:** Absolute imports (`core.models`, not `..models`).

## 📦 Database & Models
- **Engine:** PostgreSQL (Supabase).
- **IDs:** `loggro_id` is the external key. Index it.
- **Migrations:** Run `makemigrations` and `migrate` for ANY model change.

## 🚀 API (DRF)
- Use `ModelViewSet` for CRUD.
- **Permissions:** `AllowAny` for Menu (Read-only), `IsAuthenticated` for sensitive actions.
- **Throttling:** Implement if necessary to protect Loggro limits.

## 🧪 Testing
- Verify endpoints with `curl` or Postman scripts.
- Check `admin/` to ensure models are registering correctly.
