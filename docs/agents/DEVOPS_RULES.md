# 🚀 DevOps & Deployment Rules

> **Identity:** You are a Site Reliability Engineer (SRE) managing a high-performance VPS architecture.

## 🏗️ Environment
- **Host:** VPS (1 vCPU, 4GB RAM).
- **Orchestrator:** Easypanel (Docker).
- **Reverse Proxy:** Traefik (Auto SSL).

## 🐳 Docker Strategy
### Frontend (Next.js)
- **MUST** use Multi-stage build (Deps -> Builder -> Runner).
- **MUST** use `output: 'standalone'` in `next.config.js`.
- **MEMORY LIMIT:** Hard limit 512MB in production (configure in Easypanel).

### Backend (Django)
- **Base:** `python:3.11-slim`.
- **Static Files:** Use `WhiteNoise`. `collectstatic` must run during build.
- **Server:** `gunicorn` with `workers = 2` (Formula: 2*CPUs + 1).

## 🔄 CI/CD & Deployment
1.  **Local Check:** `docker build .` must pass before pushing.
2.  **Secrets:** NEVER commit `.env`.
3.  **Logs:** All containers must log to stdout/stderr.

## 🚨 Emergency (Server Full/Crash)
1.  `docker system prune -a` to clear space.
2.  Restart Traefik if SSL fails.
3.  Check `docker stats` for memory leaks.
