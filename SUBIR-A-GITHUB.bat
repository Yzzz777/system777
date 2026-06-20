@echo off
title SYSTEM 777 - Subir a GitHub
color 0A

echo ========================================
echo   SYSTEM 777 - SUBIR A GITHUB
echo ========================================
echo.

echo [1/4] Verificando Git...
git --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: No tienes Git instalado.
    echo Descargalo de: https://git-scm.com/download/win
    echo Instalalo y vuelve a ejecutar este archivo.
    pause
    exit /b
)
echo Git encontrado: OK
echo.

echo [2/4] Configurando repositorio...
cd /d "%~dp0"
git init
git config user.email "angelsuarezx511@gmail.com"
git config user.name "System777"
git branch -M main
git add .
git commit -m "SYSTEM 777 - Academia Tecnologica"
echo Repositorio configurado: OK
echo.

echo [3/4] Conectando con GitHub...
echo.
echo IMPORTANTE: Antes de continuar, crea un repositorio en GitHub:
echo 1. Ve a https://github.com/new
echo 2. Nombre: system777
echo 3. Click "Create repository"
echo 4. Copia la URL (https://github.com/TU_USUARIO/system777.git)
echo.
set /p REPO_URL="Pega la URL del repositorio aqui: "
echo.

git remote add origin %REPO_URL% 2>nul
git remote set-url origin %REPO_URL%
echo Repositorio conectado: OK
echo.

echo [4/4] Subiendo codigo a GitHub...
echo Te pedira tu usuario y contrasena de GitHub.
echo.
git push -u origin main

echo.
echo ========================================
echo   ¡LISTO! Codigo subido a GitHub
echo ========================================
echo.
echo Siguiente paso:
echo 1. Ve a https://dash.cloudflare.com
echo 2. Workers and Pages - Create
echo 3. Connect to Git - Selecciona "system777"
echo 4. Build command: npx prisma generate ^&^& npx next build
echo 5. Build output: .next
echo 6. Save and Deploy
echo.
pause
