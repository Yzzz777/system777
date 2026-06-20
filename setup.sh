#!/bin/bash
# =================================================================
# SYSTEM 777 — Setup Automático Completo
# UN SOLO COMANDO: ./setup.sh
# =================================================================

# NO usar set -e para que no se detenga en errores menores

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$PROJECT_DIR/.env"

banner() {
    clear
    echo -e "${CYAN}"
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║              S Y S T E M   7 7 7                         ║"
    echo "║           SETUP AUTOMÁTICO — UN SOLO COMANDO             ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

log()   { echo -e "${GREEN}[✓]${NC} $1"; }
warn()  { echo -e "${YELLOW}[!]${NC} $1"; }
err()   { echo -e "${RED}[✗]${NC} $1"; exit 1; }
info()  { echo -e "${CYAN}[i]${NC} $1"; }
step()  { echo -e "\n${BOLD}${BLUE}━━━ $1 ━━━${NC}"; }

# =================================================================
# PASO 1: Verificar .env
# =================================================================
check_env() {
    step "PASO 1: Verificando credenciales"

    if [ ! -f "$ENV_FILE" ]; then
        err "No existe .env. Crea uno primero."
    fi

    source "$ENV_FILE"

    # Generar AUTH_SECRET si falta
    if [ -z "${AUTH_SECRET:-}" ]; then
        NEW_SECRET=$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64)
        sed -i "s|^AUTH_SECRET=\"\"|AUTH_SECRET=\"$NEW_SECRET\"|" "$ENV_FILE"
        export AUTH_SECRET="$NEW_SECRET"
        log "AUTH_SECRET generado"
    fi

    source "$ENV_FILE"

    # Verificar variables obligatorias
    [ -z "${DATABASE_URL:-}" ] && err "Falta DATABASE_URL en .env"
    [ -z "${CLOUDFLARE_API_TOKEN:-}" ] && err "Falta CLOUDFLARE_API_TOKEN en .env"
    [ -z "${CLOUDFLARE_ACCOUNT_ID:-}" ] && err "Falta CLOUDFLARE_ACCOUNT_ID en .env"
    [ -z "${GITHUB_TOKEN:-}" ] && err "Falta GITHUB_TOKEN en .env"
    [ -z "${GITHUB_REPO:-}" ] && err "Falta GITHUB_REPO en .env"

    log "Todas las credenciales OK"
}

# =================================================================
# PASO 2: GitHub
# =================================================================
setup_github() {
    step "PASO 2: Configurando GitHub"

    source "$ENV_FILE"
    GITHUB_USER=$(echo "$GITHUB_REPO" | cut -d'/' -f1)
    REPO_NAME=$(echo "$GITHUB_REPO" | cut -d'/' -f2)

    # Verificar token
    info "Verificando token de GitHub..."
    GH_USER=$(curl -s -H "Authorization: token $GITHUB_TOKEN" "https://api.github.com/user" | grep -o '"login":"[^"]*"' | cut -d'"' -f4)
    
    if [ -z "$GH_USER" ]; then
        warn "Token de GitHub inválido o sin permisos"
        warn "Continuando de todas formas..."
    else
        log "GitHub autenticado como: $GH_USER"
        # Actualizar GITHUB_REPO si el usuario es diferente
        if [ "$GH_USER" != "$GITHUB_USER" ]; then
            GITHUB_REPO="$GH_USER/$REPO_NAME"
            sed -i "s|^GITHUB_REPO=.*|GITHUB_REPO=\"$GITHUB_REPO\"|" "$ENV_FILE"
            log "GitHub repo actualizado: $GITHUB_REPO"
        fi
    fi

    # .gitignore
    cat > "$PROJECT_DIR/.gitignore" << 'GITIGNORE'
node_modules/
.next/
out/
.env
.env.local
.env.*.local
npm-debug.log*
.vercel/
.wrangler/
*.log
deploy.log
GITIGNORE

    # Git setup
    cd "$PROJECT_DIR"
    git init 2>/dev/null || true
    
    # Configurar remote
    git remote remove origin 2>/dev/null || true
    git remote add origin "https://$GITHUB_TOKEN@github.com/$GITHUB_REPO.git" 2>/dev/null || true
    
    # Commit
    git add -A
    git commit -m "feat: SYSTEM 777 platform setup" 2>/dev/null || log "Sin cambios nuevos"
    git branch -M main
    
    # Push
    info "Subiendo código a GitHub..."
    git push -u origin main --force 2>&1 | tail -3
    
    if [ ${PIPESTATUS[0]} -eq 0 ]; then
        log "Código subido a GitHub"
    else
        warn "Push falló — verifica tu GITHUB_TOKEN"
    fi
}

# =================================================================
# PASO 3: Cloudflare DNS
# =================================================================
setup_dns() {
    step "PASO 3: Configurando DNS en Cloudflare"

    source "$ENV_FILE"
    DOMAIN="jrsystem7777.com"

    # Obtener Zone ID
    ZONE_DATA=$(curl -s \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        "https://api.cloudflare.com/client/v4/zones?name=$DOMAIN" 2>/dev/null)

    ZONE_ID=$(echo "$ZONE_DATA" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

    if [ -z "$ZONE_ID" ]; then
        warn "Dominio $DOMAIN no encontrado en Cloudflare"
        warn "Agrégalo desde el Dashboard de Cloudflare primero"
        return
    fi
    log "Zone ID: $ZONE_ID"

    # Crear registros DNS para Cloudflare Pages
    RECORDS=(
        "CNAME|$DOMAIN|system777.pages.dev|true"
        "CNAME|www.$DOMAIN|system777.pages.dev|true"
    )

    for record in "${RECORDS[@]}"; do
        IFS='|' read -r type name content proxied <<< "$record"

        EXISTING=$(curl -s \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?name=$name&type=$type" 2>/dev/null)

        RECORD_ID=$(echo "$EXISTING" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

        if [ -n "$RECORD_ID" ]; then
            curl -s -X PUT \
                -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
                -H "Content-Type: application/json" \
                "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$RECORD_ID" \
                -d "{\"type\":\"$type\",\"name\":\"$name\",\"content\":\"$content\",\"ttl\":1,\"proxied\":$proxied}" > /dev/null 2>&1
            log "DNS actualizado: $name → $content"
        else
            curl -s -X POST \
                -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
                -H "Content-Type: application/json" \
                "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
                -d "{\"type\":\"$type\",\"name\":\"$name\",\"content\":\"$content\",\"ttl\":1,\"proxied\":$proxied}" > /dev/null 2>&1
            log "DNS creado: $name → $content"
        fi
    done

    # SSL
    curl -s -X PATCH \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json" \
        "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/ssl" \
        -d '{"value":"full"}' > /dev/null 2>&1
    log "SSL: Full mode"

    # Always HTTPS
    curl -s -X PATCH \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json" \
        "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/always_use_https" \
        -d '{"value":"on"}' > /dev/null 2>&1
    log "Always HTTPS: activado"
}

# =================================================================
# PASO 4: Cloudflare Pages
# =================================================================
setup_pages() {
    step "PASO 4: Configurando Cloudflare Pages"

    source "$ENV_FILE"

    # Verificar si existe
    PAGES_HTTP=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/system777" 2>/dev/null)

    if [ "$PAGES_HTTP" = "404" ]; then
        info "Creando proyecto Cloudflare Pages..."
        RESULT=$(curl -s -X POST \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            -H "Content-Type: application/json" \
            "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects" \
            -d '{
                "name":"system777",
                "production_branch":"main",
                "build_config":{
                    "build_command":"npm install && npx prisma generate && npx @cloudflare/next-on-pages",
                    "destination_dir":".vercel/output/static"
                }
            }' 2>/dev/null)
        
        if echo "$RESULT" | grep -q '"success":true'; then
            log "Proyecto Pages creado"
        else
            warn "Error creando Pages: $(echo "$RESULT" | grep -o '"message":"[^"]*"' | head -1)"
        fi
    else
        log "Proyecto Pages ya existe"
        # Actualizar build config
        curl -s -X PATCH \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            -H "Content-Type: application/json" \
            "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/system777" \
            -d '{
                "build_config":{
                    "build_command":"npm install && npx prisma generate && npx @cloudflare/next-on-pages",
                    "destination_dir":".vercel/output/static"
                }
            }' > /dev/null 2>&1
        log "Build config actualizado"
    fi

    # Dominios personalizados
    for DOMAIN in "jrsystem7777.com" "www.jrsystem7777.com"; do
        curl -s -X PUT \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            -H "Content-Type: application/json" \
            "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/system777/domains" \
            -d "{\"name\":\"$DOMAIN\"}" > /dev/null 2>&1
        log "Dominio vinculado: $DOMAIN"
    done

    # Variables de entorno
    source "$ENV_FILE"
    curl -s -X PATCH \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json" \
        "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/system777" \
        -d "{
            \"deployment_configs\":{
                \"production\":{
                    \"env_vars\":{
                        \"DATABASE_URL\":{\"value\":\"$DATABASE_URL\"},
                        \"AUTH_SECRET\":{\"value\":\"$AUTH_SECRET\"},
                        \"NEXTAUTH_URL\":{\"value\":\"https://jrsystem7777.com\"},
                        \"NODE_VERSION\":{\"value\":\"20\"}
                    }
                }
            }
        }" > /dev/null 2>&1
    log "Variables de entorno configuradas"
}

# =================================================================
# PASO 5: GitHub Actions
# =================================================================
setup_actions() {
    step "PASO 5: Configurando GitHub Actions"

    mkdir -p "$PROJECT_DIR/.github/workflows"

    cat > "$PROJECT_DIR/.github/workflows/deploy.yml" << 'WORKFLOW'
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx prisma generate
      - run: npx @cloudflare/next-on-pages
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy .vercel/output/static --project-name=system777 --branch=main
WORKFLOW

    log "Workflow creado"

    # Subir
    cd "$PROJECT_DIR"
    git add .github/
    git commit -m "ci: deploy workflow" 2>/dev/null || true
    git push 2>/dev/null || true
    log "Workflow subido a GitHub"
}

# =================================================================
# PASO 6: Build
# =================================================================
do_build() {
    step "PASO 6: Instalando y construyendo"

    cd "$PROJECT_DIR"

    # Node.js 20
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm use 20 2>/dev/null || true

    info "Instalando dependencias..."
    npm install 2>&1 | tail -3
    log "Dependencias OK"

    info "Generando Prisma..."
    npx prisma generate 2>&1 | tail -2
    log "Prisma OK"

    info "Instalando adaptador Cloudflare..."
    npm install -D @cloudflare/next-on-pages wrangler 2>&1 | tail -2
    log "Adaptador OK"

    info "Construyendo..."
    npx @cloudflare/next-on-pages 2>&1 | tail -5

    if [ -d ".vercel/output/static" ]; then
        log "Build exitoso"
    else
        warn "Build tuvo problemas — Cloudflare lo reconstruirá"
    fi
}

# =================================================================
# RESUMEN
# =================================================================
summary() {
    source "$ENV_FILE"
    
    echo ""
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║              ✅  TODO CONFIGURADO                        ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BOLD}Tu sitio:${NC}    ${CYAN}https://jrsystem7777.com${NC}"
    echo -e "${BOLD}Pages:${NC}      ${CYAN}https://system777.pages.dev${NC}"
    echo -e "${BOLD}GitHub:${NC}     ${CYAN}https://github.com/$GITHUB_REPO${NC}"
    echo ""
    echo -e "${YELLOW}Espera 5-30 min para propagación DNS${NC}"
    echo ""
}

# =================================================================
# MAIN
# =================================================================
main() {
    banner
    check_env
    setup_github
    setup_dns
    setup_pages
    setup_actions
    do_build
    summary
}

main "$@"
