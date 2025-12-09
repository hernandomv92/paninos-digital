@echo off
echo ================================================
echo MIGRACIONES CON SQLITE (Desarrollo Local)
echo ================================================
echo.
echo Este script ejecutará las migraciones usando SQLite
echo en lugar de Supabase (útil para desarrollo local)
echo.
echo Presiona Ctrl+C para cancelar o cualquier tecla para continuar...
pause > nul

cd /d "%~dp0"

echo.
echo [1/3] Comentando DATABASE_URL temporalmente...
echo # DATABASE_URL comentada temporalmente para usar SQLite > .env.temp
type core\.env | findstr /V "DATABASE_URL" >> .env.temp
move /Y .env.temp core\.env > nul

echo [2/3] Ejecutando migraciones con SQLite...
python manage.py migrate

echo.
echo [3/3] Migraciones completadas!
echo.
echo NOTA: Para volver a usar Supabase, descomenta DATABASE_URL en core\.env
echo.
pause
