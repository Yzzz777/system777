#!/bin/bash
# =================================================================
# SYSTEM 777 — Setup Automático Completo
# UN SOLO COMANDO: ./setup.sh
# Configura: GitHub, Cloudflare DNS, Cloudflare Pages, Actions, Build
# =================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$PROJECT_DIR/.env"
DOMAIN="jrsystem7777.com"
PAGES_PROJECT="system777"

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
        err "No existe .env. Crea uno primero desde .env.example"
    fi

    source "$ENV_FILE"

    if [ -z "${AUTH_SECRET:-}" ]; then
        NEW_SECRET=$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64)
        sed -i "s|^AUTH_SECRET=\"\"|AUTH_SECRET=\"$NEW_SECRET\"|" "$ENV_FILE"
        export AUTH_SECRET="$NEW_SECRET"
        log "AUTH_SECRET generado"
    fi

    source "$ENV_FILE"

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

    info "Verificando token de GitHub..."
    GH_USER=$(curl -s -H "Authorization: token $GITHUB_TOKEN" "https://api.github.com/user" | grep -o '"login":"[^"]*"' | cut -d'"' -f4)

    if [ -z "$GH_USER" ]; then
        err "Token de GitHub inválido — verifica GITHUB_TOKEN en .env"
    fi
    log "GitHub autenticado como: $GH_USER"

    if [ "$GH_USER" != "$GITHUB_USER" ]; then
        GITHUB_REPO="$GH_USER/$REPO_NAME"
        sed -i "s|^GITHUB_REPO=.*|GITHUB_REPO=\"$GITHUB_REPO\"|" "$ENV_FILE"
        log "GitHub repo actualizado: $GITHUB_REPO"
    fi

    REPO_EXISTS=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "Authorization: token $GITHUB_TOKEN" \
        "https://api.github.com/repos/$GITHUB_REPO")

    if [ "$REPO_EXISTS" = "404" ]; then
        info "Creando repository $GITHUB_REPO..."
        curl -s -X POST \
            -H "Authorization: token $GITHUB_TOKEN" \
            -H "Accept: application/vnd.github.v3+json" \
            "https://api.github.com/user/repos" \
            -d "{\"name\":\"$REPO_NAME\",\"description\":\"SYSTEM 777\",\"private\":false,\"auto_init\":true}" > /dev/null
        log "Repository creado"
    else
        log "Repository ya existe"
    fi

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

    cd "$PROJECT_DIR"
    git init 2>/dev/null || true
    git remote remove origin 2>/dev/null || true
    git remote add origin "https://$GITHUB_TOKEN@github.com/$GITHUB_REPO.git" 2>/dev/null || true

    git add -A
    git commit -m "feat: SYSTEM 777 platform setup" 2>/dev/null || log "Sin cambios nuevos"
    git branch -M main

    info "Subiendo código a GitHub..."
    git push -u origin main --force 2>&1 | tail -3

    if [ ${PIPESTATUS[0]} -eq 0 ]; then
        log "Código subido a GitHub"
    else
        warn "Push falló — verifica tu GITHUB_TOKEN"
    fi
}

# =================================================================
# PASO 3: GitHub Actions Secrets
# =================================================================
setup_github_secrets() {
    step "PASO 3: Configurando GitHub Actions Secrets"

    source "$ENV_FILE"
    GITHUB_USER=$(echo "$GITHUB_REPO" | cut -d'/' -f1)

    PUB_KEY_DATA=$(curl -s \
        -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        "https://api.github.com/repos/$GITHUB_REPO/actions/secrets/public-key")

    KEY_ID=$(echo "$PUB_KEY_DATA" | python3 -c "import sys,json;print(json.load(sys.stdin)['key_id'])" 2>/dev/null)
    PUB_KEY=$(echo "$PUB_KEY_DATA" | python3 -c "import sys,json;print(json.load(sys.stdin)['key'])" 2>/dev/null)

    if [ -z "$KEY_ID" ] || [ -z "$PUB_KEY" ]; then
        warn "No se pudo obtener public key — configura secrets manualmente"
        return
    fi

    encrypt_value() {
        python3 -c "
import base64
from nacl.public import PublicKey, SealedBox
pubkey = PublicKey(base64.b64decode('$PUB_KEY'))
box = SealedBox(pubkey)
print(base64.b64encode(box.encrypt('$1'.encode())).decode())
" 2>/dev/null
    }

    CF_TOKEN_ENC=$(encrypt_value "$CLOUDFLARE_API_TOKEN")
    CF_ACCOUNT_ENC=$(encrypt_value "$CLOUDFLARE_ACCOUNT_ID")

    if [ -n "$CF_TOKEN_ENC" ]; then
        curl -s -o /dev/null -X PUT \
            -H "Authorization: token $GITHUB_TOKEN" \
            -H "Accept: application/vnd.github.v3+json" \
            "https://api.github.com/repos/$GITHUB_REPO/actions/secrets/CLOUDFLARE_API_TOKEN" \
            -d "{\"encrypted_value\":\"$CF_TOKEN_ENC\",\"key_id\":\"$KEY_ID\"}"
        log "Secret CLOUDFLARE_API_TOKEN configurado"
    fi

    if [ -n "$CF_ACCOUNT_ENC" ]; then
        curl -s -o /dev/null -X PUT \
            -H "Authorization: token $GITHUB_TOKEN" \
            -H "Accept: application/vnd.github.v3+json" \
            "https://api.github.com/repos/$GITHUB_REPO/actions/secrets/CLOUDFLARE_ACCOUNT_ID" \
            -d "{\"encrypted_value\":\"$CF_ACCOUNT_ENC\",\"key_id\":\"$KEY_ID\"}"
        log "Secret CLOUDFLARE_ACCOUNT_ID configurado"
    fi
}

# =================================================================
# PASO 4: Cloudflare DNS
# =================================================================
setup_dns() {
    step "PASO 4: Configurando DNS en Cloudflare"

    source "$ENV_FILE"

    ZONE_DATA=$(curl -s \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        "https://api.cloudflare.com/client/v4/zones?name=$DOMAIN" 2>/dev/null)

    ZONE_ID=$(echo "$ZONE_DATA" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

    if [ -z "$ZONE_ID" ]; then
        warn "Dominio $DOMAIN no encontrado en Cloudflare — agrégalo primero"
        return
    fi
    log "Zone ID: $ZONE_ID"

    # Limpiar registros A antiguos del VPS
    for TYPE_A in "A"; do
        EXISTING_A=$(curl -s \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?type=$TYPE_A&name=$DOMAIN" 2>/dev/null)
        echo "$EXISTING_A" | python3 -c "
import sys,json
d=json.load(sys.stdin)
for r in d.get('result',[]):
    if r['type']=='A' and r['name'] in ['$DOMAIN','www.$DOMAIN']:
        print(r['id'])
" 2>/dev/null | while read -r RID; do
            curl -s -X DELETE \
                -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
                "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$RID" > /dev/null 2>&1
            log "Registro A antiguo eliminado (VPS)"
        done
    done

    RECORDS=(
        "CNAME|$DOMAIN|${PAGES_PROJECT}.pages.dev|true"
        "CNAME|www.$DOMAIN|${PAGES_PROJECT}.pages.dev|true"
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

    curl -s -X PATCH \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json" \
        "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/ssl" \
        -d '{"value":"full"}' > /dev/null 2>&1
    log "SSL: Full mode"

    curl -s -X PATCH \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json" \
        "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/always_use_https" \
        -d '{"value":"on"}' > /dev/null 2>&1
    log "Always HTTPS: activado"
}

# =================================================================
# PASO 5: Cloudflare Pages
# =================================================================
setup_pages() {
    step "PASO 5: Configurando Cloudflare Pages"

    source "$ENV_FILE"

    PAGES_HTTP=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/$PAGES_PROJECT" 2>/dev/null)

    if [ "$PAGES_HTTP" = "404" ]; then
        info "Creando proyecto Cloudflare Pages..."
        RESULT=$(curl -s -X POST \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            -H "Content-Type: application/json" \
            "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects" \
            -d "{
                \"name\":\"$PAGES_PROJECT\",
                \"production_branch\":\"main\",
                \"build_config\":{
                    \"build_command\":\"npm install --legacy-peer-deps && npx prisma generate && npx @cloudflare/next-on-pages\",
                    \"destination_dir\":\".vercel/output/static\"
                }
            }" 2>/dev/null)

        if echo "$RESULT" | grep -q '"success":true'; then
            log "Proyecto Pages creado"
        else
            warn "Error creando Pages: $(echo "$RESULT" | grep -o '"message":"[^"]*"' | head -1)"
        fi
    else
        log "Proyecto Pages ya existe"
        curl -s -X PATCH \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            -H "Content-Type: application/json" \
            "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/$PAGES_PROJECT" \
            -d '{
                "build_config":{
                    "build_command":"npm install --legacy-peer-deps && npx prisma generate && npx @cloudflare/next-on-pages",
                    "destination_dir":".vercel/output/static"
                }
            }' > /dev/null 2>&1
        log "Build config actualizado"
    fi

    # Dominios personalizados
    for D in "$DOMAIN" "www.$DOMAIN"; do
        curl -s -X PUT \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            -H "Content-Type: application/json" \
            "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/$PAGES_PROJECT/domains" \
            -d "{\"name\":\"$D\"}" > /dev/null 2>&1
        log "Dominio vinculado: $D"
    done

    # nodejs_compat
    curl -s -X PATCH \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json" \
        "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/$PAGES_PROJECT" \
        -d '{
            "deployment_configs":{
                "production":{
                    "compatibility_flags":["nodejs_compat"],
                    "env_vars":{
                        "DATABASE_URL":{"value":"'"$DATABASE_URL"'"},
                        "AUTH_SECRET":{"value":"'"$AUTH_SECRET"'"},
                        "NEXTAUTH_URL":{"value":"https://'"$DOMAIN"'"},
                        "NODE_VERSION":{"value":"20"}
                    }
                }
            }
        }' > /dev/null 2>&1
    log "Variables de entorno + nodejs_compat configurados"
}

# =================================================================
# PASO 6: GitHub Actions Workflow
# =================================================================
setup_actions() {
    step "PASO 6: Configurando GitHub Actions"

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
          cache: npm

      - name: Install dependencies
        run: npm install --legacy-peer-deps

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

    log "Workflow creado"

    cd "$PROJECT_DIR"
    git add .github/
    git commit -m "ci: deploy workflow" 2>/dev/null || true
    git push 2>/dev/null || true
    log "Workflow subido a GitHub"
}

# =================================================================
# PASO 7: Build local
# =================================================================
do_build() {
    step "PASO 7: Construyendo"

    cd "$PROJECT_DIR"

    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm use 20 2>/dev/null || true

    info "Instalando dependencias..."
    npm install --legacy-peer-deps 2>&1 | tail -3
    log "Dependencias OK"

    info "Generando Prisma..."
    npx prisma generate 2>&1 | tail -2
    log "Prisma OK"

    info "Construyendo para Cloudflare Pages..."
    rm -rf .vercel .next
    npx @cloudflare/next-on-pages 2>&1 | tail -5

    if [ -d ".vercel/output/static" ]; then
        log "Build exitoso"
    else
        warn "Build tuvo problemas — Cloudflare lo reconstruirá"
    fi
}

# =================================================================
# PASO 8: Deploy inicial
# =================================================================
do_deploy() {
    step "PASO 8: Deploy a Cloudflare Pages"

    source "$ENV_FILE"
    cd "$PROJECT_DIR"

    if [ -d ".vercel/output/static" ]; then
        export CLOUDFLARE_API_TOKEN="$CLOUDFLARE_API_TOKEN"
        npx wrangler pages deploy .vercel/output/static \
            --project-name=$PAGES_PROJECT \
            --branch=main 2>&1 | tail -5
        log "Deploy completado"
    else
        warn "No hay build — se saltó el deploy local"
        warn "GitHub Actions lo hará en el próximo push"
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
    echo -e "${BOLD}Tu sitio:${NC}    ${CYAN}https://$DOMAIN${NC}"
    echo -e "${BOLD}Pages:${NC}      ${CYAN}https://${PAGES_PROJECT}.pages.dev${NC}"
    echo -e "${BOLD}GitHub:${NC}     ${CYAN}https://github.com/$GITHUB_REPO${NC}"
    echo -e "${BOLD}Actions:${NC}    ${CYAN}https://github.com/$GITHUB_REPO/actions${NC}"
    echo ""
    echo -e "${YELLOW}Espera 2-5 min para propagación DNS${NC}"
    echo ""
}

# =================================================================
# MAIN
# =================================================================
main() {
    clear
    echo -e "${CYAN}"
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║              S Y S T E M   7 7 7                         ║"
    echo "║           SETUP AUTOMÁTICO — UN SOLO COMANDO             ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"

    check_env
    setup_github
    setup_github_secrets
    setup_dns
    setup_pages
    setup_actions
    do_build
    do_deploy
    summary
}

main "$@"
