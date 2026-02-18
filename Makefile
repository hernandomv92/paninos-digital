# Makefile for Paninos Project
# Optimized for Windows (Git Bash / WSL) and Linux

.PHONY: dev install build clean

# Detect OS
ifeq ($(OS),Windows_NT)
    PYTHON_VENV := .venv/Scripts/python.exe
    PIP_VENV := .venv/Scripts/pip.exe
else
    PYTHON_VENV := .venv/bin/python
    PIP_VENV := .venv/bin/pip
endif

install:
	@echo "Installing Backend Dependencies..."
	cd backend && $(PIP_VENV) install -r requirements.txt
	@echo "Installing Frontend Dependencies..."
	cd frontend && npm install

dev:
	@echo "Starting Development Servers..."
	# This requires a terminal that supports '&' for background tasks or running in separate terminals
	@echo "Please run 'npm run dev' in frontend and 'python manage.py runserver' in backend in separate terminals."

build-front:
	@echo "Building Frontend (Standalone)..."
	cd frontend && npm run build

clean:
	@echo "Cleaning up..."
	rm -rf frontend/.next
	rm -rf frontend/node_modules
	rm -rf backend/__pycache__
