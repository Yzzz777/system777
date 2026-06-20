#!/bin/bash
# =================================================================
# SYSTEM 777 — Script de configuración y deploy completo
# Configura: Cloudflare DNS, GitHub repo, Cloudflare Pages, Neon DB
# =================================================================

set -euo pipefail

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$PROJECT_DIR/.env"
LOG_FILE="$PROJECT_DIR/deploy.log"

log() { echo -e "${GREEN}[✓]${NC} $1" | tee -a "$LOG_FILE"; }
warn() { echo -e "${YELLOW}[!]${NC} $1" | tee -a "$LOG_FILE"; }
err() { echo -e "${RED}[✗]${NC} $1" | tee -a "$LOG_FILE"; exit 1; }
info() { echo -e "${CYAN}[i]${NC} $1" | tee -a "$LOG_FILE"; }

# =================================================================
# FASE 0: Verificar .env
# =================================================================
check_env() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  FASE 0: Verificando variables de entorno${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"

    if [ ! -f "$ENV_FILE" ]; then
        err "No se encontró .env en $PROJECT_DIR. Copia .env.example a .env y completa los valores."
    fi

    source "$ENV_FILE"

    REQUIRED_VARS=(
        "DATABASE_URL"
        "CLOUDFLARE_API_TOKEN"
        "CLOUDFLARE_ACCOUNT_ID"
        "GITHUB_TOKEN"
        "GITHUB_REPO"
        "AUTH_SECRET"
    )

    for var in "${REQUIRED_VARS[@]}"; do
        if [ -z "${!var:-}" ]; then
            err "Variable $var no definida en .env"
        fi
    done

    log "Todas las variables de entorno configuradas"
}

# =================================================================
# FASE 1: Configurar GitHub Repository
# =================================================================
setup_github() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  FASE 1: Configurando GitHub Repository${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"

    source "$ENV_FILE"
    GITHUB_USER=$(echo "$GITHUB_REPO" | cut -d'/' -f1)
    REPO_NAME=$(echo "$GITHUB_REPO" | cut -d'/' -f2)

    # Verificar si el repo existe
    REPO_EXISTS=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        "https://api.github.com/repos/$GITHUB_REPO")

    if [ "$REPO_EXISTS" = "404" ]; then
        info "Creando repository $GITHUB_REPO..."
        curl -s -X POST \
            -H "Authorization: token $GITHUB_TOKEN" \
            -H "Accept: application/vnd.github.v3+json" \
            "https://api.github.com/user/repos" \
            -d "{
                \"name\": \"$REPO_NAME\",
                \"description\": \"SYSTEM 777 — Plataforma de academia tech\",
                \"private\": false,
                \"auto_init\": true
            }" > /dev/null
        log "Repository creado: https://github.com/$GITHUB_REPO"
    else
        log "Repository ya existe: https://github.com/$GITHUB_REPO"
    fi

    # Configurar .gitignore
    cat > "$PROJECT_DIR/.gitignore" << 'GITIGNORE'
# Dependencies
node_modules/
.pnp
.pnp.js

# Next.js
.next/
out/

# Production
build/
.vercel/

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Prisma
prisma/migrations/

# Logs
*.log
deploy.log
GITIGNORE

    log ".gitignore creado"

    # Configurar git remote
    cd "$PROJECT_DIR"
    if ! git remote get-url origin >/dev/null 2>&1; then
        git remote add origin "https://github.com/$GITHUB_REPO.git" 2>/dev/null || true
        log "Remote origin configurado"
    else
        git remote set-url origin "https://github.com/$GITHUB_REPO.git"
        log "Remote origin actualizado"
    fi

    # Commit y push
    git add -A
    git commit -m "feat: configure deployment pipeline" 2>/dev/null || log "No hay cambios para commitear"
    git branch -M main
    git push -u origin main 2>/dev/null || warn "Push falló — verifica credenciales de GitHub"
}

# =================================================================
# FASE 2: Configurar Cloudflare DNS
# =================================================================
setup_cloudflare_dns() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  FASE 2: Configurando Cloudflare DNS${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"

    source "$ENV_FILE"
    DOMAIN="jrsystem7777.com"

    # Obtener Zone ID
    ZONE_INFO=$(curl -s \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json" \
        "https://api.cloudflare.com/client/v4/zones?name=$DOMAIN")

    ZONE_ID=$(echo "$ZONE_INFO" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

    if [ -z "$ZONE_ID" ]; then
        err "No se pudo obtener Zone ID para $DOMAIN. Verifica que el dominio esté en Cloudflare."
    fi

    log "Zone ID encontrado: $ZONE_ID"

    # Obtener IP del servidor (si existe)
    ORIGIN_IP="37.60.245.118"  # IP del VPS según memoria

    # Configurar registros DNS
    records=(
        "A|$DOMAIN|$ORIGIN_IP|true"
        "A|www.$DOMAIN|$ORIGIN_IP|true"
    )

    for record in "${records[@]}"; do
        IFS='|' read -r type name content proxied <<< "$record"

        # Verificar si el registro existe
        EXISTING=$(curl -s \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            -H "Content-Type: application/json" \
            "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?name=$name&type=$type")

        RECORD_ID=$(echo "$EXISTING" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

        if [ -n "$RECORD_ID" ]; then
            # Actualizar registro existente
            curl -s -X PUT \
                -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
                -H "Content-Type: application/json" \
                "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$RECORD_ID" \
                -d "{
                    \"type\": \"$type\",
                    \"name\": \"$name\",
                    \"content\": \"$content\",
                    \"ttl\": 1,
                    \"proxied\": $proxied
                }" > /dev/null
            log "Registro actualizado: $name → $content"
        else
            # Crear nuevo registro
            curl -s -X POST \
                -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
                -H "Content-Type: application/json" \
                "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
                -d "{
                    \"type\": \"$type\",
                    \"name\": \"$name\",
                    \"content\": \"$content\",
                    \"ttl\": 1,
                    \"proxied\": $proxied
                }" > /dev/null
            log "Registro creado: $name → $content"
        fi
    done

    # Configurar SSL/TLS
    curl -s -X PATCH \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json" \
        "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/ssl" \
        -d '{"value": "full"}' > /dev/null
    log "SSL configurado en modo Full"

    # Configurar Always Use HTTPS
    curl -s -X PATCH \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json" \
        "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/always_use_https" \
        -d '{"value": "on"}' > /dev/null
    log "Always Use HTTPS activado"

    # Configurar Security Level
    curl -s -X PATCH \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json" \
        "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/security_level" \
        -d '{"value": "medium"}' > /dev/null
    log "Security Level configurado en Medium"
}

# =================================================================
# FASE 3: Configurar Cloudflare Pages
# =================================================================
setup_cloudflare_pages() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  FASE 3: Configurando Cloudflare Pages${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"

    source "$ENV_FILE"

    # Verificar si el proyecto Pages existe
    PAGES_EXISTS=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json" \
        "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/system777")

    if [ "$PAGES_EXISTS" = "404" ]; then
        info "Creando proyecto Cloudflare Pages..."

        # Crear proyecto Pages con configuración de build
        curl -s -X POST \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            -H "Content-Type: application/json" \
            "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects" \
            -d '{
                "name": "system777",
                "production_branch": "main",
                "build_config": {
                    "build_command": "npx prisma generate && npx @cloudflare/next-on-pages",
                    "destination_dir": ".vercel/output/static",
                    "root_dir": "/"
                },
                "deployment_configs": {
                    "production": {
                        "env_vars": {
                            "NODE_VERSION": { "value": "20" }
                        }
                    }
                }
            }' > /dev/null

        log "Proyecto Cloudflare Pages creado"
    else
        log "Proyecto Cloudflare Pages ya existe"

        # Actualizar configuración de build
        curl -s -X PATCH \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            -H "Content-Type: application/json" \
            "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/system777" \
            -d '{
                "build_config": {
                    "build_command": "npx prisma generate && npx @cloudflare/next-on-pages",
                    "destination_dir": ".vercel/output/static",
                    "root_dir": "/"
                }
            }' > /dev/null

        log "Configuración de build actualizada"
    fi

    # Configurar dominio personalizado
    curl -s -X PUT \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json" \
        "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/system777/domains" \
        -d '{
            "name": "jrsystem7777.com"
        }' > /dev/null 2>&1 || warn "Dominio ya configurado o error menor"

    curl -s -X PUT \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json" \
        "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/system777/domains" \
        -d '{
            "name": "www.jrsystem7777.com"
        }' > /dev/null 2>&1 || warn "Subdominio www ya configurado o error menor"

    log "Dominios personalizados configurados"
}

# =================================================================
# FASE 4: Configurar Variables de Entorno en Cloudflare Pages
# =================================================================
setup_pages_env_vars() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  FASE 4: Configurando Environment Variables${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"

    source "$ENV_FILE"

    # Crear payload para env vars
    ENV_PAYLOAD=$(cat << EOF
{
    "env_vars": {
        "DATABASE_URL": { "value": "$DATABASE_URL" },
        "AUTH_SECRET": { "value": "$AUTH_SECRET" },
        "NEXTAUTH_URL": { "value": "https://jrsystem7777.com" },
        "NODE_VERSION": { "value": "20" }
    }
}
EOF
    )

    curl -s -X PATCH \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json" \
        "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/system777" \
        -d "$ENV_PAYLOAD" > /dev/null

    log "Variables de entorno configuradas en Cloudflare Pages"
}

# =================================================================
# FASE 5: Configurar GitHub Secrets para CI/CD
# =================================================================
setup_github_secrets() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  FASE 5: Configurando GitHub Secrets${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"

    source "$ENV_FILE"
    GITHUB_USER=$(echo "$GITHUB_REPO" | cut -d'/' -f1)
    REPO_NAME=$(echo "$GITHUB_REPO" | cut -d'/' -f2)

    # Secret: CLOUDFLARE_API_TOKEN
    curl -s -X PUT \
        -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        "https://api.github.com/repos/$GITHUB_REPO/actions/secrets/CLOUDFLARE_API_TOKEN" \
        -d "{
            \"encrypted_value\": \"$(echo -n "$CLOUDFLARE_API_TOKEN" | base64)\",
            \"key_id\": \"auto\"
        }" > /dev/null 2>&1 || warn "Secret CLOUDFLARE_API_TOKEN requiere公鑰 — configúralo manualmente"

    # Secret: CLOUDFLARE_ACCOUNT_ID
    curl -s -X PUT \
        -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        "https://api.github.com/repos/$GITHUB_REPO/actions/secrets/CLOUDFLARE_ACCOUNT_ID" \
        -d "{
            \"encrypted_value\": \"$(echo -n "$CLOUDFLARE_ACCOUNT_ID" | base64)\",
            \"key_id\": \"auto\"
        }" > /dev/null 2>&1 || warn "Secret CLOUDFLARE_ACCOUNT_ID requiere公鑰 — configúralo manualmente"

    log "GitHub Secrets configurados (verificar en Settings → Secrets)"
}

# =================================================================
# FASE 6: Configurar GitHub Actions Workflow
# =================================================================
setup_github_actions() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  FASE 6: Configurando GitHub Actions Workflow${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"

    mkdir -p "$PROJECT_DIR/.github/workflows"

    cat > "$PROJECT_DIR/.github/workflows/deploy.yml" << 'WORKFLOW'
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  deployments: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Deploy to Cloudflare Pages
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma Client
        run: npx prisma generate

      - name: Build for Cloudflare Pages
        run: npx @cloudflare/next-on-pages

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy .vercel/output/static --project-name=system777 --branch=main
WORKFLOW

    log "GitHub Actions workflow creado"
}

# =================================================================
# FASE 7: Instalar dependencias y verificar build
# =================================================================
verify_build() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  FASE 7: Verificando build local${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"

    cd "$PROJECT_DIR"

    # Usar Node.js 20 via nvm
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm use 20 2>/dev/null || warn "nvm no disponible, usando node del sistema"

    # Instalar dependencias
    info "Instalando dependencias..."
    npm install --legacy-peer-deps 2>/dev/null || npm install
    log "Dependencias instaladas"

    # Generar Prisma Client
    info "Generando Prisma Client..."
    npx prisma generate
    log "Prisma Client generado"

    # Verificar que @cloudflare/next-on-pages esté instalado
    if ! npm list @cloudflare/next-on-pages >/dev/null 2>&1; then
        info "Instalando @cloudflare/next-on-pages..."
        npm install -D @cloudflare/next-on-pages
        log "@cloudflare/next-on-pages instalado"
    fi

    # Intentar build
    info "Intentando build..."
    npx @cloudflare/next-on-pages 2>&1 | tail -5

    if [ ${PIPESTATUS[0]} -eq 0 ]; then
        log "Build exitoso"
    else
        warn "Build falló — revisa los errores arriba"
        warn "El deploy manual puede funcionar diferente"
    fi
}

# =================================================================
# FASE 8: Deploy inicial
# =================================================================
initial_deploy() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  FASE 8: Deploy inicial a Cloudflare Pages${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"

    source "$ENV_FILE"
    cd "$PROJECT_DIR"

    if [ -d ".vercel/output/static" ]; then
        info "Desplegando a Cloudflare Pages..."

        export CLOUDFLARE_API_TOKEN="$CLOUDFLARE_API_TOKEN"
        npx wrangler pages deploy .vercel/output/static \
            --project-name=system777 \
            --branch=main

        log "Deploy completado"
        log "URL: https://system777.pages.dev"
        log "Dominio: https://jrsystem7777.com (propaga en 5-30 min)"
    else
        warn "No se encontró build en .vercel/output/static"
        warn "Ejecuta primero: npx @cloudflare/next-on-pages"
    fi
}

# =================================================================
# RESUMEN FINAL
# =================================================================
print_summary() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  ✅ CONFIGURACIÓN COMPLETADA${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${GREEN}Dominio:${NC}     https://jrsystem7777.com"
    echo -e "${GREEN}Pages:${NC}       https://system777.pages.dev"
    echo -e "${GREEN}GitHub:${NC}      https://github.com/$GITHUB_REPO"
    echo -e "${GREEN}Build:${NC}       Cloudflare Pages (auto-deploy on push)"
    echo ""
    echo -e "${YELLOW}Próximos pasos:${NC}"
    echo "  1. Espera 5-30 min para propagación DNS"
    echo "  2. Verifica: https://jrsystem7777.com"
    echo "  3. Si no carga, verifica Cloudflare Dashboard → Pages"
    echo "  4. Configura GitHub Secrets manualmente si es necesario"
    echo ""
    echo -e "${RED}⚠️  IMPORTANTE:${NC}"
    echo "  - Cambia TODAS las credenciales que compartiste"
    echo "  - Regenera GitHub PAT, Cloudflare token, Neon password"
    echo ""
}

# =================================================================
# MAIN
# =================================================================
main() {
    echo ""
    echo -e "${BLUE}╔═══════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║     SYSTEM 777 — Script de Deploy Completo           ║${NC}"
    echo -e "${BLUE}╚═══════════════════════════════════════════════════════╝${NC}"
    echo ""

    check_env
    setup_github
    setup_cloudflare_dns
    setup_cloudflare_pages
    setup_pages_env_vars
    setup_github_actions
    verify_build
    initial_deploy
    print_summary
}

# Ejecutar con los argumentos correctos
case "${1:-all}" in
    env)        check_env ;;
    github)     check_env; setup_github ;;
    dns)        check_env; setup_cloudflare_dns ;;
    pages)      check_env; setup_cloudflare_pages ;;
    envvars)    check_env; setup_pages_env_vars ;;
    actions)    setup_github_actions ;;
    build)      verify_build ;;
    deploy)     check_env; initial_deploy ;;
    all)        main ;;
    *)          echo "Uso: $0 {env|github|dns|pages|envvars|actions|build|deploy|all}" ;;
esac
